import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import accessibility from 'highcharts/modules/accessibility';
import fullscreen from 'highcharts/modules/full-screen'
import { observer } from "mobx-react";
import React, { FC, useEffect } from "react";
import { useStore } from "../../Context";
import { TItem } from "../../models/Visualization";
import { Spinner } from '../Spinner';


accessibility(Highcharts);
fullscreen(Highcharts);

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
    return <Spinner />;
  }

  return <HighchartsReact highcharts={Highcharts} options={element.chart} />;
});
