import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt-ts";
import { userBodySchema } from "@/lib/zodSchemas/userBodySchema";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const userBody = userBodySchema.safeParse(body);

  const { success, error, data } = userBody;

  // zod validation
  if (!success) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 400 }
    );
  }

  try {
    // Check if existing user
    const user = await prisma.user.findUnique({ where: { email: data.email } });

    if (user) {
      return NextResponse.json(
        {
          message: "User already exists",
        },
        { status: 409 }
      );
    }

    // Register new user
    const hashedPassword = await hash(data.password, 10);
    const newUser = await prisma.user.create({
      data: { ...data, password: hashedPassword },
    });

    if (newUser) {
      return NextResponse.json(
        {
          message: "User Registered Successfully",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error,
      },
      { status: 500 }
    );
  }
};
