import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useStore } from "../../Context";
import { OrgUnitTree } from "../OrgUnitTree";
import { Dashboard } from "../Dashboard";
import { LeftHeader } from "../visualizations/LeftHeader";

export const Cases = observer(() => {
  const store = useStore();

  useEffect(() => {
    store.createDashboard();
    store.currentDashboard.addTextItem(
      0,
      0,
      9,
      1,
      <OrgUnitTree name="CASES AND EPI" />
    );
    store.currentDashboard.addTextItem(
      9,
      0,
      3,
      1,
      <LeftHeader value="Cases and Testing" />
    );
    // targets
    store.currentDashboard.addAnalyticsItem(
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
    store.currentDashboard.addAnalyticsItem(
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
    store.currentDashboard.addAnalyticsItem(
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
    store.currentDashboard.addAnalyticsItem(
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
    store.currentDashboard.addAnalyticsItem(
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
    store.currentDashboard.addAnalyticsItem(
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
    store.currentDashboard.addAnalyticsItem(
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
  }, [store]);

  return <Dashboard />;
});
