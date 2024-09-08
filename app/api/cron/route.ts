import { dwollaClient } from "@/lib/dwolla";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await dwollaClient.post("sandbox-simulations");
    return NextResponse.json(
      {
        total: response.body.total,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 }
    );
    console.log(error);
  }
}
