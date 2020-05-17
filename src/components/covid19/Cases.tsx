import React, { FC, useRef, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useStore } from "../../Context";
import { Chart } from "../visualizations/Chart";
import { TItem } from "../../models/Visualization";
import { SingleValuesWithProgress } from "../visualizations/SingleValuesWithProgress";
import { SingleValues } from "../visualizations/SingleValues";
import { Map } from "../visualizations/Map";
import { OrgUnitTree } from "../OrgUnitTree";

const ResponsiveGridLayout = WidthProvider(Responsive);

export const Cases: FC = observer(() => {
  const refs = useRef<any>([]);
  const store = useStore();
  const [data, setData] = useState<TItem[]>([]);
  useEffect(() => {
    store.loadUserOrgUnits();
  }, [store]);

  useEffect(() => {
    store.addTextItem(0, 0, 9, 1, <OrgUnitTree />);
    store.addTextItem(
      9,
      0,
      3,
      1,
      <div className="headers">Cases and Testing</div>
    );
    // targets
    store.addAnalyticsItem(
      0,
      1,
      6,
      2,
      ["k8JUA8SuWmB", "nsV5cXYQS2f"],
      ["THIS_YEAR"],
      "textValues",
      "-ve Cases",
      "+ve Cases",
      "Positivity Rate"
    );
    //middle
    store.addAnalyticsItem(
      6,
      1,
      3,
      3,
      [
        "tpBtRe2DJ3B",
        "X1BUw8HyoMg",
        "XWI8darutqF",
        "xJg5M7bfjU4",
        "RHDYZ4xOUGf",
        "mxHo22EWLKM",
        "LRbMLBbKTjd",
      ],
      ["THIS_YEAR"],
      "chart",
      "Cases by Country",
      "",
      "Number",
      "pie"
    );
    // testing
    store.addAnalyticsItem(
      9,
      1,
      3,
      2,
      ["ouVIFKQcWKu", "a2ww5jcUoA4"],
      ["THIS_YEAR"],
      "simpleTextValues",
      "Community",
      "Truck Drivers"
    );
    // main graph
    store.addAnalyticsItem(
      0,
      3,
      6,
      7,
      ["QBvAgwYmAs5"],
      ["TODAY", "LAST_14_DAYS"],
      "chart",
      "Tests Conducted",
      "",
      "Number",
      "column",
      true,
      false
    );
    // Map
    store.addAnalyticsItem(
      6,
      4,
      3,
      6,
      ["nsV5cXYQS2f"],
      ["THIS_YEAR"],
      "chart",
      "Confirmed Cases",
      "",
      "Number",
      "map",
      false,
      true
    );
    store.addAnalyticsItem(
      9,
      3,
      3,
      2,
      ["tIku9fFSXmh", "rxFoiosmSKO"],
      ["THIS_YEAR"],
      "simpleTextValues",
      "Quarantine",
      "Contacts"
    );
    // Turnaround
    store.addAnalyticsItem(
      9,
      5,
      3,
      5,
      ["SdF0bwlt4p6"],
      ["TODAY", "LAST_14_DAYS"],
      "chart",
      "Turnaround Time",
      "",
      "Number",
      "line",
      true,
      false
    );
    let data = store.visualizations;
    refs.current = new Array(store.visualizations.length);
    setData(data);
  }, [store]);

  useEffect(() => {
    data.map(async (v: TItem, i: number) => {
      const h = refs.current[i].offsetHeight;
      const w = refs.current[i].offsetWidth;
      v.setDimension(w, h);
      return v;
    });
  }, [data]);

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
        {store.visualizations.map((element: TItem, i: number) => (
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
        ))}
      </ResponsiveGridLayout>
    </div>
  );
});
