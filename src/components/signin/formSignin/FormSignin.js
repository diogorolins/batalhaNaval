import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import "./index.css";

const FormSignin = (props) => {
  const { backToLogin, createUser } = props;
  const [name, updateName] = useState("");
  const [email, updateEmail] = useState("");
  const [password, updatePassword] = useState("");
  const [confirmPassword, updateConfirmPassword] = useState("");

  const fields = [
    { name: "name", event: updateName, value: name, isForCreate: true },
    { name: "email", event: updateEmail, value: email, isForCreate: true },
    {
      name: "password",
      event: updatePassword,
      value: password,
      isForCreate: true,
    },
    {
      name: "confirmPassword",
      event: updateConfirmPassword,
      value: confirmPassword,
      isForCreate: false,
    },
  ];

  const fillFields = (event) => {
    fields.forEach((f) => {
      if (f.name === event.target.name) f.event(event.target.value);
    });
  };

  const submitUser = () => {
    const isValid = validateFields(fields);
    const user = fields
      .filter((f) => f.isForCreate)
      .reduce((obj, item) => ((obj[item.name] = item.value), obj), {});
    createUser({ user, isValid });
  };

  const validateFields = (fields) => {
    const errorFields = fields.filter((f) => f.value === "");
    const errorPassword = fields[2].value !== fields[3].value;
    if (errorFields.length || errorPassword) return false;
    return true;
  };

  return (
    <section className="signin">
      <div className="signin__tittle">Faça o seu cadastro</div>
      <div className="signin__input">
        <div className="signin__input_name">
          <TextField
            variant="outlined"
            margin="normal"
            required
            name="name"
            id="name"
            fullWidth
            label="Nome"
            autoFocus
            value={name}
            onChange={fillFields}
          />
        </div>
        <div className="signin__input_email">
          <TextField
            variant="outlined"
            margin="normal"
            required
            name="email"
            id="email"
            fullWidth
            label="Email"
            value={email}
            onChange={fillFields}
          />
        </div>
        <div className="signin__input_password">
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="password"
            name="password"
            type="password"
            label="Senha"
            value={password}
            onChange={fillFields}
          />
        </div>
        <div className="signin__input_password">
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirme a senha"
            value={confirmPassword}
            onChange={fillFields}
          />
        </div>
        <div className="signin__input___button">
          <Button fullWidth variant="contained" onClick={submitUser}>
            Cadastrar
          </Button>
        </div>
        <div className="signin__input___buttonBack">
          <Button onClick={backToLogin} fullWidth>
            Voltar
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FormSignin;
