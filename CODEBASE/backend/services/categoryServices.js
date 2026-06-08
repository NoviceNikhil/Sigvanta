const { Category } = require("../models/index.sql");

exports.getAllCategories = async () => {
  const categories = await Category.findAll();
  return categories;
};

exports.getCategoryByName = async (name) => {
  if (!name) return null;
  const category = await Category.findOne({ where: { categoryname: name } });
  return category;
};

exports.getCategoryById = async (id) => {
  if (!id) return null;
  const category = await Category.findByPk(id);
  return category;
};

exports.createCategory = async (data) => {
  const newCategory = await Category.create({
    categoryname: data.categoryname,
    icon: data.icon,
    color: data.color,
  });
  return newCategory;
};

exports.updateCategory = async (id, data) => {
  if (!id) return null;
  const category = await Category.findByPk(id);
  if (!category) return null;

  await category.update({
    categoryname: data.categoryname,
    icon: data.icon,
    color: data.color,
  });
  return category;
};

exports.patchCategory = async (id, data) => {
  if (!id) return null;
  const category = await Category.findByPk(id);
  if (!category) return null;

  await category.update(data); // partial update handles dynamic fields correctly
  return category;
};

exports.deleteCategory = async (id) => {
  if (!id) return null;
  const category = await Category.findByPk(id);
  if (!category) return null;

  await category.destroy();

  return category;
};
