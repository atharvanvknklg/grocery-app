import userModel from "../models/userModel.js";

export const addToCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);
    let cartData = userData.cartData || {};
    cartData[req.body.itemId] = (cartData[req.body.itemId] || 0) + 1;
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Added to Cart" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);
    let cartData = userData.cartData || {};
    if (cartData[req.body.itemId] > 0) cartData[req.body.itemId] -= 1;
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Removed from Cart" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);
    res.json({ success: true, cartData: userData.cartData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
