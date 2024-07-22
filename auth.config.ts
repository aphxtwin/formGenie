import type { NextAuthConfig } from 'next-auth'


const authConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
    newUser: '/signup'
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnLoginPage = nextUrl.pathname.startsWith('/login')
      const isOnSignupPage = nextUrl.pathname.startsWith('/signup')
      const containschatSessionId = nextUrl.searchParams.has('chatSessionId')
      
      if (isLoggedIn) {
        if (isOnLoginPage || isOnSignupPage) {
          if(containschatSessionId) {
            console.log('redirecting to chat')
            const chatSessionId = nextUrl.searchParams.get('chatSessionId')
            console.log(chatSessionId, 'chatSessionId')
            return Response.redirect(new URL(`/chat/${chatSessionId}`, nextUrl))
          }
          return Response.redirect(new URL('/', nextUrl))
          
        }
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, id: user.id }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        const { id } = token as { id: string }
        const { user } = session
        session = { ...session, user: { ...user, id } }

      }
      return session
    },
  },
  providers: [],
  
} satisfies NextAuthConfig

export default authConfig