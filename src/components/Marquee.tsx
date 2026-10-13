import { Sparkle } from "lucide-react";

interface Props {
  items: string[];
  className?: string;
  duration?: string;
}

export default function Marquee({ items, className = "", duration = "30s" }: Props) {
  return (
    <div className={`overflow-hidden py-3 select-none ${className}`}>
      <div className="pe-marquee" style={{ "--dur": duration } as React.CSSProperties}>
        {[0, 1].map((half) => (
          <div key={half} aria-hidden={half === 1} className="flex shrink-0 items-center">
            {items.map((item, i) => (
              <span key={i} className="flex items-center gap-8 pr-8 whitespace-nowrap">
                <span className="font-display text-2xl font-bold italic md:text-3xl">{item}</span>
                <Sparkle className="h-4 w-4 shrink-0 text-terra" fill="currentColor" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
