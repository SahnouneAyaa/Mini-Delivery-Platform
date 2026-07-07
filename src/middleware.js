import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isLoginPage = pathname === "/";
  const isMerchantArea = pathname.startsWith("/marchand");
  const isDriverArea = pathname.startsWith("/driver");

  if (!token) {
    if (isMerchantArea || isDriverArea) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  const role = token.role;
  const dashboard = role === "merchant" ? "/marchand/dashboard" : "/driver/dashboard";

  if (isLoginPage) {
    return NextResponse.redirect(new URL(dashboard, req.url));
  }

  if (isMerchantArea && role !== "merchant") {
    return NextResponse.redirect(new URL(dashboard, req.url));
  }

  if (isDriverArea && role !== "driver") {
    return NextResponse.redirect(new URL(dashboard, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/marchand/:path*", "/driver/:path*"],
};