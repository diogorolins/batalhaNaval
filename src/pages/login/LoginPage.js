import React from "react";
import { withRouter } from "react-router-dom";

import FormLogin from "../../components/login/formLogin/FormLogin";
import Header from "../../components/general/header/Header";
import Footer from "../../components/general/footer/Footer";

import { isAuthenticated } from "../../services/AuthService";
import ApiService from "../../services/ApiService";
import { login } from "../../services/AuthService";
import Snack from "../../services/SnackService";

import "./index.css";

class Login extends React.Component {
  state = {
    snack: {
      open: false,
      severity: "error",
      message: "",
    },
    waitingLogin: false,
  };
  componentDidMount() {
    if (isAuthenticated()) this.props.history.push("/home");
  }

  login = async (email, password) => {
    try {
      this.setState({ waitingLogin: true });
      const response = await ApiService.login({ email, password });
      this.setState({ waitingLogin: false });
      if (response.status === 200) {
        login(response.data.token);
        this.props.history.push("/home");
      } else {
        this.changeSnack(response.data.error, "error", true);
      }
    } catch (err) {
      console.log(err);
      this.changeSnack("Erro na aplicação, tente mais tarde.", "error", true);
    }
  };

  openSigninPage = () => {
    this.props.history.push("/signin");
  };

  closeSnack = () => {
    this.changeSnack("", "error", false);
  };

  changeSnack = (msg, severity, open) => {
    this.setState({
      snack: {
        message: msg,
        severity: severity,
        open: open,
      },
    });
  };

  render() {
    const { snack, waitingLogin } = this.state;
    return (
      <div className="grid">
        <Header />
        <Snack close={this.closeSnack} snack={snack} />
        <main className="content">
          <FormLogin
            login={this.login}
            openSigninPage={this.openSigninPage}
            waitingLogin={waitingLogin}
          />
        </main>
        <Footer />
      </div>
    );
  }
}

export default withRouter(Login);
