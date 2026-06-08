const { Op } = require("sequelize");
// Import related models to use in includes and sorting
const { Inventory, Category } = require("../models/index.sql");

class AdminAPIFeatures {
  constructor(model, queryString) {
    this.model = model;
    this.queryString = queryString;
    this.whereClause = {};
    this.orderBy = [];
    this.attributes = undefined; // Undefined allows Sequelize to fetch all by default
    this.offset = 0;
    this.limit = 100;

    // Pre-define our joins for the Admin queries
    this.includeMap = [
      {
        model: Inventory,
        attributes: ["id", "stock_quantity"],
        duplicating: false,
      },
      {
        model: Category,
        attributes: ["ID", "categoryname"],
        duplicating: false,
      },
    ];
  }

  search() {
    if (this.queryString.search) {
      const searchTerm = `%${this.queryString.search}%`;

      // 1. Apply the OR search logic using the Symbol Op.or
      this.whereClause[Op.or] = [
        { name: { [Op.like]: searchTerm } },
        {
          "$Category.categoryname$": {
            [Op.like]: searchTerm,
          },
        },
      ];

      // 2. THE FIX: Add a safe string key to bypass the Object.keys() bug in execute()
      // Since every product has an ID, this condition is always true and won't filter out valid data,
      // but it forces Object.keys(this.whereClause).length to be greater than 0!
      this.whereClause.ID = { [Op.not]: null };
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "limit", "sort", "fields", "search"];
    excludeFields.forEach((ele) => delete queryObj[ele]);

    const operatorMap = {
      gte: Op.gte,
      gt: Op.gt,
      lte: Op.lte,
      lt: Op.lt,
      ne: Op.ne,
    };

    Object.keys(queryObj).forEach((key) => {
      const value = queryObj[key];
      if (!value) return;

      // Intercept specific fields to point Sequelize to the joined tables
      let targetField = key;
      if (key.includes("stock_quantity"))
        targetField = "$Inventory.stock_quantity$";
      if (key.includes("categoryname")) targetField = "$Category.categoryname$";

      // SCENARIO 1: Bracket syntax (e.g., stock_quantity[lt]=10)
      if (key.includes("[") && key.includes("]")) {
        const field = key.substring(0, key.indexOf("["));
        const operator = key.substring(key.indexOf("[") + 1, key.indexOf("]"));
        const mappedField =
          field === "stock_quantity" ? "$Inventory.stock_quantity$" : field;

        if (operatorMap[operator]) {
          this.whereClause[mappedField] = this.whereClause[mappedField] || {};
          this.whereClause[mappedField][operatorMap[operator]] = value * 1;
        }
      }
      // SCENARIO 2: Nested object syntax (e.g., stock_quantity: { lt: '10' })
      else if (typeof value === "object" && !Array.isArray(value)) {
        const operatorString = Object.keys(value)[0];
        const actualValue = value[operatorString];

        if (operatorMap[operatorString]) {
          this.whereClause[targetField] = this.whereClause[targetField] || {};
          this.whereClause[targetField][operatorMap[operatorString]] =
            actualValue * 1;
        }
      }
      // SCENARIO 3: Exact match
      else {
        this.whereClause[targetField] = value;
      }
    });

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.orderBy = this.queryString.sort.split(",").map((s) => {
        const field = s.trim();
        const isDesc = field.startsWith("-");
        const cleanField = isDesc ? field.substring(1) : field;
        const direction = isDesc ? "DESC" : "ASC";

        // Target joined models for sorting
        if (cleanField === "stock_quantity") {
          return [Inventory, "stock_quantity", direction];
        } else if (cleanField === "categoryname") {
          return [Category, "categoryname", direction];
        } else {
          return [cleanField, direction];
        }
      });
    } else {
      this.orderBy = [["createdAt", "DESC"]];
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      this.attributes = this.queryString.fields.split(",").map((f) => f.trim());
    } else {
      // Instead of an array, leaving it undefined fetches all columns (best for includes)
      this.attributes = undefined;
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    this.limit = limit;
    this.offset = (page - 1) * limit;
    return this;
  }

  async execute() {
    const { count, rows } = await this.model.findAndCountAll({
      where: Object.keys(this.whereClause).length > 0 ? this.whereClause : {},
      include: this.includeMap,
      order: this.orderBy,
      attributes: this.attributes,
      limit: this.limit,
      offset: this.offset,
      distinct: true,
      subQuery: false,
    });

    return {
      results: Array.isArray(count) ? count.length : count,
      data: rows,
    };
  }
}

module.exports = AdminAPIFeatures;
