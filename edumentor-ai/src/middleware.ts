import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: { signIn: "/login" }
})

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/learn/:path*",
    "/quiz/:path*",
    "/progress/:path*",
    "/onboarding/:path*",
    "/settings/:path*"
  ]
}
