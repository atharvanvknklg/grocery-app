import foodModel from "../models/foodModel.js";
import fs from "fs";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});
export const upload = multer({ storage });

// Add food item
export const addFood = async (req, res) => {
  try {
    let image_filename = "";
    if (req.file) {
      image_filename = req.file.filename;
    } else if (req.body.imageUrl) {
      image_filename = req.body.imageUrl; // store URL directly
    } else {
      return res.json({ success: false, message: "Image is required" });
    }

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_filename,
      stock: req.body.stock || 100,
    });
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// List all food items
export const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Remove food item
export const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (food && food.image && !food.image.startsWith("http")) {
      fs.unlink(`uploads/${food.image}`, (err) => {});
    }
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update food item
export const updateFood = async (req, res) => {
  try {
    const updated = await foodModel.findByIdAndUpdate(req.body.id, {
      ...(req.body.name && { name: req.body.name }),
      ...(req.body.price && { price: req.body.price }),
      ...(req.body.stock !== undefined && { stock: req.body.stock }),
      ...(req.body.available !== undefined && { available: req.body.available }),
      ...(req.body.description && { description: req.body.description }),
    }, { new: true });
    res.json({ success: true, message: "Food Updated", data: updated });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
