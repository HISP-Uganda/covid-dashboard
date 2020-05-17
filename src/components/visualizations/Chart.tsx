import React, { FC, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { observer } from "mobx-react";
import { TItem } from "../../models/Visualization";
import { useStore } from "../../Context";

interface ChartProps {
  element: TItem;
}

export const Chart: FC<ChartProps> = observer(({ element }) => {
  const store = useStore();

  useEffect(() => {
    element.setOu([store.selectedOrgUnit]);
    element.fetchFromAnalytics();
  }, [element, store.selectedOrgUnit]);

  return <HighchartsReact highcharts={Highcharts} options={element.chart} />;
});
