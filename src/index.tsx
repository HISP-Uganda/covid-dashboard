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
import { Layout } from "antd";
import logo from "./images/image.png";

import "./App.css";
import "./index.css";
import { Dashboard } from "./components/dashboards/Dashboard";
import { Summary } from "./components/dashboards/Summary";
import { Surveillance } from "./components/dashboards/Surveillance";
import { Case } from "./components/dashboards/Cases";
import { Logistics } from "./components/dashboards/Logistics";
import { Risk } from "./components/dashboards/Risk";
import { Community } from "./components/dashboards/Community";
import { ICT } from "./components/dashboards/ICT";
import { Finance } from "./components/dashboards/Finance";

import { SettingOutlined } from '@ant-design/icons'

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
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: '1 0 auto' }}>
            <Header
              style={{ display: "flex", padding: 0 }}
            >
              <div
                className="logo"
                style={{ width: 120, textAlign: "center" }}
              >
                <img src={logo} alt="Logo" height="48" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                <span style={{ marginBottom: -10, marginTop: 0, fontSize: 28, color: 'white' }}>Ministry of Health</span>
                <span style={{ marginTop: -24, fontWeight: 'lighter', fontSize: 20, color: 'white' }}>COVID-19 Monitoring Dashboard </span>
              </div>

              {/* <div style={{ marginLeft: 'auto' }}><ASwitch onChange={store.setIsLight} checked={store.isLight} /></div> */}
              <div style={{ marginLeft: 'auto', marginRight: 10, display: 'flex', justifyContent: 'space-around', width: '60%', alignItems: 'center' }}>
                <Link style={{ textTransform: 'uppercase', color: 'white', fontWeight: 'bold' }} to={`/`}>Dashboard</Link>
                {/* <Link style={{ textTransform: 'uppercase', color: 'white', fontWeight: 'bold' }} to={`/summary`}>Summary</Link> */}
                <Link style={{ textTransform: 'uppercase', color: 'white', fontWeight: 'bold' }} to={`/surveillance`}>Surveillance</Link>
                <Link style={{ textTransform: 'uppercase', color: 'white', fontWeight: 'bold' }} to={`/case-management`}>Case Management</Link>
                <Link style={{ textTransform: 'uppercase', color: 'white', fontWeight: 'bold' }} to={`/logistics`}>Logistics</Link>
                <Link style={{ textTransform: 'uppercase', color: 'white', fontWeight: 'bold' }} to={`/risk`}>Risk Communication</Link>
                <Link style={{ textTransform: 'uppercase', color: 'white', fontWeight: 'bold' }} to={`/community`}>Community Engagement</Link>
                <Link style={{ textTransform: 'uppercase', color: 'white', fontWeight: 'bold' }} to={`/ict`}>Strategic Information</Link>
                <Link style={{ textTransform: 'uppercase', color: 'white', fontWeight: 'bold' }} to={`/finance`}>Finance</Link>
                <SettingOutlined style={{ fontSize: '24px', color: 'white' }} />
              </div>
            </Header>
            <hr style={{ margin: 0, border: '1px solid black' }} />
            <hr style={{ margin: 0, border: '1px solid yellow' }} />
            <hr style={{ margin: 0, border: '1px solid red' }} />
            <Switch>
              {/* <Route path={`/summary`}><Summary /></Route> */}
              <Route path={`/surveillance`}><Surveillance /></Route>
              <Route path={`/case-management`}><Case /></Route>
              <Route path={`/logistics`}><Logistics /></Route>
              <Route path={`/risk`}><Risk /></Route>
              <Route path={`/community`}><Community /></Route>
              <Route path={`/ict`}><ICT /></Route>
              <Route path={`/finance`}><Finance /></Route>
              <Route exact path="/">
                <Dashboard />
              </Route>
            </Switch>
          </div>
          <div style={{
            background: '#D8D8D8',
            padding: 10,
            textAlign: 'right',
            flexShrink: 0
          }}>HISP Uganda</div>
        </div>
      </Router>
    </StoreContext.Provider>,
    document.getElementById("root")
  );
};

initialize();
