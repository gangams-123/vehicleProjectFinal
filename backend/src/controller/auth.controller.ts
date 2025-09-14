// src/controller/auth.controller.ts
import { Request, Response } from "express";
import { AuthService } from "../service/auth.service.js";

export class AuthController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.checkLogin({ email, password });

      return res.status(200).json({
        message: "Login successful",
        token: result.token,
        user: result.user,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      const message = error.message || "Login failed";
      return res.status(401).json({ message });
    }
  };
}
