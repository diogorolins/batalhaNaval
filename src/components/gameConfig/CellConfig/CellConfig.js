import React from "react";

import "./index.css";

const CellConfig = (props) => {
  const { cell, selectedCells, selectCell, cellsDone } = props;
  let classCell = "";
  let maxPriority = 0;

  const classCells = [
    {
      class: "tableBoard__board___td____checked",
      check: selectedCells.includes(cell),
      priority: 1,
    },
    {
      class: "tableBoard__board___td",
      check: !selectedCells.includes(cell),
      priority: 2,
    },
    {
      class: "tableBoard__board___td____done",
      check: cellsDone.includes(cell),
      priority: 3,
    },
  ];

  const classCellPassInTest = classCells.filter((c) => c.check);

  classCellPassInTest.forEach((c) => {
    if (c.priority > maxPriority) {
      classCell = c.class;
      maxPriority = c.priority;
    }
  });

  return (
    <td onClick={() => selectCell(cell)} className={classCell}>
      {cell}
    </td>
  );
};

export default CellConfig;
