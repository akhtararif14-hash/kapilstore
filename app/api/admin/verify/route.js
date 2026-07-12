import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();

  const admin = cookieStore.get("admin");

  if (
    admin &&
    admin.value === process.env.ADMIN_KEY
  ) {
    return NextResponse.json({
      authorized: true,
    });
  }

  return NextResponse.json({
    authorized: false,
  });
}