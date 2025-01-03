import { combineReducers } from "@reduxjs/toolkit";
import chatReducer from "./chat.reducer";
import streamTextReducer from "./streamText.reducer";
import appReducer from "./app.reducer";
import ingestReducer from "./ingest.reducer";

export default combineReducers({
  chat: chatReducer,
  streamText: streamTextReducer,
  app: appReducer,
  ingest: ingestReducer,
});
