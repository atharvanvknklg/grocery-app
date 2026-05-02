import express from "express";
import { addFood, listFood, removeFood, updateFood, upload } from "../controllers/foodController.js";

const foodRouter = express.Router();

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);
foodRouter.post("/update", updateFood);

export default foodRouter;
