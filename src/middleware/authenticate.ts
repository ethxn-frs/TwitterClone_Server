import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({message: "Authorization header missing"});
        return; // Ensure void is returned
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({message: "Token missing"});
        return; // Ensure void is returned
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;

        // Add user information to the request object
        (req as any).user = decoded;

        next(); // Continue to the next middleware or route handler
    } catch (error) {
        res.status(401).json({message: "Invalid or expired token"});
    }
};
