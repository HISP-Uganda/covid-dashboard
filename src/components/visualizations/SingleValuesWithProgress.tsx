import React, { FC, useEffect } from "react";
import { observer } from "mobx-react";
import { TextValue } from "./TextValue";
import { TItem } from "../../models/Visualization";
import { Progress } from "antd";
import { useStore } from "../../Context";

interface SingleValuesProps {
  element: TItem;
}

export const SingleValuesWithProgress: FC<SingleValuesProps> = observer(
  ({ element }) => {
    const store = useStore();

    useEffect(() => {
      element.setOu([store.selectedOrgUnit]);
      element.fetchFromAnalytics();
    }, [element, store.selectedOrgUnit]);

    if (element.loading) {
      return <div>Loading...</div>;
    }

    return (
      <>
        <TextValue
          color="#000066"
          label={element.chart.numerator.title}
          value={element.chart.numerator.value}
          width="25%"
          className="green"
        />
        <TextValue
          color="#000066"
          label={element.chart.denominator.title}
          value={element.chart.denominator.value}
          width="25%"
          className="red"
        />
        <TextValue
          color="#000066"
          label={element.chart.rate.title}
          value={element.chart.rate.value}
          width="25%"
          className="red"
        />
        <Progress
          strokeWidth={15}
          showInfo={false}
          type="circle"
          percent={element.chart.rate.value}
          width={80}
          style={{ width: "25%", textAlign: "center" }}
        />
      </>
    );
  }
);
