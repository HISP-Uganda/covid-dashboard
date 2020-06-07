import React, { FC } from "react";

interface TextValueProps {
  color: string;
  label?: string;
  value: string;
  className: string;
  width?: string;
}

export const TextValue: FC<TextValueProps> = ({
  color,
  label,
  value,
  className,
  width,
}) => {
  return (
    <div className="container">
      <div>
        {label}
      </div>
      <div className={className}>{String(value)}</div>
    </div>
  );
};
