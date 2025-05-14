import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/user.model";
import { sendError } from "../utils";

interface SignupRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export const signup = async (req: SignupRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // keep detailed validation errors in the payload
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return sendError(res, 400, "User already exists");
    }

    const hashed = await bcrypt.hash(password, 10);
    // Create & save in one step
    const user = await User.create({ email, password: hashed });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "", {
      expiresIn: "1h",
    });

    return res.status(201).json({ token });
  } catch (err) {
    return sendError(res, 500, `Server error: ${(err as Error).message}`);
  }
};

export const login = async (req: LoginRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // keep detailed validation errors in the payload
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 400, "Invalid credentials");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return sendError(res, 400, "Invalid credentials");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "", {
      expiresIn: "1h",
    });

    return res.json({ token });
  } catch (err) {
    return sendError(res, 500, `Server error: ${(err as Error).message}`);
  }
};
