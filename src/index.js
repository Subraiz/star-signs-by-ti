import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import "./index.css";
import App from "./app/app";
import SharePlaylist from "./app/SharePlaylist";
import * as serviceWorker from "./serviceWorker";

const history = createBrowserHistory();

let serverUrl = "http://localhost:5000/api";
serverUrl = "https://starsignsbyti.com:4000/api";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter history={history}>
      <Switch>
        <Route exact path="/playlist/:sign">
          <SharePlaylist serverUrl={serverUrl} />
        </Route>
        <Route path="/">
          <App serverUrl={serverUrl} />
        </Route>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
