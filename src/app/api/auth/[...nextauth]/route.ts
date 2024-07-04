// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import{ PrismaAdapter } from "@auth/prisma-adapter";
// import prisma from "@/lib/prisma";
// import { signIn } from "next-auth/react";

// export const OPTIONS = {
//     adapter: PrismaAdapter(prisma),
//     providers : [
//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID ?? "",
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
//             // profile(profile) {
//             //     return {
//             //         id: profile.id,
//             //         name: profile.name,
//             //         email: profile.email,
//             //         image: profile.picture,
//             //     };
//             // },
//         }),
//         CredentialsProvider({
//             name: 'Credentials',
//             credentials:{
//                 email: {
//                     label: "Email",
//                     type: "email",
//                     placeholder: "Email",
//                 },
//                 password:{
//                     label: "Password",
//                     type: "password",
//                     placeholder: "Password",
//                 },
//             },
//             authorize: async (credentials) =>{
//                 const user = await fetch(
//                     'api/auth/user/check-credentials',
//                     {
//                         method: 'POST',
//                         body: JSON.stringify(credentials),
//                         headers: { 'Content-Type': 'application/json' }
//                     }).then((res) => res.json());
//                     if(user) {
//                     console.log(user)   
//                     return user;
//                 }
//                 return null;
                
//             }
//         }),
//     ],
//     session: {
//         strategy: "jwt",
//     },
//     pages   : {
//         signIn: "/signIn",
//         newUser: "/signUp"
//     },
//     callbacks: {
//         async signIn({account, profile}) {
//             if (account.provider === "google" && profile.verified_email === true) {
//                 return true;
//             }
//             return false;
//         },
//         // async jwt({ token, user }: any) {
//         //     if (user) {
//         //       token.id = user.id;
//         //     }
//         //     return token;
//         //   },
//     },
//     secret: process.env.NEXTAUTH_SECRET,

// };
// const handler = NextAuth(OPTIONS);

// export { handler as GET, handler as POST }