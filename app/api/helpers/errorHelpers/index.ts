import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";

export const errorHelper = (error: any, status: HttpStatusCode) => {
  return NextResponse.json(
    {
      error: error,
    },
    {
      status: status,
    }
  );
};
