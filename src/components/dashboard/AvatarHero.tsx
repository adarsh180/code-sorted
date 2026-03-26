"use client";

interface AvatarHeroProps {
  name: string;
  avatarUrl: string | null;
  college: string | null;
  course: string | null;
}

export function AvatarHero({ name, avatarUrl, college, course }: AvatarHeroProps) {
  const firstName = name?.split(" ")[0] || "Student";

  return (
    <div className="flex flex-col items-center justify-center py-8 select-none">
      {/* Avatar image — no animation, just premium styling */}
      <div className="relative w-52 h-52">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${firstName}'s avatar`}
            className="w-full h-full object-contain"
            style={{
              filter: [
                "drop-shadow(0 -4px 12px rgba(255,255,255,0.1))",
                "drop-shadow(6px 0 18px rgba(99,102,241,0.5))",
                "drop-shadow(-6px 0 18px rgba(139,92,246,0.4))",
                "drop-shadow(0 28px 36px rgba(0,0,0,0.7))",
              ].join(" "),
            }}
          />
        ) : (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white text-6xl font-bold"
            style={{ background: "linear-gradient(135deg,#6366f1,#7c3aed)", boxShadow: "0 0 40px rgba(99,102,241,0.4)" }}
          >
            {firstName.charAt(0)}
          </div>
        )}

        {/* Static ground shadow */}
        <div
          className="absolute bottom-[-18px] left-1/2 -translate-x-1/2 w-32 h-5 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.45) 0%, transparent 75%)", filter: "blur(10px)" }}
        />
      </div>

      {/* Name */}
      <div className="mt-8 text-center">
        <h2
          className="text-2xl font-bold tracking-tight"
          style={{ background: "linear-gradient(100deg,#e0e7ff 0%,#a5b4fc 45%,#c4b5fd 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          {name}
        </h2>
        {(college || course) && (
          <p className="text-xs text-white/40 mt-1.5 font-medium tracking-wide">
            {course}{course && college ? " · " : ""}{college}
          </p>
        )}
      </div>
    </div>
  );
}
