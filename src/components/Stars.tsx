import { useState } from "react";
import { Star } from "lucide-react";

interface Props {
  value: number;
  size?: number;
  onChange?: (n: number) => void;
  className?: string;
}

export default function Stars({ value, size = 15, onChange, className = "" }: Props) {
  const [hover, setHover] = useState(0);
  const interactive = Boolean(onChange);
  const shown = hover || Math.round(value);

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= shown;
        const star = (
          <Star
            style={{ width: size, height: size }}
            className={filled ? "fill-ember text-ember" : "fill-transparent text-ink/30"}
            strokeWidth={1.8}
          />
        );
        return interactive ? (
          <button
            key={i}
            type="button"
            aria-label={`${i} estrellas`}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange?.(i)}
            className="transition-transform hover:scale-125"
          >
            {star}
          </button>
        ) : (
          <span key={i}>{star}</span>
        );
      })}
    </div>
  );
}
