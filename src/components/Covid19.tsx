import React from "react";
import { Menu } from "antd";
import { Switch, Route, useRouteMatch, Link, Redirect } from "react-router-dom";
import { observer } from "mobx-react";
import { Covid19Dashboards } from "./Covid19Dashboards";

export const Covid19 = observer(() => {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Menu mode="horizontal" defaultSelectedKeys={["cases"]}>
        <Menu.Item key="cases" style={{ textTransform: "uppercase" }}>
          <Link to={`${url}/cases`}>Cases and EPI</Link>
        </Menu.Item>
        <Menu.Item key="treatment" style={{ textTransform: "uppercase" }}>
          <Link to={`${url}/treatment`}>Treatment</Link>
        </Menu.Item>
        <Menu.Item key="surveillance" style={{ textTransform: "uppercase" }}>
          Surveillance
        </Menu.Item>
        <Menu.Item key="prevention" style={{ textTransform: "uppercase" }}>
          Prevention
        </Menu.Item>
        <Menu.Item key="risk" style={{ textTransform: "uppercase" }}>
          Risk
        </Menu.Item>
        <Menu.Item key="stock" style={{ textTransform: "uppercase" }}>
          Stock Status
        </Menu.Item>
      </Menu>
      <Switch>
        <Route path={`${path}/:dashboard`}>
          <Covid19Dashboards />
        </Route>

        <Route exact path={path}>
          <Redirect to={`${url}/cases`} />
        </Route>
      </Switch>
    </div>
  );
});
