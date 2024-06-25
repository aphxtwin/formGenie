import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { signIn } from "next-auth/react";

export const OPTIONS = {
    providers : [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
            // profile(profile) {
            //     return {
            //         id: profile.id,
            //         name: profile.name,
            //         email: profile.email,
            //         image: profile.picture,
            //     };
            // },
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials:{
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "Email",
                },
                password:{
                    label: "Password",
                    type: "password",
                    placeholder: "Password",
                },
            },
            async authorize(credentials, req) {
                const user = { id: 1, name: "John Doe", email: ""};
                console.log(credentials);
                if (user) {
                    return user;
                } else {
                    return null;
                }
                
            },
        }),        
    ],
    session: {
        strategy: "jwt",
    },
    pages   : {
        signIn: "/signIn",
    },
    callbacks: {
        async signIn({account, profile}) {
            if (account.provider === "google" && profile.verified_email === true) {
                return true;
            }
            return false;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,

};
const handler = NextAuth(OPTIONS);

export { handler as GET, handler as POST }