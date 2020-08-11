import React from "react";

import "./index.css";

import Button from "@material-ui/core/Button";

const StartGameButton = (props) => {
  const { startGame } = props;
  return (
    <div className="positionButton">
      <Button fullWidth color="primary" variant="contained" onClick={startGame}>
        Iniciar Jogo
      </Button>
    </div>
  );
};

export default StartGameButton;
