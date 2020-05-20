import React, { FC } from "react";

interface HeaderProps {
  value: string;
}
export const LeftHeader: FC<HeaderProps> = ({ value }) => {
  return (
    <div className="headers">
      <div
        style={{
          fontSize: 20,
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        {value}
      </div>
    </div>
  );
};
