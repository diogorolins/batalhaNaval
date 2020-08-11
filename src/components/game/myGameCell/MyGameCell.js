import React from "react";

import "./index.css";

const MyGameCell = (props) => {
  const { cell, clearCellPosition } = props;
  let classCell = "";
  let maxPriority = 0;
  let myShipCells = [];

  if (clearCellPosition) {
    clearCellPosition.forEach((c) => {
      myShipCells = myShipCells.concat(c.position);
    });
  }

  const classCells = [
    {
      class: "myTable_board___td____checked",
      check: myShipCells.includes(cell),
      priority: 1,
    },
    {
      class: "myTable_board___td",
      check: !myShipCells.includes(cell),
      priority: 2,
    },
  ];

  const classCellPassInTest = classCells.filter((c) => c.check);

  classCellPassInTest.forEach((c) => {
    if (c.priority > maxPriority) {
      classCell = c.class;
      maxPriority = c.priority;
    }
  });

  return <td className={classCell}>{cell}</td>;
};

export default MyGameCell;
