import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const ext = file.name.split('.').pop() || "pdf";
    const mimeType = file.type || "application/pdf";
    
    // Instead of using the ephemeral Vercel filesystem which fails, 
    // we convert the file directly into a Base64 data URI!
    const base64String = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64String}`;
    
    return NextResponse.json({ url: dataUrl });
  } catch (error) {
    console.error("Upload route error:", error);
    return NextResponse.json({ error: "Failed to upload file to local storage" }, { status: 500 });
  }
}
