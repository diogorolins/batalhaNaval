import React from "react";

import "./index.css";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const StrikeForm = (props) => {
  const { fillStrikeField, strikeField } = props;
  const inputProps = {
    maxLength: 3,
  };
  return (
    <section className="strikeForm">
      <TextField
        className="strikeForm_field"
        size="small"
        variant="outlined"
        inputProps={inputProps}
        onChange={fillStrikeField}
        value={strikeField}
      />{" "}
      <div className="strikeForm_button">
        <Button className="strikeForm_button_bt" variant="outlined">
          <span className="strikeForm_button_txt">Atacar</span>
        </Button>
      </div>
    </section>
  );
};
export default StrikeForm;
