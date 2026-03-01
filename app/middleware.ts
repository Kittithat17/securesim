import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const url = req.nextUrl.clone();

  if (host.startsWith("facebook.")) {
    url.pathname = "/account-review/facebook";
    return NextResponse.rewrite(url);
  }

  if (host.startsWith("instagram.")) {
    url.pathname = "/account-review/instagram";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}