import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import { pages } from "next/dist/build/templates/app-page";

export const OPTIONS = {
    providers : [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            // profile(profile) {
            //     return {
            //         id: profile.id,
            //         name: profile.name,
            //         email: profile.email,
            //         image: profile.picture,
            //     };
            // },
        }),
        TwitterProvider({
            clientId: process.env.TWITTER_CLIENT_ID,
            clientSecret: process.env.TWITTER_CLIENT_SECRET,
        }),
    ],
    pages   : {
        signIn: "/signIn",
    },
    secret: process.env.NEXTAUTH_SECRET,

};
const handler = NextAuth(OPTIONS);

export { handler as GET, handler as POST }