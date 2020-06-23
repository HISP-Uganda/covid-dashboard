import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react";
import { useStore } from "../Context";
import { OrgUnitTree } from "./OrgUnitTree";
import { LeftHeader } from "./visualizations/LeftHeader";
import { Dashboard } from "./dashboards/Dashboard";

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
          3,
          2,
          <p>Testes</p>
        );
        store.currentDashboard.addTextItem(
          3,
          0,
          6,
          2,
          <p>Testes</p>
        );
        store.currentDashboard.addTextItem(
          9,
          0,
          3,
          2,
          <p>Testes</p>
        );

        store.currentDashboard.addAnalyticsItem(
          0,
          2,
          4,
          6,
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
        store.currentDashboard.addTextItem(
          4,
          2,
          5,
          6,
          <p>Testes</p>
        );
        store.currentDashboard.addTextItem(
          9,
          2,
          3,
          12,
          <p>Testes</p>
        );
        store.currentDashboard.addTextItem(
          0,
          8,
          9,
          6,
          <p>Testes</p>
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
