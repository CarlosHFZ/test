import { ReactNode } from "react";
import styles from "@/app/admin/AdminPage.module.css";

interface ActionButtonProps {
  variant?: "primary" | "secondary" | "logout";
  size?: "large" | "small";
  onClick?: () => void;
  children: ReactNode;
  type?: "button" | "submit" | "reset";
}

export function ActionButton({
  variant = "primary",
  size = "large",
  onClick,
  children,
  type = "button",
}: ActionButtonProps) {
  // Mapeia os variants para classes CSS
  const variantClass =
    variant === "primary"
      ? styles.buttonPrimary
      : variant === "secondary"
      ? styles.buttonSecondary
      : styles.buttonLogout;

  const sizeClass = size === "large" ? styles.buttonLarge : "";

  return (
    <button
      className={`${variantClass} ${sizeClass}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
