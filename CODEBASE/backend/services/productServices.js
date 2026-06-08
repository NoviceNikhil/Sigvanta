const APIFeatures = require("../utils/APIfeatures");
const { Product } = require("../models/index.sql");

const getAllProducts = async (req) => {
  const features = new APIFeatures(Product, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .search();

  const { results, data: products } = await features.execute();

  return {
    results,
    products,
  };
  // NO try/catch needed - let controller handle
};

module.exports = { getAllProducts };
