import React from "react";

import { table } from "../../../services/TableGameServices";

import StrikeForm from "../strikeForm/StrikeForm";
import MyGameCell from "../myGameCell/MyGameCell";

import "./index.css";

const col = table.col;
const rol = table.rol;

const MyTableBoard = (props) => {
  const {
    fillStrikeField,
    strikeField,
    myShips,
    hitStrike,
    myTurn,
    strikes,
  } = props;

  const clearCellPosition = myShips ? myShips.ships : 0;

  return (
    <section className="myTable">
      <table className="myTable__board">
        <tbody>
          {col.map((c) => (
            <tr key={c} className="myTable_board___tr">
              {rol.map((r) => (
                <MyGameCell
                  key={r + c}
                  cell={r + c}
                  clearCellPosition={clearCellPosition}
                  strikes={strikes}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <StrikeForm
        fillStrikeField={fillStrikeField}
        strikeField={strikeField}
        hitStrike={hitStrike}
        myTurn={myTurn}
      />
    </section>
  );
};

export default MyTableBoard;
