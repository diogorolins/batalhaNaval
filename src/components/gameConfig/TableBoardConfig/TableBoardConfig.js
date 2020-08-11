import React from "react";

import { table } from "../../../services/TableGameServices";

import NextShipButton from "../../gameConfig/NextShipButton/NextShipButton";
import StartGameButton from "../../gameConfig/StartGameButton/StartGameButton";
import CellConfig from "../CellConfig/CellConfig";

import "./index.css";

const col = table.col;
const rol = table.rol;

const TableBoardConfig = (props) => {
  const {
    selectCell,
    selectedCells,
    goToNextShip,
    cellsDone,
    gameReadyToStart,
    startGame,
  } = props;
  return (
    <section className="tableBoard">
      <div className="tableBoard__tittle">Selecione a posição do Barco</div>
      <table className="tableBoard__board">
        <tbody>
          {col.map((c) => (
            <tr key={c} className="tableBoard__board___tr">
              {rol.map((r) => (
                <CellConfig
                  key={r + c}
                  cell={r + c}
                  selectCell={selectCell}
                  selectedCells={selectedCells}
                  cellsDone={cellsDone}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {gameReadyToStart ? (
        <StartGameButton startGame={startGame} />
      ) : (
        <NextShipButton goToNextShip={goToNextShip} />
      )}
    </section>
  );
};

export default TableBoardConfig;
