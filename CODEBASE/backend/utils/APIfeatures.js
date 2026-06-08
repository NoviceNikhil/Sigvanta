const { Sequelize, Op } = require("sequelize");
const { Category } = require("../models/index.sql");

class APIFeatures {
  constructor(model, queryString) {
    this.model = model;
    this.queryString = queryString;
    this.whereClause = {};
    this.orderBy = [];
    this.attributes = null;
    this.offset = 0;
    this.limit = 100;
    this.include = [];
  }

  search() {
    const { search } = this.queryString;
    if (!search) return this;

    const cleanSearch = search.trim();
    const searchPattern = `%${cleanSearch}%`;

    const keywords = cleanSearch
      .split(" ")
      .filter(
        (word) =>
          word.length > 2 &&
          !["and", "the", "for", "&"].includes(word.toLowerCase()),
      );

    const discoveryConditions = [
      { name: { [Op.like]: searchPattern } },
      { "$Category.categoryname$": { [Op.like]: searchPattern } },
    ];

    keywords.forEach((word) => {
      discoveryConditions.push({ name: { [Op.like]: `%${word}%` } });
      discoveryConditions.push({ description: { [Op.like]: `%${word}%` } });
      discoveryConditions.push({
        "$Category.categoryname$": { [Op.like]: `%${word}%` },
      });
    });

    this.whereClause[Op.or] = discoveryConditions;

    this.orderBy.unshift([
      this.model.sequelize.literal(`
      (CASE 
        WHEN Category.categoryname = ${this.model.sequelize.escape(cleanSearch)} THEN 1
        WHEN Product.name LIKE ${this.model.sequelize.escape(searchPattern)} THEN 2
        WHEN Product.description LIKE ${this.model.sequelize.escape(searchPattern)} THEN 3
        WHEN Category.categoryname LIKE ${this.model.sequelize.escape(searchPattern)} THEN 4
        ELSE 5
      END)`),
      "ASC",
    ]);

    this._ensureCategoryIncluded(false);
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

      if (key === "categoryname") {
        this.whereClause["$Category.categoryname$"] = value;
        this._ensureCategoryIncluded(true);
      }
      // --- INTEGRATED VIRTUAL DISCOUNT FILTERING ---
      else if (key.startsWith("discount[")) {
        const operator = key.substring(key.indexOf("[") + 1, key.indexOf("]"));
        if (operatorMap[operator]) {
          // Calculation: ((actual - discount) / actual) * 100
          const formula = this.model.sequelize.literal(
            "((CAST(actual_price AS DECIMAL) - CAST(discount_price AS DECIMAL)) / NULLIF(CAST(actual_price AS DECIMAL), 0)) * 100",
          );

          this.whereClause[Op.and] = this.whereClause[Op.and] || [];
          this.whereClause[Op.and].push(
            Sequelize.where(formula, operatorMap[operator], value * 1),
          );
        }
      } else if (key.includes("[") && key.includes("]")) {
        const field = key.substring(0, key.indexOf("["));
        const operator = key.substring(key.indexOf("[") + 1, key.indexOf("]"));
        if (operatorMap[operator]) {
          this.whereClause[field] = this.whereClause[field] || {};
          this.whereClause[field][operatorMap[operator]] = value * 1;
        }
      } else {
        this.whereClause[key] = value;
      }
    });

    return this;
  }

  _ensureCategoryIncluded(isRequired = false) {
    const existing = this.include.find((inc) => inc.model === Category);
    if (!existing) {
      this.include.push({
        model: Category,
        attributes: ["categoryname"],
        required: isRequired,
      });
    } else if (isRequired) {
      existing.required = true;
    }
  }

  sort() {
    if (this.queryString.sort) {
      this.orderBy = this.queryString.sort.split(",").map((s) => {
        const field = s.trim();
        const isDesc = field.startsWith("-");
        const actualField = isDesc ? field.substring(1) : field;

        // --- INTEGRATED VIRTUAL DISCOUNT SORTING ---
        if (actualField === "discount") {
          return [
            this.model.sequelize.literal(
              "((CAST(actual_price AS DECIMAL) - CAST(discount_price AS DECIMAL)) / NULLIF(CAST(actual_price AS DECIMAL), 0)) * 100",
            ),
            isDesc ? "DESC" : "ASC",
          ];
        }

        return isDesc ? [actualField, "DESC"] : [actualField, "ASC"];
      });
    } else {
      this.orderBy.push(["createdAt", "DESC"]);
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      this.attributes = this.queryString.fields.split(",").map((f) => f.trim());
    } else {
      this.attributes = { exclude: ["createdAt", "updatedAt"] };
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
      where: this.whereClause,
      order: this.orderBy,
      attributes: this.attributes,
      limit: this.limit,
      offset: this.offset,
      include: this.include,
      logging: console.log,
      distinct: true,
    });

    return { results: count, data: rows };
  }
}

module.exports = APIFeatures;
