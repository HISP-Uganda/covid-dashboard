import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "@dhis2/app-runtime";
import "mobx-react-lite/batchingForReactDom";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const appConfig = {
  baseUrl: process.env.REACT_APP_DHIS2_BASE_URL || "http://localhost:8080",
  apiVersion: 32,
};

ReactDOM.render(
  <Provider config={appConfig}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
