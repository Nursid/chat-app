import { createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk";
import type { ThunkMiddleware } from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension"; // ✅ fixed import
import { userListReducer } from "./reducers/userReducer";
import type { UserActionTypes } from "./actions/userActions";
import type { UserState } from "@/types/userType";

// AppState interface
export interface AppState {
  userList: UserState;
}

// Combine reducers
const rootReducer = combineReducers<AppState>({
  userList: userListReducer,
});

// Middleware
const middleware = [thunk as ThunkMiddleware<AppState, UserActionTypes>];

// Create store with DevTools
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
