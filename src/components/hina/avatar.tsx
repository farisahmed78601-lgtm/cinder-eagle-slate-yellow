import { cn } from "@/lib/cn";

export function HinaAvatar({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <img
      src="/hina.jpg"
      alt="Hina"
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full object-cover ring-1 ring-border", className)}
      style={{ width: size, height: size }}
    />
  );
}
