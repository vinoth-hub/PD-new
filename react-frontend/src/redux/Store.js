/*
 ********************************************************************************************************************************
 *    Module:                   : Store                                                                                           *
 *    Description:              : Combining all the reducers into the store		      											  				    				  			*
 *
 *                                                                                                                              *
 *                            Maintenance Log                                                                                   *
 *                                                                                                                              *
 ********************************************************************************************************************************
 *  DATE               : Developer                                : Description of Change                                       *
 
 *  2023-12-07         : Vinoth                                   : Configured the store                                      *
 * ******************************************************************************************************************************
 */

import { configureStore } from "@reduxjs/toolkit";
import MainReducer from "./MainReducer";

export const store = configureStore({
  reducer: {
    mainReducer: MainReducer,
  },
});
