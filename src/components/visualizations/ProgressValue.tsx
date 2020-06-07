import React, { FC } from 'react';
import { Progress } from 'antd';
interface SingleValuesProps {
    value: any;
    chart: 'circle' | 'line' | 'dashboard';
}
export const ProgressValue: FC<SingleValuesProps> = ({ value, chart }) => {
    return <Progress
        strokeWidth={2}
        showInfo={false}
        strokeColor="red"
        trailColor="yellow"
        type={chart}
        percent={value}
        width={80}
    />
}