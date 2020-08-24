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


ReactDOM.render(<Loading />, document.getElementById("root"));

const initialize = async () => {
  await store.loadUserOrgUnits();
  ReactDOM.render(<StoreContext.Provider value={store}><App /></StoreContext.Provider>, document.getElementById("root")
  );
};

initialize();
