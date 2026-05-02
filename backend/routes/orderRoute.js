import express from "express";
import { placeOrder, userOrders, listOrders, updateStatus, getDashboardStats } from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/list", listOrders);
orderRouter.post("/status", updateStatus);
orderRouter.get("/dashboard", getDashboardStats);

export default orderRouter;
