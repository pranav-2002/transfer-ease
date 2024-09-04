import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";

export const successHelper = (data: any, status: HttpStatusCode) => {
  return NextResponse.json(
    {
      data: data,
    },
    {
      status: status,
    }
  );
};
