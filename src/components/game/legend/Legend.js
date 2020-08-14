import React from "react";

import "./index.css";

const Legend = () => {
  return (
    <section className="legend">
      <div className="legend_red">
        <div className="legend_red__box"></div>
        <div className="legend_red__text">Acertou</div>
      </div>
      <div className="legend_blue">
        <div className="legend_blue__box"></div>
        <div className="legend_blue__text">Errou</div>
      </div>
    </section>
  );
};

export default Legend;
