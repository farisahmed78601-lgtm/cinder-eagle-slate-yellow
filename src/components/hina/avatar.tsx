import { cn } from "@/lib/cn";

export function HinaAvatar({
  size = 36,
  className,
  talking = false,
}: {
  size?: number;
  className?: string;
  talking?: boolean;
}) {
  return (
    <span className={cn("relative inline-flex shrink-0", talking && "hina-talk")} style={{ width: size, height: size }}>
      <img
        src="/hina.jpg"
        alt="Hina"
        width={size}
        height={size}
        className={cn(
          "size-full rounded-full object-cover",
          talking ? "ring-2 ring-accent" : "ring-1 ring-border",
          className,
        )}
      />
    </span>
  );
}
