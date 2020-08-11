import React from "react";
import { withRouter } from "react-router-dom";

import Snack from "../../services/SnackService";
import ApiService from "../../services/ApiService";

import FormSignin from "../../components/signin/formSignin/FormSignin";
import Header from "../../components/general/header/Header";
import Footer from "../../components/general/footer/Footer";

import "./index.css";

class Signin extends React.Component {
  state = {
    snack: {
      open: false,
      severity: "error",
      message: "",
    },
  };

  backToLogin = () => {
    this.props.history.push("/login");
  };

  createUser = async (userFields) => {
    if (userFields.isValid) {
      try {
        const response = await ApiService.createUser(userFields.user);
        if (response.status === 201) {
          this.changeSnack("Usuário cadastrado com sucesso.", "success", true);

          setTimeout(() => {
            this.props.history.push("/");
          }, 2000);
        } else {
          this.changeSnack(response.data.error, "error", true);
        }
      } catch (err) {
        console.log(err);
        this.changeSnack("Erro na aplicação, tente mais tarde.", "error", true);
      }
    } else {
      this.changeSnack(
        "Todos os campos são obrigatórios e as senhas devem ser iguais.",
        "error",
        true
      );
    }
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

  closeSnack = () => {
    this.changeSnack("", "error", false);
  };

  render() {
    const { snack } = this.state;
    return (
      <div className="grid">
        <Header />
        <Snack close={this.closeSnack} snack={snack} />
        <main className="content">
          <FormSignin
            backToLogin={this.backToLogin}
            createUser={this.createUser}
          />
        </main>
        <Footer />
      </div>
    );
  }
}

export default withRouter(Signin);
