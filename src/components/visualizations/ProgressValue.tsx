import React, { FC } from 'react';
import { Progress } from 'antd';
interface SingleValuesProps {
    value: any;
    chart: 'circle' | 'line' | 'dashboard';
    showInfo?: boolean;
    strokeWidth?: number;
    stokeColor?: string;
    trailColor?: string;
}
export const ProgressValue: FC<SingleValuesProps> = ({ value, chart, showInfo = false, strokeWidth = 8, stokeColor = '#AB3D3D', trailColor = "gray" }) => {
    return <Progress
        strokeWidth={strokeWidth}
        showInfo={showInfo}
        strokeColor={stokeColor}
        trailColor={trailColor}
        type={chart}
        percent={value}
        width={80}
    />
}