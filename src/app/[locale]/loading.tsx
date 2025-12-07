import { FC, forwardRef, HTMLAttributes } from "react";

interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  color?: "blue" | "gray" | "white";
  showText?: boolean;
  text?: string;
  isLoading?: boolean;
  overlay?: boolean;
}

const sizeMap = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
};

const colorMap = {
  blue: { ping: "border-blue-500", spin1: "border-t-blue-400", spin2: "border-r-blue-300" },
  gray: { ping: "border-gray-500", spin1: "border-t-gray-400", spin2: "border-r-gray-300" },
  white: { ping: "border-white", spin1: "border-t-white", spin2: "border-r-white" },
};

// Simple alternative à cn()
const cx = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(" ");

export const Loading: FC<LoadingProps> = forwardRef<HTMLDivElement, LoadingProps>(
  ({
    size = "md",
    color = "blue",
    showText = false,
    text = "Chargement...",
    isLoading = true,
    overlay = true,
    className,
    ...props
  }, ref) => {
    if (!isLoading) return null;

    const colors = colorMap[color];
    const dimension = sizeMap[size];

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        aria-label={text}
        className={cx(
          "fixed inset-0 z-50 flex items-center justify-center",
          overlay && "bg-black/60 backdrop-blur-sm",
          className
        )}
        {...props}
      >
        <div className={cx("relative bg-white rounded-2xl shadow-2xl p-4 flex items-center justify-center", dimension)}>
          {/* Onde de propagation */}
          <div className={cx("absolute inset-0 border-4 rounded-full animate-ping opacity-30", colors.ping)} />
          
          {/* Premier spinner */}
          <div className={cx("absolute inset-2 border-4 border-transparent rounded-full animate-spin", colors.spin1)} 
               style={{ animationDuration: "1s" }} />
          
          {/* Deuxième spinner avec délai */}
          <div className={cx("absolute inset-4 border-4 border-transparent rounded-full animate-spin", colors.spin2)}
               style={{ animationDuration: "1.5s", animationDelay: "150ms" }} />

          {/* Texte screen reader */}
          {showText && <span className="sr-only">{text}</span>}
        </div>
      </div>
    );
  }
);

Loading.displayName = "Loading";

export default Loading;