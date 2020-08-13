import React from "react";

import "./index.css";

import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const StrikeForm = (props) => {
  const { fillStrikeField, strikeField, hitStrike, myTurn } = props;
  const inputProps = {
    maxLength: 3,
  };

  const getEnter = (event) => {
    if (event.charCode === 13) {
      hitStrike();
    }
  };

  return (
    <section className="strikeForm">
      {myTurn ? (
        <>
          <TextField
            className="strikeForm_field"
            size="small"
            variant="outlined"
            inputProps={inputProps}
            onChange={fillStrikeField}
            value={strikeField}
            onKeyPress={getEnter}
            autoFocus
          />
          <div className="strikeForm_button">
            <Button
              className="strikeForm_button_bt"
              variant="outlined"
              onClick={hitStrike}
            >
              <span className="strikeForm_button_txt">Atacar</span>
            </Button>
          </div>
        </>
      ) : (
        <div className="strikeForm_waiting">
          <div className="strikeForm_waiting_text">Aguarde sua vez </div>
          <div className="strikeForm_waiting_gif">
            <CircularProgress color="inherit" size={20} />
          </div>
        </div>
      )}
    </section>
  );
};
export default StrikeForm;
