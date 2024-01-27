/*
 ********************************************************************************************************************************
 *    Module:                   : Reducer                                                                                           *
 *    Description:              : Main reducer that keeps entire global states		      											  				    				  			*
 *
 *                                                                                                                              *
 *                            Maintenance Log                                                                                   *
 *                                                                                                                              *
 ********************************************************************************************************************************
 *  DATE               : Developer                                : Description of Change                                       *
 
 *  2023-12-07         : Vinoth                                    : Contains every global state values                                      *
 * ******************************************************************************************************************************
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toastMessage: {
    severity: "",
    message: "",
    messageStatus: false,
  },
  defaultcompany: "",
  userFullName: "",
  userId: "",
  token: "",
};

const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    setToastMessage: (state, action) => {
      state["toastMessage"] = {
        severity: action?.payload?.severity,
        message: action?.payload?.message,
        messageStatus: action?.payload?.messageStatus,
      };
    },

    setUserData: (state, action) => {
      state["defaultcompany"] = action?.payload?.defaultcompany;
      state["userFullName"] = action?.payload?.userFullName;
      state["userId"] = action?.payload?.userId;
      state["token"] = action?.payload?.token;
    },
  },
});

export const { setToastMessage, setUserData } = mainSlice?.actions;

export default mainSlice?.reducer;
