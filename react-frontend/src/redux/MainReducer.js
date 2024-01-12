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
  },
});

export const { setToastMessage } = mainSlice?.actions;

export default mainSlice?.reducer;
