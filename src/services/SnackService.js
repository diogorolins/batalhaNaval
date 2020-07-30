import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

const Snack = (props) => {
  const { snack, close } = props;
  const { severity, message, open } = snack;
  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={close}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={close} severity={severity} variant="filled">
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};
export default Snack;
