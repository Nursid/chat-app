import {
    MESSAGE_LIST_REQUEST,
    MESSAGE_LIST_SUCCESS,
    MESSAGE_LIST_FAIL,
  } from "../constants/messageConstants";
  import type { MessageState } from "@/types/chat";
  import  type { MessageActionTypes } from "../actions/messageActions";
  
  const initialState: MessageState = {
    loading: false,
    message: [],
    error: null,
  };
  
  export const messageListReducer = (
    state = initialState,
    action: MessageActionTypes
  ): MessageState => {
    switch (action.type) {
      case MESSAGE_LIST_REQUEST:
        return { ...state, loading: true, error: null };
      case MESSAGE_LIST_SUCCESS:
        return { ...state, loading: false, message: action.payload };
      case MESSAGE_LIST_FAIL:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  