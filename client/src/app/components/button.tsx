'use client';

import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  const baseStyles =
    "rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all";

  const variantStyles = {
    primary: "rounded-[10px] bg-buttonbg1 border border-primary1 px-4 py-2 text-primary1 font-manrope hover:bg-primary1 hover:text-white focus:ring-primary1 cursor-pointer",
    secondary: "bg-lavender text-primary1 px-4 py-2 hover:bg-primary2 hover:text-white focus:ring-primary1 cursor-pointer",
    outline:
      "border border-primary1 text-primary1 hover:bg-primary1 hover:text-white focus:ring-primary1",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;


/*<Button> Default </Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline" size="lg">
  Outline Large
</Button>*/
