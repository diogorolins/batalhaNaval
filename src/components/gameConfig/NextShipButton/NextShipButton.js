import React from "react";

import "./index.css";

import Button from "@material-ui/core/Button";

const NextShipButton = (props) => {
  const { goToNextShip } = props;
  return (
    <div className="positionButton">
      <Button
        fullWidth
        color="primary"
        variant="outlined"
        onClick={goToNextShip}
      >
        Gravar Posição
      </Button>
    </div>
  );
};

export default NextShipButton;
