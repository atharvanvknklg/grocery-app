import express from "express";
import { loginUser, registerUser, getAllUsers, refreshToken, logoutUser } from "../controllers/userController.js";
import { loginUser, registerUser, getAllUsers, refreshToken, logoutUser, googleLogin } from "../controllers/userController.js";


const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/refresh", refreshToken);
userRouter.post("/logout", logoutUser);
userRouter.get("/all", getAllUsers);
userRouter.post("/google", googleLogin);

export default userRouter;
