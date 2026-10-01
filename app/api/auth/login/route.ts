import { loginUser } from "@360parminder/auth";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

function getCookieDomain(request: NextRequest): string | undefined {
  const host = request.headers.get("host") || "";
  return process.env.NODE_ENV === "production" || host.includes("kosh.uno")
    ? ".kosh.uno"
    : undefined;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const { token, user } = await loginUser(email, password, request);

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      domain: getCookieDomain(request),
      maxAge: 90 * 24 * 60 * 60,
      path: "/",
    });

    return Response.json({
      status: "success",
      success: true,
      token,
      user,
      data: { user },
    });
  } catch (error) {
    const statusCode =
      typeof error === "object" &&
      error !== null &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
        ? error.statusCode
        : 500;
    const message = error instanceof Error ? error.message : "Authentication failed";

    return Response.json(
      { status: "fail", success: false, error: message },
      { status: statusCode }
    );
  }
}
