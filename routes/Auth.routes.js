import express from "express";
import { register, verifyAccount,login,updateName,changePassword } from "../controllers/Auth.js";




const AuthRoutes = express.Router();

// POST /api/auth/register
AuthRoutes.post("/register", register);
AuthRoutes.post("/verify", verifyAccount);
AuthRoutes.post("/verify-account", verifyAccount);
AuthRoutes.post("/login", login);
AuthRoutes.put("/update-name", updateName);
AuthRoutes.put("/change-password", changePassword);

export default AuthRoutes;