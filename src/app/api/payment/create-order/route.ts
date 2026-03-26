import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId } = await req.json();
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
  if (course.isFree || course.price === 0) return NextResponse.json({ error: "Course is free" }, { status: 400 });

  const amountPaise = Math.round(course.price * 100);
  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt: `cs_${courseId}_${Date.now()}`,
  });

  await prisma.paymentOrder.create({
    data: {
      userId: session.user.id as string,
      courseId,
      razorpayOrderId: order.id,
      amount: course.price,
    },
  });

  return NextResponse.json({ orderId: order.id, amount: amountPaise, currency: "INR", courseName: course.title });
}
