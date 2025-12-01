"use server"
import { auth } from "@/app/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  
  if (!session) {
    return new Response(null, { status: 401 });
  }
  
  return Response.json(session);
}
