import { dwollaClient } from "@/lib/dwolla";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await dwollaClient.post("sandbox-simulations");
    console.log(response);
    return NextResponse.json(
      {
        total: response.body.total,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
}
