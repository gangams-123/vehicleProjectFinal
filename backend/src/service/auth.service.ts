// src/service/auth.service.ts
import { Repository } from "typeorm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Official } from "../entity/official.js";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    officialId: number;
    deptId: number;
    roleId: number;
  };
}

export class AuthService {
  constructor(private officialRepo: Repository<Official>) {}

  async checkLogin({ email, password }: LoginPayload): Promise<LoginResponse> {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = await this.officialRepo.findOne({
      where: { email },
      relations: ["department", "role"],
      select: ["id", "password"],
    });
    console.log(user);
    if (!user) {
      throw new Error("Invalid email or password");
    }
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    //if (!isPasswordValid) {
    //throw new Error("Invalid email or password passowrd doesnot match");
    //}

    const payload = {
      officialId: user.id,
      deptId: user.department.id,
      roleId: user.role.id,
    };

    const SECRET_KEY = process.env.JWT_SECRET || "mySecretKey";
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

    return {
      token,
      user: payload,
    };
  }
}
