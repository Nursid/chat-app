import {
    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
    USER_LIST_FAIL,
  } from "../constants/userConstants";
  import type { UserState } from "@/types/userType";
  import  type { UserActionTypes } from "../actions/userActions";
  
  const initialState: UserState = {
    loading: false,
    users: [],
    error: null,
  };
  
  export const userListReducer = (
    state = initialState,
    action: UserActionTypes
  ): UserState => {
    switch (action.type) {
      case USER_LIST_REQUEST:
        return { ...state, loading: true, error: null };
      case USER_LIST_SUCCESS:
        return { ...state, loading: false, users: action.payload };
      case USER_LIST_FAIL:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  