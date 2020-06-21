import React from "react";
import ReactDOM from "react-dom";
import "mobx-react-lite/batchingForReactDom";
import { init } from "d2";
import { store } from "./Store";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import Loading from "./components/Loading";
import { StoreContext } from "./Context";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  // Redirect,
} from "react-router-dom";
import { Layout, Menu, Switch as ASwitch } from "antd";
import logo from "./images/image.png";
import { Covid19 } from "./components/Covid19";

import "./App.css";
import "./index.css";
import { Dashboard } from "./components/Dashboard";

const config = {
  baseUrl: process.env.REACT_APP_DHIS2_BASE_URL || "http://localhost:8080/api",
  headers: process.env.REACT_APP_DHIS2_AUTHORIZATION || null,
};
const { Header } = Layout;

ReactDOM.render(<Loading />, document.getElementById("root"));

const initialize = async () => {
  const d2 = await init(config);
  store.setD2(d2);
  await store.loadUserOrgUnits();
  ReactDOM.render(
    <StoreContext.Provider value={store}>
      <Router>
        <div>
          <Header
            style={{ background: "#EBEFF9", display: "flex", padding: 0 }}
          >
            <div
              className="logo"
              style={{ width: 120, textAlign: "center" }}
            >
              <img src={logo} alt="Logo" height="48" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
              <span style={{ marginBottom: -10, marginTop: 0, fontSize: 28 }}>Ministry of Health</span>
              <span style={{ marginTop: -24, fontWeight: 'lighter', fontSize: 20 }}>COVID-19 Monitoring Dashboard </span>
            </div>

            {/* <div style={{ marginLeft: 'auto' }}><ASwitch onChange={store.setIsLight} checked={store.isLight} /></div> */}
            <Menu mode="horizontal" defaultSelectedKeys={["cases"]} style={{ marginLeft: 'auto' }}>
              <Menu.Item key="cases" style={{ textTransform: "uppercase", fontWeight: 'lighter' }}>
                <Link to={`/`}>Dashboard</Link>
              </Menu.Item>
              <Menu.Item key="treatment" style={{ textTransform: "uppercase", fontWeight: 'lighter' }}>
                <Link to={`/summary`}>Summary Status</Link>
              </Menu.Item>
            </Menu>
          </Header>
          <hr style={{ margin: 0, border: '1px solid black' }} />
          <hr style={{ margin: 0, border: '1px solid yellow' }} />
          <hr style={{ margin: 0, border: '1px solid red' }} />
          <Switch>
            <Route path="/covid-19">
              <Covid19 />
            </Route>
            <Route exact path="/">
              <Dashboard />
            </Route>
          </Switch>
          <div style={{ background: '#D8D8D8', padding: 10, textAlign: 'right' }}>HISP Uganda</div>
        </div>
      </Router>
    </StoreContext.Provider>,
    document.getElementById("root")
  );
};

initialize();
