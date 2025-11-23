import Product from "../models/Product.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching all products:", error); // Log the error for debugging for developers, not displayed to users
    res.status(500).json({ message: "Internal server error" });
  }
};
export const createProduct = async (req, res) => {
try {
const {name} = req.body;
}
catch (error) {

}};
export const updateProduct = (req, res) => {
  res.send("da cap nhat viec");
};
export const deleteProduct = (req, res) => {
  res.send("da xoa viec");
};
