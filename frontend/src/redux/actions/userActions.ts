import axios from "axios";
import type { ThunkDispatch } from "redux-thunk";
import {
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
} from "../constants/userConstants";
import type { User } from "@/types/userType";
import type { AppState } from "../store";
import { API_URL } from "@/config";

interface UserListRequestAction {
  type: typeof USER_LIST_REQUEST;
}

interface UserListSuccessAction {
  type: typeof USER_LIST_SUCCESS;
  payload: User[];
}

interface UserListFailAction {
  type: typeof USER_LIST_FAIL;
  payload: string;
}

export type UserActionTypes =
  | UserListRequestAction
  | UserListSuccessAction
  | UserListFailAction;

export const getAllUsers = (currentUserId: string) => async (
  dispatch: ThunkDispatch<AppState, void, UserActionTypes>
) => {

  
  try {
    dispatch({ type: USER_LIST_REQUEST });

    const { data } = await axios.get<User[]>(
      `${API_URL}/api/user/getall`
    );
    

    const filteredUsers = data.data.filter(user => user._id !== currentUserId);

    dispatch({
      type: USER_LIST_SUCCESS,
      payload: filteredUsers,
    });

  } catch (error: any) {
    dispatch({
      type: USER_LIST_FAIL,
      payload:
        error.response?.data?.message || error.message || "Something went wrong",
    });
  }
};
