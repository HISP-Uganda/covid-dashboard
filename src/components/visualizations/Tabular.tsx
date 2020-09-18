import { observer } from "mobx-react";
import React, { FC, useEffect } from "react";
import { useStore } from "../../Context";
import { TItem } from "../../models/Visualization";
import { Spinner } from '../Spinner';
import { Table } from "antd";


interface ChartProps {
  element: TItem;
}

export const Tabular: FC<ChartProps> = observer(({ element }) => {
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

  return <Table rowKey="ou" bordered={true} scroll={{ x: element.width, y: element.height + 150 }} className="p-0 m-0" pagination={false} rowClassName={() => "bg-gray-800 text-white"} style={{ background: store.currentBackgrounds.background }} columns={element.chart.columns} dataSource={element.chart.dataSource} />;
});
