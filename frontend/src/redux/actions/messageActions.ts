import axios from "axios";
import type { ThunkDispatch } from "redux-thunk";
import {
  MESSAGE_LIST_REQUEST,
  MESSAGE_LIST_SUCCESS,
  MESSAGE_LIST_FAIL,
} from "../constants/messageConstants";
import type { Message } from "@/types/chat";
import type { AppState } from "../store";
import { API_URL } from "@/config";

interface MessageListRequestAction {
  type: typeof MESSAGE_LIST_REQUEST;
}

interface MessageListSuccessAction {
  type: typeof MESSAGE_LIST_SUCCESS;
  payload: Message[];
}

interface MessageListFailAction {
  type: typeof MESSAGE_LIST_FAIL;
  payload: string;
}

export type MessageActionTypes =
  | MessageListRequestAction
  | MessageListSuccessAction
  | MessageListFailAction;

export const getAllMessage = (sender: string, receiver: string) => async (
  dispatch: ThunkDispatch<AppState, void, MessageActionTypes>
) => {

  
  try {
    dispatch({ type: MESSAGE_LIST_REQUEST });

    const { data } = await axios.get<Message[]>(
      `${API_URL}/api/message/${sender}/${receiver}`
    );

    dispatch({
      type: MESSAGE_LIST_SUCCESS,
      payload: data?.data,
    });

  } catch (error: any) {
    dispatch({
      type: MESSAGE_LIST_FAIL,
      payload:
        error.response?.data?.message || error.message || "Something went wrong",
    });
  }
};
