import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/ssr";

export async function middleware(req) {
  if (!req.nextUrl.pathname.startsWith("/admin")) return NextResponse.next();
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));
  return res;
}
export const config = { matcher: ["/admin/:path*"] };
