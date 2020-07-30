import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import PrivateRoute from "./PrivateRoutesService";
import Login from "../pages/login/LoginPage";
import Signin from "../pages/signin/SigninPage";
import Home from "../pages/home/HomePage";

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact={true} component={Login} />
      <Route path="/login" exact={true} component={Login} />
      <Route path="/signin" exact={true} component={Signin} />
      <PrivateRoute path="/home" exact={true} component={Home} />

      <Route component={Login} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
