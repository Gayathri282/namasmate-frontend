import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    const token = (session?.user as any)?.accessToken;
    if (!session || !token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    const backendRes = await fetch(`${BACKEND_URL}/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const text = await backendRes.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: `Backend returned non-JSON (status ${backendRes.status}): ${text.slice(0, 200)}` },
        { status: 502 }
      );
    }

    if (!backendRes.ok) {
      return NextResponse.json({ error: data.error || "Failed to update product" }, { status: backendRes.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[PUT /api/products/:id] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    const token = (session?.user as any)?.accessToken;
    if (!session || !token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const backendRes = await fetch(`${BACKEND_URL}/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await backendRes.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: `Backend returned non-JSON (status ${backendRes.status})` },
        { status: 502 }
      );
    }

    if (!backendRes.ok) {
      return NextResponse.json({ error: data.error || "Failed to delete product" }, { status: backendRes.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[DELETE /api/products/:id] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
