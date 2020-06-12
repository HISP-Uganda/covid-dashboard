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
    if (element.orgUnitGroups.length === 0) {
      element.setOu([store.selectedOrgUnit]);
    }
    element.fetchFromAnalytics();
  }, [element, store.selectedOrgUnit]);

  if (element.loading) {
    return <div>Loading...</div>;
  }

  return <HighchartsReact highcharts={Highcharts} options={element.chart} />;
});
