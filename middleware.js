// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdmin = createRouteMatcher(["/admin(.*)"]);
const isCart  = createRouteMatcher(["/cart(.*)"]);

export default clerkMiddleware(
  async (auth, req) => {
   if (isAdmin(req)) {
      await auth.protect(); // just requires signed in
      return;
    }
    if (isCart(req)) {
      await auth.protect(); // just requires signed in
      return;
    }
  },
  {
    // Public pages MUST include Clerk’s auth routes and SSO callback
    publicRoutes: ["/", "/sign-in(.*)", "/sign-up(.*)", "/sso-callback(.*)"],
  }
);

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/(api|trpc)(.*)",
  ],
};
