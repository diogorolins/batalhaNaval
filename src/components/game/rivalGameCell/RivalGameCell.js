import React from "react";

import "./index.css";

const RivalGameCell = (props) => {
  const { cell, strikes } = props;

  let classCell = "";
  let maxPriority = 0;

  const classCells = [
    {
      class: "rivalTable_board___td____hit",
      check: strikes.filter((s) => s.position === cell && !s.hit).length,
      priority: 1,
    },
    {
      class: "rivalTable_board___td____miss",
      check: strikes.filter((s) => s.position === cell && s.hit).length,
      priority: 2,
    },
    {
      class: "rivalTable_board___td",
      check: !strikes.filter((s) => s.position === cell).length,
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

export default RivalGameCell;
