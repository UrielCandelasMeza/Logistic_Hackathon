import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../../generated/prisma/client";

import { generateTokens, verifyToken, generateAccessToken } from "../lib/jwt";
import {
  clearAuthCookies,
  setAuthCookies,
  getTokenFromCookies,
} from "../lib/cookies";

const prisma = new PrismaClient();

const User = prisma.user;
const Admin = prisma.admin;
const UserStorage = prisma.userStorage;
const UserSale = prisma.sale;
const Quality = prisma.quality;
const Manager = prisma.manager;
const Checkout = prisma.checkout;

export const register = async (req: Request, res: Response) => {
  const { email, password, name, lastName, telephone } = req.body;
  try {
    if (!email || !password || !name || !lastName || !telephone) {
      return res.status(400).json({ message: "Hay algun campo vacio" });
    }

    const prevEmail = await User.findFirst({
      where: {
        email,
      },
    });
    if (prevEmail) {
      return res.status(400).json({ message: "El email ya ha sido ocupado" });
    }

    const salt = 12;
    const hash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      data: {
        email: email as string,
        password: hash as string,
        name: name as string,
        lastName: lastName as string,
        telephone: telephone as string,
      },
    });

    const tokens = generateTokens({
      userId: newUser.id,
      email: newUser.email,
    });

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: userWithoutPassword,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: `Server error: ${error.message}` });
    }
    return res.status(500).json({ error: `Unknown error: ${error}` });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Hay algun campo vacio" });
    }
    const user = await User.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "El usuario no ha sido registrado" });
    }

    const isPass = await bcrypt.compare(password, user.password);

    if (isPass) {
      return res.status(400).json({ message: "La contraseña es incorrecta" });
    }

    const userWithRoles = await User.findUnique({
      where: { id: user.id },
      select: {
        admin: { select: { id: true } },
        managers: { select: { id: true } },
        sales: { take: 1, select: { id: true } },
        qualities: { take: 1, select: { id: true } },
        checkouts: { take: 1, select: { id: true } },
        storages: { take: 1, select: { id: true } },
      },
    });

    if (!userWithRoles) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    let role = "USUARIO";

    if (userWithRoles.admin.length > 0) role = "ADMIN";
    if (userWithRoles.managers.length > 0) role = "MANAGER";
    if (userWithRoles.sales.length > 0) role = "VENDEDOR";
    if (userWithRoles.qualities.length > 0) role = "CALIDAD";
    if (userWithRoles.checkouts.length > 0) role = "CAJERO";
    if (userWithRoles.storages.length > 0) role = "ALMACEN";

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role,
    });

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: userWithoutPassword,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return res.status(500).json({ error: `Server error: ${error.message}` });
    }
    return res.status(500).json({ error: `Unknown error: ${error}` });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    clearAuthCookies(res);
    return res.status(201).json({
      message: "Sesion Finalizada",
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: `Server error: ${error.message}` });
    }
    return res.status(500).json({ error: `Unknown error: ${error}` });
  }
};

export const verifyAuth = async (req: Request, res: Response) => {
  try {
    const { accessToken, refreshToken } = getTokenFromCookies(req);

    // Si no hay accessToken, verificar refreshToken
    if (!accessToken) {
      if (!refreshToken) {
        return res.status(401).json({ message: "No autenticado" });
      }

      // Intentar verificar con refreshToken
      try {
        const decoded = verifyToken(refreshToken);

        // Generar nuevo accessToken
        const newAccessToken = generateAccessToken({
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        });

        // Setear nueva cookie
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 15 * 60 * 1000, // 15 minutos
        });

        return res.status(200).json({
          user: {
            id: decoded.userId,
            email: decoded.email,
            rol: decoded.role,
          },
        });
      } catch (error) {
        return res.status(401).json({ message: "Sesión expirada" });
      }
    }

    // Si hay accessToken, verificarlo
    try {
      const decoded = verifyToken(accessToken);

      return res.status(200).json({
        user: {
          id: decoded.userId,
          email: decoded.email,
          rol: decoded.role,
        },
      });
    } catch (error: any) {
      // Si el accessToken expiró, intentar con refreshToken
      if (
        error.message.includes("expirado") ||
        error.message.includes("expired")
      ) {
        if (!refreshToken) {
          return res.status(401).json({ message: "Sesión expirada" });
        }

        try {
          const decoded = verifyToken(refreshToken);

          // Generar nuevo accessToken
          const newAccessToken = generateAccessToken({
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
          });

          // Setear nueva cookie
          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
          });

          return res.status(200).json({
            user: {
              id: decoded.userId,
              email: decoded.email,
              rol: decoded.role,
            },
          });
        } catch (refreshError) {
          return res.status(401).json({ message: "Sesión expirada" });
        }
      }

      return res.status(401).json({ message: "Token inválido" });
    }
  } catch (error) {
    console.error("Error en verifyAuth:", error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};
