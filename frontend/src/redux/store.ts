import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import type { ThunkMiddleware } from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { userListReducer } from "./reducers/userReducer";
import { messageListReducer } from "./reducers/messageReducer";
import type { UserActionTypes } from "./actions/userActions";
import type { UserState } from "@/types/userType";
import type { MessageState } from "@/types/chat";

// ✅ Define AppState interface
export interface AppState {
  userList: UserState;
  messageList: MessageState;
}

// ✅ Combine reducers
const rootReducer = combineReducers<AppState>({
  userList: userListReducer,
  messageList: messageListReducer,
});

// ✅ Middleware (with proper typing)
const middleware = [
  thunk as ThunkMiddleware<AppState, UserActionTypes>,
];

// ✅ Create store with DevTools
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
