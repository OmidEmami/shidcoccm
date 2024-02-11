// src/redux/store.js
import { createStore ,combineReducers} from "redux";
import tokenReducer from "./tokenReducer";
import addMessageReducer from "./addMessageReducer";
import cartReducer from "./cartReducer";
const rootReducer = combineReducers({
    tokenReducer,
    addMessageReducer,
    cartReducer
    
  });
  const store = createStore(rootReducer);
export default store;