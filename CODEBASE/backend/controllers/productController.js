const productService=require("../services/productServices")
const {successResponse}=require("../utils/apiResponce")
const AppError=require("../utils/AppError")


exports.getAllProducts = async (req, res,next) => {
    try{
    const products=await productService.getAllProducts(req);
  return successResponse(res,"successfully fetched all the products",products,200)
  }catch(error){
    return next(new AppError(String(error), 500));
  }
};