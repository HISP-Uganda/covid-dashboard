import React from "react";
import { Menu, Switch as ASwitch } from "antd";
import { Switch, Route, useRouteMatch, Link, Redirect } from "react-router-dom";
import { observer } from "mobx-react";
import { useStore } from "../Context";
import { Dashboard } from "./dashboards/Dashboard";

export const Covid19 = observer(() => {
  const store = useStore()
  let { path, url } = useRouteMatch();

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Menu mode="horizontal" defaultSelectedKeys={["cases"]}>
          <Menu.Item key="cases" style={{ textTransform: "uppercase", fontWeight: 'bolder' }}>
            <Link to={`${url}/cases`}>Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="treatment" style={{ textTransform: "uppercase", fontWeight: 'bolder' }}>
            <Link to={`${url}/treatment`}>Summary Status</Link>
          </Menu.Item>
        </Menu>

        <div style={{ marginLeft: 'auto' }}><ASwitch onChange={store.setIsLight} checked={store.isLight} /></div>
      </div>
      <Switch>
        <Route path={`${path}/:dashboard`}>
          <Dashboard />
        </Route>

        <Route exact path={path}>
          <Redirect to={`${url}/cases`} />
        </Route>
      </Switch>
      <div style={{ background: '#D8D8D8', padding: 10, textAlign: 'right' }}>
        HISP Uganda
      </div>
    </div>
  );
});
