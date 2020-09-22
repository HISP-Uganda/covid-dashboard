import { init } from "d2";
import "mobx-react-lite/batchingForReactDom";
import React from "react";
import ReactDOM from "react-dom";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { App } from "./App";
import "./App.css";
import Loading from "./components/Loading";
import { StoreContext } from "./Context";
import "./index.css";
import { store } from "./Store";

const config = {
  baseUrl: process.env.REACT_APP_DHIS2_BASE_URL || "http://localhost:8080/api",
  headers: process.env.REACT_APP_DHIS2_AUTHORIZATION || null,
};

ReactDOM.render(<Loading />, document.getElementById("root"));
const initialize = async () => {
  const d2 = await init(config);
  store.setD2(d2);
  await store.loadUserOrgUnits();
  ReactDOM.render(<StoreContext.Provider value={store}><App /></StoreContext.Provider>, document.getElementById("root")
  );
};

initialize();
