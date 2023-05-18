// third-party
import { configureStore } from '@reduxjs/toolkit';

// project import

import menu from './reducers/menu';
import usersReducer from './reducers/usersSlice';
import authSlice from './reducers/authSlice';
import messageReducer from './reducers/message';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

const reducer = {
    menu: menu,
    auth: authSlice,
    message: messageReducer,
    users: usersReducer
};

const store = configureStore({
    reducer: reducer,
    devTools: true
});

// const { dispatch } = store;

// export { store, dispatch };
export default store;
