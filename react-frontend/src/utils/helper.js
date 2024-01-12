import { setToastMessage } from "../redux/MainReducer";
import { store } from "../redux/Store";

export const successToast = (data) => {
  store.dispatch(
    setToastMessage({
      severity: "success",
      message: data,
      messageStatus: true,
    })
  );
};
