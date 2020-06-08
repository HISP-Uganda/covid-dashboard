import React, { FC } from "react";

interface TextValueProps {
  label?: string;
  value: string;
  className?: string;
}

export const TextValue: FC<TextValueProps> = ({
  label,
  value,
  className = 'blue',
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
