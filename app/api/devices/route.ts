import { auth } from "@/config/auth";
import axios from 'axios';
import { NextResponse } from "next/server";

export async function GET (req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({
      error: 'unauthorized'
    }, {status: 401});
  }


  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_TRACCAR_URL}/api/devices`, {
      headers: {Authorization : process.env.TRACCAR_AUTH}
    });

    return NextResponse.json(response.data, {status: 200});
  } catch (error) {
    return NextResponse.json({error: 'Failed to fetch devices'}, {status: 500})
  }
};