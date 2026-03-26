import { AnimatedBackground } from "@/components/ui/animated-background";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh relative flex items-center justify-center px-4 py-12">
      <AnimatedBackground />
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
