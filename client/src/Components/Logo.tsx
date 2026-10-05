import { cn } from "@/lib/utils";

interface LogoProps {
  /** Size of the square mark in pixels. */
  size?: number;
  showWordmark?: boolean;
  className?: string;
  /** Colour/size classes for the wordmark, e.g. "text-bone" or "text-[42px]". */
  wordmarkClassName?: string;
}

/**
 * The to-do brand mark: a magenta rounded square with a plum check, followed by
 * the lowercase wordmark with the brand's signature magenta-italic "do".
 * Flat by design, so it reads on both the plum stage and light surfaces.
 */
export const Logo = ({
  size = 32,
  showWordmark = true,
  className,
  wordmarkClassName,
}: LogoProps) => {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        role="img"
        aria-label="to-do"
        className="shrink-0"
      >
        <rect x="1" y="1" width="30" height="30" rx="10" fill="#E57CD8" />
        <path
          d="M9 16.75 13.25 21 23 11.25"
          stroke="#2C1338"
          strokeWidth="3.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showWordmark ? (
        <span
          className={cn(
            "font-display text-3xl font-bold tracking-tight",
            wordmarkClassName,
          )}
        >
          to-<span className="italic text-magenta">do</span>
        </span>
      ) : null}
    </span>
  );
};
