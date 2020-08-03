import React from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const BackDropBox = (props) => {
  const { open, closeBackDrop } = props;
  const classes = useStyles();

  return (
    <div>
      <Backdrop
        className={classes.backdrop}
        open={open}
        onClick={closeBackDrop}
      >
        Aguardando o outro jogador
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default BackDropBox;
