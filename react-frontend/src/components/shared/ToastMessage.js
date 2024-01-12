/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import Stack from "@mui/material/Stack";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { setToastMessage } from "../../redux/MainReducer";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const ToastMessage = (props) => {
  const dispatch = useDispatch();
  const toastMessage = useSelector((state) => state.mainReducer.toastMessage);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setOpen(toastMessage.messageStatus);
  }, [toastMessage]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    dispatch(
      setToastMessage({
        severity: "",
        message: "",
        messageStatus: false,
      })
    );
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={toastMessage.severity || "success"}
          sx={{ width: "100%" }}
        >
          {toastMessage.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
};
