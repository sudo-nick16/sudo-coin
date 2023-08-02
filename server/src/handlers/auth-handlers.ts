import { Request, Response } from "express";
import { createAccessToken, createRefreshToken, isCorrectPassword, verifyRefreshToken, hashPassword } from "../utils";
import userModel from "../models/user";

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.sid;
  if (!refreshToken) {
    res.send({ error: "no refresh token provided", accessToken: "" });
    return;
  }
  try {
    const tp = verifyRefreshToken(refreshToken);
    if (!tp) {
      res.send({ error: "invalid refresh token", accessToken: "" });
      return;
    }
    const user = await userModel.findById(tp.user_id).exec();
    if (!user) {
      res.send({ error: "user not found", accessToken: "" });
      return;
    }
    if (user!.token_version !== tp.token_version) {
      res.send({ error: "invalid refresh token", accessToken: "" });
      return;
    }
    const accessToken = createAccessToken({
      user_id: user!.id,
      email: user!.email,
      token_version: user!.token_version,
    });
    res.status(200).json({
      user: {
        id: user!.id,
        email: user!.email,
        name: user!.name,
      },
      accessToken,
    });
    return;
  } catch (e) {
    res.status(500).json({ error: e.message, accessToken: "" });
  }
};

export const logout = async (_: Request, res: Response) => {
  res.cookie("sid", "", { maxAge: 0 });
  return res.status(200).json({
    message: "logout successful",
  })
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email or password missing" });
  }
  try {
    const user = await userModel.findOne({ email }).exec();
    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }
    if (await isCorrectPassword(password, user.password)) {
      const payload = {
        user_id: user.id,
        email: user.email,
        token_version: user.token_version,
      }
      res.cookie("sid", createRefreshToken(payload), {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      return res.status(200).json({
        message: "login successful",
        accessToken: createAccessToken(payload),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      });
    }
    return res.status(400).json({ error: "invalid password" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "something went wrong" });
  }
}

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "name or email or password missing" });
  }
  try {
    const user = await userModel.findOne({ email }).exec();
    if (user) {
      return res.status(400).json({ error: "user already exists" });
    }
    const newUser = new userModel({
      name,
      email,
      password: await hashPassword(password),
    });
    await newUser.save();
    const payload = {
      user_id: newUser.id,
      email: newUser.email,
      token_version: newUser.token_version,
    }
    res.cookie("sid", createRefreshToken(payload), {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.status(200).json({
      message: "registration successful",
      accessToken: createAccessToken(payload),
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      }
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "something went wrong" });
  }
}
