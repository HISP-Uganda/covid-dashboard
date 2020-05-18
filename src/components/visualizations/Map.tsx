import React, { FC, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { observer } from "mobx-react";
import { TItem } from "../../models/Visualization";
import { useStore } from "../../Context";

require("highcharts/modules/map")(Highcharts);

interface MapProps {
  element: TItem;
}
export const Map: FC<MapProps> = observer(({ element }) => {
  const store = useStore();

  useEffect(() => {
    element.fetchUnitsAndData(store.selectedOrgUnit);
  }, [store.selectedOrgUnit, element]);

  if (element.loading) {
    return <div>Loading...</div>;
  }

  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={"mapChart"}
      options={element.chart}
    />
  );
});
