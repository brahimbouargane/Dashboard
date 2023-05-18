// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import usersSlice from './usersSlice';
import authSlice from './authSlice';
import message from './message';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, usersSlice, authSlice, message });

export default reducers;
