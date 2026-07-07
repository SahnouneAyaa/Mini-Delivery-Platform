import { NextResponse } from "next/server";

export const ok = (data, status = 200) => NextResponse.json(data, { status });

export const created = (data) => NextResponse.json(data, { status: 201 });

export const deleted = () => NextResponse.json({ success: true });

export class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export const apiError = (err) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  console.error("[API Error]", message);
  return NextResponse.json({ error: message }, { status });
};