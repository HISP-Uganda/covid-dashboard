import React, { useRef, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useStore } from "../Context";
import { Chart } from "./visualizations/Chart";
import { TItem } from "../models/Visualization";
import { SingleValuesWithProgress } from "./visualizations/SingleValuesWithProgress";
import { SingleValues } from "./visualizations/SingleValues";
import { Map } from "./visualizations/Map";

const ResponsiveGridLayout = WidthProvider(Responsive);

export const Dashboard = observer(() => {
  const refs = useRef<any>([]);
  const store = useStore();
  const [data, setData] = useState<TItem[]>([]);

  refs.current = new Array(store.currentDashboard.visualizations.length);

  useEffect(() => {
    setData(store.currentDashboard.visualizations);
    data.map((v: TItem, i: number) => {
      const h = refs.current[i].offsetHeight;
      const w = refs.current[i].offsetWidth;
      v.setDimension(w, h);
      return v;
    });
  }, [data, store.currentDashboard.visualizations]);

  const display = (element: TItem) => {
    switch (element.type) {
      case "chart":
        if (element.chartType === "map") {
          return <Map element={element} />;
        }
        return <Chart element={element} />;
      case "plainText":
        return element.data;

      case "simpleTextValues":
        return <SingleValues element={element} />;
      case "textValues":
        return <SingleValuesWithProgress element={element} />;
    }
  };

  return (
    <div>
      <ResponsiveGridLayout
        className="layout"
        breakpoints={{
          xxl: 3400,
          lg: 1200,
          md: 996,
          sm: 768,
          xs: 480,
          xxs: 0,
        }}
        cols={{ xxl: 12, lg: 12, md: 9, sm: 1, xs: 1, xxs: 1 }}
        rowHeight={56}
      >
        {store.currentDashboard.visualizations.map(
          (element: TItem, i: number) => (
            <div
              ref={(el) => (refs.current[i] = el)}
              key={element.i}
              style={{ background: "white" }}
              className={element.cssClass}
              data-grid={{
                w: element.w,
                h: element.h,
                x: element.x,
                y: element.y,
                static: element.editable,
              }}
            >
              {!store.selectedOrgUnit ? <div>Loading</div> : display(element)}
            </div>
          )
        )}
      </ResponsiveGridLayout>
    </div>
  );
});
