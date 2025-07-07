import React, { useState } from "react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  className = "",
  interactive = false,
  onRatingChange,
}) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center gap-1">
        {Array.from({ length: maxRating }, (_, i) => i + 1).map((i) => (
          <span
            key={i}
            onClick={() => handleStarClick(i)}
            onMouseEnter={() => interactive && setHovered(i)}
            onMouseLeave={() => interactive && setHovered(null)}
            className={`material-icons-outlined ${sizeClasses[size]} ${
              interactive
                ? hovered !== null
                  ? i <= hovered
                    ? "text-yellow-400"
                    : "text-slate-300"
                  : rating >= i
                  ? "text-yellow-400"
                  : "text-slate-300"
                : rating >= i
                ? "text-yellow-400"
                : "text-slate-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-300" : ""}`}
            style={{ transition: "color 0.15s" }}
          >
            star
          </span>
        ))}
      </div>
      {showValue && (
        <div className="ml-1 text-sm font-semibold text-slate-700">
          {rating.toFixed(1)}
        </div>
      )}
    </div>
  );
};

export default StarRating; 