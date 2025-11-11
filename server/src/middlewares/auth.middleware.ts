// middleware/authMiddleware.ts
import type { Request, Response, NextFunction } from "express";
import { verifyToken, type JwtPayload, generateAccessToken } from "../lib/jwt";
import { getTokenFromCookies, clearAuthCookies } from "../lib/cookies";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function verifyJWT(req: Request, res: Response, next: NextFunction) {
  try {
    const { accessToken } = getTokenFromCookies(req);

    if (!accessToken) {
      return res.status(401).json({
        error: "Token de acceso requerido",
      });
    }

    const decoded = verifyToken(accessToken);
    req.user = decoded;
    next();
  } catch (error: any) {
    // Intentar refresh si el access token expiró
    if (error.message.includes("expired")) {
      return handleTokenRefresh(req, res, next);
    }
    return res.status(401).json({
      error: "Token inválido",
    });
  }
}

async function handleTokenRefresh(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { refreshToken } = getTokenFromCookies(req);

    if (!refreshToken) {
      return res.status(401).json({ error: "Sesión expirada" });
    }

    // Verificar refresh token
    const decoded = verifyToken(refreshToken);

    // Generar nuevo access token
    const newAccessToken = generateAccessToken({
      userId: decoded.userId,
      email: decoded.email,
    });

    // Setear nueva cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Sesión expirada, por favor inicie sesión nuevamente" });
  }
}
