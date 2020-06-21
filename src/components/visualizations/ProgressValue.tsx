import React, { FC } from 'react';
import { Progress } from 'antd';
interface SingleValuesProps {
  value: any;
  chart: 'circle' | 'line' | 'dashboard';
  showInfo?: boolean;
  strokeWidth?: number;
  stokeColor?: string;
  trailColor?: string;
  otherText?: string;
  textColor?: string;
  format?: (percent: number | undefined, successPercent?: number | undefined) => React.ReactNode
}

export const ProgressValue: FC<SingleValuesProps> = ({ value, chart, showInfo = true, strokeWidth = 8, textColor, stokeColor = '#AB3D3D', trailColor = "gray", format = (percent: number | undefined) => <span style={{ color: textColor }}>{percent + '%'}</span>, otherText }) => {
  if (otherText) {
    return <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ margin: 0, padding: 0, color: textColor }}>{otherText}</div>
      <Progress
        strokeWidth={strokeWidth}
        showInfo={showInfo}
        strokeColor={stokeColor}
        trailColor={trailColor}
        type={chart}
        percent={value}
        format={format}
        width={80}
      />
    </div>
  }
  return <Progress
    strokeWidth={strokeWidth}
    showInfo={showInfo}
    strokeColor={stokeColor}
    trailColor={trailColor}
    type={chart}
    percent={value}
    format={format}
    width={80}
  />
}