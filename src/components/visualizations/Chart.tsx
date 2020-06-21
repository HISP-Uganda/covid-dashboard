import React, { FC, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import accessibility from 'highcharts/modules/accessibility'
import DarkUnica from 'highcharts/themes/dark-unica';
import Light from 'highcharts/themes/avocado';

import { observer } from "mobx-react";
import { TItem } from "../../models/Visualization";
import { useStore } from "../../Context";

accessibility(Highcharts);

interface ChartProps {
  element: TItem;
}

const changeColor = (isLight: boolean) => {
  if (!isLight) {
    DarkUnica(Highcharts);
  } else {
    Light(Highcharts);
  }
}


export const Chart: FC<ChartProps> = observer(({ element }) => {
  const store = useStore();

  useEffect(() => {

    if (element.orgUnitGroups.length === 0) {
      element.setOu([store.selectedOrgUnit]);
    }
    element.fetchFromAnalytics();
  }, [element, store.selectedOrgUnit, store.isLight]);

  if (element.loading || !element.chart) {
    return <div>Loading...</div>;
  }

  return <HighchartsReact highcharts={Highcharts} options={element.chart} />;
});
