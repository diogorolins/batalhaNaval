import React from "react";

import { table } from "../../../services/TableGameServices";

import RivalGameCell from "../rivalGameCell/RivalGameCell";
import Legend from "../legend/Legend";

import "./index.css";

const col = table.col;
const rol = table.rol;

const RivalTableBoard = (props) => {
  const { strikes } = props;
  return (
    <section className="rivalTable">
      <table className="rivalTable__board">
        <tbody>
          {col.map((c) => (
            <tr key={c} className="rivalTable_board___tr">
              {rol.map((r) => (
                <RivalGameCell key={r + c} cell={r + c} strikes={strikes} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Legend />
    </section>
  );
};

export default RivalTableBoard;
