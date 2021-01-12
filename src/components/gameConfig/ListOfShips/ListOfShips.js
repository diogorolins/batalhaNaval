import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

import "./index.css";
const ListOfShips = (props) => {
  const { ships, handleChangeShip, ship, shipSelected, selectedShips } = props;

  return (
    <section className="listShips">
      <h1>Selecione o barco que deseja posicionar:</h1>
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="ships"
          name="ships"
          value={shipSelected}
          onChange={handleChangeShip}
        >
          {ships.map((s) => (
            <FormControlLabel
              key={s.id}
              value={String(s.id)}
              control={<Radio color="default" />}
              label={s.name}
              disabled={true}
           
            />
          ))}
        </RadioGroup>
      </FormControl>
      <div className="listShips__size">
        Você deve escolher{" "}
        <div className="listShips__size___number">{ship.size}</div> posições
      </div>
    </section>
  );
};

export default ListOfShips;
