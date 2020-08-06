import React from "react";

import "./index.css";

import Button from "@material-ui/core/Button";

const StartGameButton = () => {
  return (
    <div className="positionButton">
      <Button fullWidth color="primary" variant="contained">
        Iniciar Jogo
      </Button>
    </div>
  );
};

export default StartGameButton;
