import { NextResponse, type NextRequest } from "next/server";

// URLs that should return 410 Gone (crawler errors, never existed)
const GONE_URLS = [
  "/blog/themeContext",
  "/blog/README.template.md",
  "/blog/greeting",
  "/blog/m",
  "/blog/hello-world!",
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Return 410 Gone for URLs that never existed (tells Google to stop crawling)
  if (GONE_URLS.includes(pathname)) {
    return new NextResponse("Gone", { status: 410 });
  }

  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};