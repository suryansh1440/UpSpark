import User from "../modals/user.modal.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }
        if (user.isBlocked) {
            return res.status(403).json({ message: "Forbidden: User is blocked" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Protect route error:", error);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}