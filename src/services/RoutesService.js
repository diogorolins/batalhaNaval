import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import PrivateRoute from "./PrivateRoutesService";
import Login from "../pages/login/LoginPage";
import Signin from "../pages/signin/SigninPage";
import Home from "../pages/home/HomePage";
import GameConfig from "../pages/gameConfig/GameConfigPage";
import Game from "../pages/game/GamePage";

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact={true} component={Login} />
      <Route path="/login" exact={true} component={Login} />
      <Route path="/signin" exact={true} component={Signin} />
      <PrivateRoute path="/home" exact={true} component={Home} />
      <PrivateRoute path="/gameConfig" exact={true} component={GameConfig} />
      <PrivateRoute path="/game" exact={true} component={Game} />

      <Route component={Login} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
