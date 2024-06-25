import "server-only";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

import {z} from "zod";

// const signUpSchema = z.object({
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(8, "Password must be at least 8 characters long")
//   .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).*$/, 
//     "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
//   )
// })

export async function POST(req: Request) {
  try {
    const {email,password} = await req.json();
    console.log(email);
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }
    
        // Hash the password using Argon2
        const hashedPassword = bcrypt.hashSync(password, 12);
    
    // Create new user
    try{
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
        });
    return NextResponse.json({ 
        user: { id: user.id,  email: user.email } 
        }, { status: 201 });
    } catch (error) {
        console.error("Error in creating user:", error);
        return NextResponse.json({ error: "An error occurred during signup" }, { status: 500 });
    }

    

  } catch (error) {
    console.error("Error in signup:", error);
    return NextResponse.json({ error: "An error occurred during signup" }, { status: 500 });
  }
}