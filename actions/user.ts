'use server'

import { UserProps } from "@/types/types";
import { db } from "@/prisma/db";
import bcrypt from "bcrypt"

export async function createUser (data: UserProps) {
  const {email, password, name} = data;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return {
        error: `Email already exists`,
        status: 409,
        data: null,
      };
    };

    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      },
    });

    return {
      error: null,
      status: 200,
      data: newUser
    };
  }catch (error) {
    console.log(error);
    return {
      error: `Something Went Wrong, Please try again`,
      status: 500,
      data: null,
    };
  }

}