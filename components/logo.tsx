import { cn } from "@/lib/utils";
import { SVGProps } from "react";

export interface LogoProps extends SVGProps<SVGSVGElement> {
  iconSize?: number;
  showText?: boolean;
}

export function LogoIcon({
  className,
  iconSize = 32,
  ...props
}: SVGProps<SVGSVGElement> & { iconSize?: number }) {
  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          {/* Using primary oklch color and blending to a vivid secondary gradient */}
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="oklch(0.623 0.214 259.815)" />
        </linearGradient>
      </defs>

      {/* Outer Nest Arc */}
      <path
        d="M 4 18 C 4 25.73 10.27 32 18 32 C 23.8 32 28.8 28.45 30.9 23.5 C 31.2 22.8 30.7 22 30 22 C 29.5 22 29.1 22.3 28.9 22.7 C 27.2 26.7 23 29.5 18 29.5 C 11.65 29.5 6.5 24.35 6.5 18 C 6.5 14.5 8.1 11.3 10.6 9.2 C 11.1 8.8 11.2 8 10.7 7.5 C 10.2 7 9.4 7 8.9 7.5 C 5.9 10.2 4 13.9 4 18 Z"
        fill="url(#logo-gradient)"
      />

      {/* Inner Nest Arc */}
      <path
        d="M 8 18 C 8 23.52 12.48 28 18 28 C 22.25 28 25.9 25.35 27.35 21.6 C 27.6 21 27.1 20.3 26.4 20.3 C 26 20.3 25.6 20.5 25.4 20.9 C 24.3 23.8 21.4 25.8 18 25.8 C 13.7 25.8 10.2 22.3 10.2 18 C 10.2 15.3 11.6 12.9 13.7 11.5 C 14.3 11.1 14.4 10.3 13.9 9.8 C 13.4 9.3 12.6 9.3 12.1 9.8 C 9.5 11.9 8 14.8 8 18 Z"
        fill="url(#logo-gradient)"
        opacity="0.8"
      />

      {/* Modern House Sitting Nestled Inside */}
      <path
        d="M 18 7 L 26.5 13.8 C 27.1 14.3 27.5 15 27.5 15.8 L 27.5 22.5 C 27.5 23.9 26.4 25 25 25 L 21.5 25 C 20.9 25 20.5 24.6 20.5 24 L 20.5 19 C 20.5 18.2 19.8 17.5 19 17.5 L 17 17.5 C 16.2 17.5 15.5 18.2 15.5 19 L 15.5 24 C 15.5 24.6 15.1 25 14.5 25 L 11 25 C 9.6 25 8.5 23.9 8.5 22.5 L 8.5 15.8 C 8.5 15 8.9 14.3 9.5 13.8 L 18 7 Z"
        fill="url(#logo-gradient)"
      />

      {/* Sparkle Dot */}
      <circle cx="18" cy="13" r="2" fill="#FFFFFF" opacity="0.9" />
    </svg>
  );
}

export function Logo({
  className,
  iconSize = 32,
  showText = true,
  ...props
}: LogoProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 font-semibold select-none",
        className,
      )}
    >
      <LogoIcon iconSize={iconSize} {...props} />
      {showText && (
        <span className="text-xl font-bold tracking-tight text-foreground">
          Rent<span className="text-primary">Nest</span>
        </span>
      )}
    </div>
  );
}
