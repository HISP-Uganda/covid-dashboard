import { Menu } from "antd";
import { observer } from 'mobx-react';
import "mobx-react-lite/batchingForReactDom";
import React from "react";
import { Case } from "./components/dashboards/Cases";
import { Community } from "./components/dashboards/Community";
import { Dashboard } from "./components/dashboards/Dashboard";
import { Finance } from "./components/dashboards/Finance";
import { ICT } from "./components/dashboards/ICT";
import { Logistics } from "./components/dashboards/Logistics";
import { Risk } from "./components/dashboards/Risk";
import { Surveillance } from "./components/dashboards/Surveillance";
import { Settings } from './components/Settings';
import {
  HashRouter as Router,
  Link, Route, Switch
} from "react-router-dom";
import emblem from './images/Coat_of_arms_of_Uganda.svg'

import "./App.css";
import "./index.css";

const { SubMenu } = Menu;

export const App = observer(() => {
  // const store = useStore();
  return <Router>
    <div className="w-screen h-screen grid-container">
      <div className="bg-gray-200 flex items-center p-0 m-0 bg-gray-900">
        <img src={emblem} className="w-full" style={{ height: 'auto', width: '100%', maxWidth: 64, marginLeft: 10 }} alt="" />
        <div style={{ display: 'grid', gridTemplateRows: '32px 32px', marginLeft: 20 }}>
          <span style={{ color: 'white', fontSize: 28, marginBottom: 2 }}>Ministry of Health</span>
          <span style={{ color: 'white', fontWeight: 'lighter', fontSize: 20, marginTop: 2 }}>COVID-19 Monitoring Dashboard </span>
        </div>
        <Menu mode="horizontal" theme="dark" style={{ background: 'none', marginLeft: 'auto' }} className="ant-menu-item-selected">
          <Menu.Item key="mail" className="modified-item">
            <Link style={{ textTransform: 'uppercase', color: 'white', fontWeight: 'bold' }} to={`/`}>Summary</Link>
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
      <div>
        <hr style={{ margin: 0, border: '1px solid black' }} />
        <hr style={{ margin: 0, border: '1px solid yellow' }} />
        <hr style={{ margin: 0, border: '1px solid red' }} />
      </div>
      <div className="bg-black">
        <Switch>
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
    </div>
  </Router>
});