// utils/cookies.ts
import type { Response } from "express";

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
) {
  // Cookie para access token (15 minutos)
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS en producción
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutos
  });

  // Cookie para refresh token (7 días)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
}

export function getTokenFromCookies(req: any): {
  accessToken?: string;
  refreshToken?: string;
} {
  return {
    accessToken: req.cookies?.accessToken,
    refreshToken: req.cookies?.refreshToken,
  };
}
