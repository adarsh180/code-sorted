import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = await req.json();

  // Verify signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSig = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSig !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Update payment record
  await prisma.paymentOrder.updateMany({
    where: { razorpayOrderId: razorpay_order_id },
    data: { razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature, status: "SUCCESS" },
  });

  // Grant enrollment
  await prisma.courseEnrollment.upsert({
    where: { userId_courseId: { userId: session.user.id as string, courseId } },
    create: { userId: session.user.id as string, courseId },
    update: {},
  });

  return NextResponse.json({ success: true });
}
