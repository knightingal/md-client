import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

  console.log(request.url);
  const url = new URL(request.url);
  if (request.url.indexOf("local1000") >= 0) {
    url.port = "8000";
  } else {
    url.port = "3002";
  }
  return fetch(url);

}

// See "Matching Paths" below to learn more
export const config = {
  matcher:[ '/local1000/:path*', '/linux1000/:path*'],
}