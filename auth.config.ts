import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/signup'
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }:any) {
      const isLoggedIn = !!auth?.user
      const isOnLoginPage = nextUrl.pathname.startsWith('/login')
      const isOnSignupPage = nextUrl.pathname.startsWith('/signup')
      if (isLoggedIn) {
        if (isOnLoginPage || isOnSignupPage) {
          return Response.redirect(new URL('/', nextUrl))
        }
        return true
      } else if (!isLoggedIn && !isOnLoginPage && !isOnSignupPage) {
        return Response.redirect(new URL('/login', nextUrl))
      }
      return true
    },
    async jwt({ token, user }: any) {
      if (user) {
        token = { ...token, id: user.id }
      }

      return token
    },
    async session({ session, token }: any) {
      if (token) {
        const { id } = token as { id: string }
        const { user } = session

        session = { ...session, user: { ...user, id } }
      }

      return session
    }
  },
  providers: [] // configured in auth.ts
} satisfies NextAuthConfig