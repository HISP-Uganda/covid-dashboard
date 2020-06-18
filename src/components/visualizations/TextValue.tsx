import React, { FC } from "react";

interface TextValueProps {
  label?: string;
  value: string;
  className?: string;
  otherText?: string;
}

export const TextValue: FC<TextValueProps> = ({
  label,
  value,
  className = 'blue',
  otherText = ''
}) => {
  return (
    <div className="container">
      <div>
        {label}
      </div>
      <div className={className}>{String(value)}{otherText}</div>
    </div>
  );
};
