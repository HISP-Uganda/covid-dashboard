import React, { useState, useEffect } from "react";
import { useConfig } from "@dhis2/app-runtime";
import "./App.css";
import { store } from "./Store";
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

const { Header } = Layout;

function App() {
  const { baseUrl, apiVersion } = useConfig();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    store.setD2(baseUrl, apiVersion).then(() => {
      setLoading(false);
    });
  }, [apiVersion, baseUrl, loading]);

  if (loading) {
    return <div>Loading</div>;
  }

  return (
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
          {/* <Footer
            style={{
              textAlign: "center",
              height: "64px",
              padding: 0,
              margin: 0,
            }}
          >
            Command Centre
          </Footer> */}
        </div>
      </Router>
    </StoreContext.Provider>
  );
}

export default App;
