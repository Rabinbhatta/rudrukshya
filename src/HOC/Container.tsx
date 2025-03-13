"use client";

import { ReactNode } from "react";

export interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`p-6 w-full max-w-full ${className}`}>
      {children}
    </div>
  );
}