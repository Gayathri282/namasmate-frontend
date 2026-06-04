import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = (session.user as any).accessToken;

    const res = await fetch(`${BACKEND_URL}/api/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.error || "Failed to fetch orders" }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${BACKEND_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.error || "Failed to place order" }, { status: res.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
