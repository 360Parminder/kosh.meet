import { logoutUser, verifyToken } from "@360parminder/auth";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    cookieStore.get("token")?.value ||
    cookieStore.get("jwt")?.value;

  if (token) {
    const result = await verifyToken(token);
    if (result.valid && result.sessionId) {
      await logoutUser(result.sessionId);
    }
  }

  cookieStore.delete("token");
  cookieStore.delete("jwt");

  return Response.json({
    status: "success",
    success: true,
    message: "Logged out successfully",
  });
}
