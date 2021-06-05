import { combineReducers } from 'redux';
import sidebarReducer from "./sidebarReducer";
import graphReducer from "./graphReducer";

const rootReducer = combineReducers({
    sidebarReducer,
    graphReducer
})

export default rootReducer;
