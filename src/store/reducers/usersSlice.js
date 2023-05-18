import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = { records: [], loading: false, error: null, record: null };
const API = process.env.REACT_APP_BASE_URL;
const token = localStorage.getItem('token');

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await axios.get(`${API}/api/User`, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const fetchUser = createAsyncThunk('users/fetchUser', async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await fetch(`${API}api/User/${id}`);
        const data = await res.json();
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        await fetch(`${API}/api/user/${id}`, {
            method: 'DELETE'
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const insertUser = createAsyncThunk('users/insertUser', async (item, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    // const { auth } = getState();
    // item.userId = auth.id;

    try {
        const res = await axios.post(
            `${API}/api/user`,
            {
                email: item.email,
                name: item.name,
                telephone: item.telephone,
                password: item.password,
                role_id: item.role_id
            },
            {
                body: JSON.stringify(item),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    Authorization: `Bearer ${token}`
                }
            }
        );
        const data = await res.config.data;
        return data;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.message);
    }
});

export const editUser = createAsyncThunk('users/editUser', async (item, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await fetch(`${API}api/User/${item.id}`, {
            method: 'PATCH',
            body: JSON.stringify(item),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                Authorization: `Bearer ${token}`
            }
        });
        const data = await res.json();
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        cleanRecord: (state) => {
            state.record = null;
        }
    },

    extraReducers: {
        //get one user post
        [fetchUser.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [fetchUser.fulfilled]: (state, action) => {
            state.loading = false;
            state.record = action.payload;
        },
        [fetchUser.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //fetch users
        [fetchUsers.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [fetchUsers.fulfilled]: (state, action) => {
            state.loading = false;
            state.records = action.payload;
        },
        [fetchUsers.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //create user
        [insertUser.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [insertUser.fulfilled]: (state, action) => {
            state.loading = false;
            state.records.push(action.payload);
        },
        [insertUser.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //delete user
        [deleteUser.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [deleteUser.fulfilled]: (state, action) => {
            state.loading = false;
            state.records = state.records.filter((el) => el.id !== action.payload);
        },
        [deleteUser.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        //edit user
        [editUser.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [editUser.fulfilled]: (state, action) => {
            state.loading = false;
            state.record = action.payload;
        },
        [editUser.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export default userSlice.reducer;
