import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react";
import { useStore } from "../Context";
import { OrgUnitTree } from "./OrgUnitTree";
import { LeftHeader } from "./visualizations/LeftHeader";
import { Dashboard } from "./Dashboard";

export const Covid19Dashboards = observer(() => {
  const { dashboard } = useParams();
  const store = useStore();
  useEffect(() => {
    switch (dashboard) {
      case "cases":
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
          4,
          [
            "tpBtRe2DJ3B",
            "X1BUw8HyoMg",
            "XWI8darutqF",
            "xJg5M7bfjU4",
            "RHDYZ4xOUGf",
            "mxHo22EWLKM",
            "LRbMLBbKTjd",
            "azKjNal1oPw",
            "H6EW1wbRcdz",
            "JvHVmX0juJq",
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
          8,
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
          5,
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
          6,
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
        break;

      case "treatment":
        store.createDashboard();
        store.currentDashboard.addTextItem(
          0,
          0,
          9,
          1,
          <OrgUnitTree name="TREATMENT" />
        );
        store.currentDashboard.addTextItem(
          9,
          0,
          3,
          1,
          <LeftHeader value="Cases Management" />
        );
        // targets
        store.currentDashboard.addAnalyticsItem(
          0,
          1,
          6,
          2,
          ["UXmUvLgIaqW", "pxb5glV7ipX"],
          ["THIS_YEAR"],
          "textValues",
          "Admissions",
          "Cured",
          "Rate of Cure"
        );
        //Map
        store.currentDashboard.addAnalyticsItem(
          6,
          1,
          3,
          8,
          ["UXmUvLgIaqW"],
          ["THIS_YEAR"],
          "chart",
          "Admissions",
          "This Year",
          "Number",
          "map",
          false,
          true
        );
        // testing
        // store.currentDashboard.addTextItem(9, 1, 3, 2, <div>Left</div>);
        // main graph
        store.currentDashboard.addAnalyticsItem(
          0,
          3,
          6,
          8,
          ["UXmUvLgIaqW"],
          ["TODAY", "LAST_7_DAYS"],
          "chart",
          "Number of admissions",
          "Last 7 days",
          "Number",
          "column",
          true,
          false
        );
        break;

      default:
        break;
    }
  }, [dashboard, store]);

  return <Dashboard />;
});
