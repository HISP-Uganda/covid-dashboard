import React, { FC, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import accessibility from 'highcharts/modules/accessibility'

import { observer } from "mobx-react";
import { TItem } from "../../models/Visualization";
import { useStore } from "../../Context";
import { Spinner } from '../Spinner'


accessibility(Highcharts);

interface ChartProps {
  element: TItem;
}


export const Chart: FC<ChartProps> = observer(({ element }) => {
  const store = useStore();

  useEffect(() => {
    element.setOu([store.selectedOrgUnit]);
    element.fetchFromAnalytics();
    setInterval(() => {
      element.setOu([store.selectedOrgUnit]);
      element.fetchFromAnalytics(false);
    }, store.refreshRate)
  }, [element, store.selectedOrgUnit, store.isLight, store.refreshRate]);

  if (element.loading || !element.chart) {
    return <Spinner/>;
  }

  return <HighchartsReact highcharts={Highcharts} options={element.chart} />;
});
