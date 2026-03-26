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
    const cleanName = file.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    const filename = `${cleanName}-${Date.now()}.${ext}`;
    
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filepath = path.join(uploadDir, filename);
    await fs.writeFile(filepath, buffer);
    
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("Upload route error:", error);
    return NextResponse.json({ error: "Failed to upload file to local storage" }, { status: 500 });
  }
}
