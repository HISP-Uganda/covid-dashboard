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
  Redirect,
} from "react-router-dom";
import { Menu, Layout } from "antd";
import logo from "./images/image.png";
import { Covid19 } from "./components/Covid19";

import "./App.css";
import "./index.css";

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
            style={{ background: "#000066", display: "flex", padding: 0 }}
          >
            <div
              className="logo"
              style={{ width: 120, textAlign: "center", height: 32 }}
            >
              <img src={logo} alt="Logo" height="32" />
            </div>
            <Menu
              theme="dark"
              mode="horizontal"
              style={{
                background: "#000066",
              }}
            >
              <Menu.Item
                key="1"
                className="modified-item"
                style={{
                  textAlign: "center",
                  background: "#95CEFF",
                  // width: 250,
                  color: "white",
                }}
              >
                <Link to="/">COVID-19</Link>
              </Menu.Item>
            </Menu>
          </Header>
          <Switch>
            <Route path="/covid-19">
              <Covid19 />
            </Route>
            <Route exact path="/">
              <Redirect to="/covid-19" />
            </Route>
          </Switch>
        </div>
      </Router>
    </StoreContext.Provider>,
    document.getElementById("root")
  );
};

initialize();
