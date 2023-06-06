// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import usersSlice from './usersSlice';
import authSlice from './authSlice';
import message from './message';
import vehiculeSlice from './vehiculeSlice';
import societeSlice from './societeSlice';
import contratSlice from './contratsSlice';
import examenSlice from './examensSlice';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, usersSlice, authSlice, message, vehiculeSlice, societeSlice, contratSlice, examenSlice });

export default reducers;
