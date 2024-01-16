// src/redux/store.js
import { createStore ,combineReducers} from "redux";
import tokenReducer from "./tokenReducer";
import addMessageReducer from "./addMessageReducer";
const rootReducer = combineReducers({
    tokenReducer,
    addMessageReducer
    
  });
  const store = createStore(rootReducer);
export default store;