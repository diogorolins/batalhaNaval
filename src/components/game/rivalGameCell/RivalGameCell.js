import React from "react";

import "./index.css";

const RivalGameCell = (props) => {
  const { cell } = props;
  return <td className="rivalTable_board___td">{cell}</td>;
};

export default RivalGameCell;
