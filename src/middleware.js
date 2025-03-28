import { auth as middleware } from "@/lib/auth";
import { NextResponse } from "next/server";

export default middleware((req) => {
  const rolePaths = {
    admin: "/admin",
    manager: "/manager",
    user: "/user",
  };

  const isLoggedIn = !!req.auth;
  const user = req.auth?.user;
  const { pathname, origin } = req.nextUrl;

  console.log("User:", user);
  console.log("Current Path:", pathname);
  console.log("User Role:", user?.role || "Not logged in");

  // enable api
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/transfer")) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to the login page
  if (
    !isLoggedIn &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/register")
  ) {
    return NextResponse.redirect(`${origin}/login`);
  }

  // If authenticated, check user role
  if (isLoggedIn && user?.role) {
    const basePath = rolePaths[user.role];

    // Allow access to sub-pages within the user's designated role path
    if (!pathname.startsWith(basePath)) {
      return NextResponse.redirect(`${origin}${basePath}`);
    }
  }

  // Allow access to public pages
  if (["/login", "/register"].includes(pathname) && isLoggedIn) {
    return NextResponse.redirect(`${origin}${rolePaths[user.role] || "/"}`);
  }

  // Allow access to all other valid requests
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
