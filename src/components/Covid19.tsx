import React from "react";
import { Menu } from "antd";
import { Switch, Route, Link, useRouteMatch } from "react-router-dom";
import { Cases } from "./covid19/Cases";
import { observer } from "mobx-react";
import { Treatment } from "./covid19/Treatment";
import { Surveillance } from "./covid19/Surveillance";
import { Prevention } from "./covid19/Prevention";
import { Risk } from "./covid19/Risk";
import { StockStatus } from "./covid19/StockStatus";

export const Covid19 = observer(() => {
  let { path } = useRouteMatch();
  return (
    <div style={{ width: "99vw", margin: "auto" }}>
      <Menu
        mode="horizontal"
        // style={{ marginBottom: 5, marginTop: 5 }}
        defaultSelectedKeys={["cases"]}
      >
        <Menu.Item key="cases">
          <Link to={`${path}`} style={{ textTransform: "uppercase" }}>
            Cases and EPI
          </Link>
        </Menu.Item>
        <Menu.Item key="treatment">
          <Link to={`${path}/treatment`} style={{ textTransform: "uppercase" }}>
            Treatment
          </Link>
        </Menu.Item>
        <Menu.Item key="surveillance">
          <Link
            to={`${path}/surveillance`}
            style={{ textTransform: "uppercase" }}
          >
            Surveillance
          </Link>
        </Menu.Item>
        <Menu.Item key="prevention">
          <Link
            to={`${path}/prevention`}
            style={{ textTransform: "uppercase" }}
          >
            Prevention
          </Link>
        </Menu.Item>
        <Menu.Item key="risk">
          <Link to={`${path}/risk`} style={{ textTransform: "uppercase" }}>
            Risk
          </Link>
        </Menu.Item>
        <Menu.Item key="stock">
          <Link
            to={`${path}/stock-status`}
            style={{ textTransform: "uppercase" }}
          >
            Stock Status
          </Link>
        </Menu.Item>
      </Menu>
      <Switch>
        <Route path={`${path}`} exact>
          <Cases />
        </Route>
        <Route path={`${path}/treatment`}>
          <Treatment />
        </Route>
        <Route path={`${path}/surveillance`}>
          <Surveillance />
        </Route>
        <Route path={`${path}/prevention`}>
          <Prevention />
        </Route>
        <Route path={`${path}/risk`}>
          <Risk />
        </Route>
        <Route path={`${path}/stock-status`}>
          <StockStatus />
        </Route>
      </Switch>
    </div>
  );
});
