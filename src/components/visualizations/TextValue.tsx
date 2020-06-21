import React, { FC } from "react";

interface TextValueProps {
  label?: string;
  value: string;
  className?: string;
  labelClassName?: string;
  otherText?: string;
}

export const TextValue: FC<TextValueProps> = ({
  label,
  value,
  className = 'blue',
  labelClassName = '',
  otherText = ''
}) => {
  return (
    <div className="container">
      <div className={labelClassName}>
        {label}
      </div>
      <div className={className}>{String(value)}{otherText}</div>
    </div>
  );
};
