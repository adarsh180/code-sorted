import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/encryption";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { consentGiven, preciseLocationAllowed, deviceInfo, preciseCoordinates } = await req.json();

    if (!consentGiven) {
      return NextResponse.json({ error: "Required consent not provided" }, { status: 400 });
    }

    // Get IP Address
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0] : "127.0.0.1";

    // In a real app we'd resolve IP to approx location here via a service like ipapi
    const approxLocation = "Unknown Location based on IP"; 

    const encryptedIp = encrypt(ipAddress);
    const encryptedPrecise = preciseCoordinates ? encrypt(preciseCoordinates) : null;

    // 1. Update User Record
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        consentGiven: true,
        preciseLocationAllowed: !!preciseLocationAllowed,
      },
    });

    // 2. Anti-sharing Logic: Ensure max 2 active sessions
    const activeSessions = await prisma.userSession.findMany({
      where: { userId: user.id, isActive: true },
      orderBy: { createdAt: 'asc' }
    });

    if (activeSessions.length >= 2) {
      // Deactivate the oldest session(s) until we're under the limit
      const toDeactivate = activeSessions.slice(0, activeSessions.length - 1);
      await prisma.userSession.updateMany({
        where: { id: { in: toDeactivate.map(s => s.id) } },
        data: { isActive: false }
      });
    }

    // 3. Create new UserSession
    const newSession = await prisma.userSession.create({
      data: {
        userId: user.id,
        ipAddress: ipAddress, // Unencrypted for session management lookup internally
        deviceInfo,
        approxLocation,
        isActive: true,
      }
    });

    // 4. Create Security Log for the initial login/consent
    await prisma.securityLog.create({
      data: {
        userId: user.id,
        encryptedIp,
        deviceInfo,
        approxLocation,
        encryptedPreciseLocation: encryptedPrecise,
        actionType: "LOGIN",
        isSuspicious: false, // In a real app, compare with previous geo locations
      }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Consent API Error:", error);
    return NextResponse.json({ error: "Failed to process consent" }, { status: 500 });
  }
}
