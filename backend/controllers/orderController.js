import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Place order
export const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: true,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get user orders
export const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all orders (admin)
export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update order status (admin)
export const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Dashboard stats (admin)
export const getDashboardStats = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    const users = await userModel.find({});

    const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
    const totalOrders = orders.length;
    const totalUsers = users.length;
    const pendingOrders = orders.filter(o => o.status === "Food Processing").length;
    const deliveredOrders = orders.filter(o => o.status === "Delivered").length;

    // Revenue by day (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      const dayOrders = orders.filter(o => new Date(o.date) >= dayStart && new Date(o.date) <= dayEnd);
      const dayRevenue = dayOrders.reduce((sum, o) => sum + o.amount, 0);
      last7Days.push({
        date: dayStart.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        revenue: dayRevenue,
        orders: dayOrders.length,
      });
    }

    // Orders by status
    const statusBreakdown = [
      { status: "Food Processing", count: orders.filter(o => o.status === "Food Processing").length },
      { status: "Out for Delivery", count: orders.filter(o => o.status === "Out for Delivery").length },
      { status: "Delivered", count: orders.filter(o => o.status === "Delivered").length },
    ];

    res.json({
      success: true,
      data: { totalRevenue, totalOrders, totalUsers, pendingOrders, deliveredOrders, last7Days, statusBreakdown },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
