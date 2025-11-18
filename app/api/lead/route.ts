import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();
  const receivedAt = new Date().toISOString();

  console.info("harihara_lead", { ...payload, receivedAt });

  return NextResponse.json({ ok: true, receivedAt });
}
