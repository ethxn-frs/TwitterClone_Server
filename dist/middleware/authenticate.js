"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: "Authorization header missing" });
        return; // Ensure void is returned
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Token missing" });
        return; // Ensure void is returned
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Add user information to the request object
        req.user = decoded;
        next(); // Continue to the next middleware or route handler
    }
    catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.authenticate = authenticate;
