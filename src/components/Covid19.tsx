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
          <Link to={`${url}/cases`}>Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="treatment" style={{ textTransform: "uppercase" }}>
          <Link to={`${url}/treatment`}>Summary Status</Link>
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
      <div style={{ background: '#D8D8D8', padding: 10, textAlign: 'right' }}>
        Hisp Uganda
      </div>
    </div>
  );
});
