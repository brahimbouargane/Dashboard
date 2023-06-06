// third-party
import { configureStore } from '@reduxjs/toolkit';

// project import

import menu from './reducers/menu';
import usersReducer from './reducers/usersSlice';
import authSlice from './reducers/authSlice';
import messageReducer from './reducers/message';
import vehiculeSlice from './reducers/vehiculeSlice';
import societeSlice from './reducers/societeSlice';
import contratSlice from './reducers/contratsSlice';
import examenSlice from './reducers/examensSlice';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

const reducer = {
    menu: menu,
    auth: authSlice,
    message: messageReducer,
    users: usersReducer,
    vehicules: vehiculeSlice,
    societes: societeSlice,
    contrats: contratSlice,
    examens: examenSlice
};

const store = configureStore({
    reducer: reducer,
    devTools: true
});

// const { dispatch } = store;

// export { store, dispatch };
export default store;
