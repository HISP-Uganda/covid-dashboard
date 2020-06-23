import { SettingOutlined } from '@ant-design/icons';
import { Dropdown, Layout, Menu, Switch as ASwitch } from "antd";
import "mobx-react-lite/batchingForReactDom";
import React from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import {
  HashRouter as Router,
  Link, Route, Switch
} from "react-router-dom";
import "./App.css";
import { Case } from "./components/dashboards/Cases";
import { Community } from "./components/dashboards/Community";
import { Dashboard } from "./components/dashboards/Dashboard";
import { Finance } from "./components/dashboards/Finance";
import { ICT } from "./components/dashboards/ICT";
import { Logistics } from "./components/dashboards/Logistics";
import { Risk } from "./components/dashboards/Risk";
import { Surveillance } from "./components/dashboards/Surveillance";
import logo from "./images/image.png";
import "./index.css";
import { observer } from 'mobx-react';
import { useStore } from './Context';
import { Settings } from './components/Settings';

const { Header } = Layout;
const { SubMenu } = Menu;

export const App = observer(() => {

  const store = useStore();

  const menu = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
          1st menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
          2nd menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
          3rd menu item
        </a>
      </Menu.Item>
      {/* <Menu.Item danger>a danger item</Menu.Item> */}
    </Menu>
  );

  return <Router>
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

          <div style={{ marginLeft: 'auto' }}><ASwitch onChange={store.setIsLight} checked={store.isLight} /></div>
          <div style={{ marginLeft: 'auto', marginRight: 20, display: 'flex', alignItems: 'center' }}>
            {/* <Link style={{ textTransform: 'uppercase', color: 'white', fontWeight: 'bold' }} to={`/`}>Dashboard</Link>
            
            
            <Dropdown overlay={menu}>Others</Dropdown>
            <SettingOutlined style={{ fontSize: '24px', color: 'white' }} /> */}

            <Menu mode="horizontal" theme="dark" style={{ background: 'none' }} className="ant-menu-item-selected">
              <Menu.Item key="mail" className="modified-item">
                <Link style={{ textTransform: 'uppercase', color: 'white', fontWeight: 'bold' }} to={`/`}>Dashboard</Link>
              </Menu.Item>
              <Menu.Item key="surveillance" className="modified-item">
                <Link style={{ textTransform: 'uppercase', color: 'white', fontWeight: 'bold' }} to={`/surveillance`}>Surveillance</Link>
              </Menu.Item>
              <Menu.Item key="case-management" className="modified-item">
                <Link style={{ textTransform: 'uppercase', color: 'white', fontWeight: 'bold' }} to={`/case-management`}>Case Management</Link>
              </Menu.Item>
              <Menu.Item key="logistics" className="modified-item">
                <Link style={{ textTransform: 'uppercase', color: 'white', fontWeight: 'bold' }} to={`/logistics`}>Logistics</Link>
              </Menu.Item>
              <SubMenu title="Others" style={{ textTransform: 'uppercase', color: 'white', fontWeight: 'bold' }}>
                <Menu.Item key="setting:1"><Link style={{ textTransform: 'uppercase', color: 'white', fontWeight: 'bold' }} to={`/risk`}>Risk Communication</Link></Menu.Item>
                <Menu.Item key="setting:2"><Link style={{ textTransform: 'uppercase', color: 'white', fontWeight: 'bold' }} to={`/community`}>Community Engagement</Link></Menu.Item>
                <Menu.Item key="setting:3"><Link style={{ textTransform: 'uppercase', color: 'white', fontWeight: 'bold' }} to={`/ict`}>Strategic Information/ICT</Link></Menu.Item>
                <Menu.Item key="setting:4"><Link style={{ textTransform: 'uppercase', color: 'white', fontWeight: 'bold' }} to={`/finance`}>Finance and Resource Mobilizations</Link></Menu.Item>
              </SubMenu>
            </Menu>
            <Settings />
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
});