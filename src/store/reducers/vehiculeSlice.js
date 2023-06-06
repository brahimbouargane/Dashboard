import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = { records: [], loading: false, error: null, record: null };
const API = process.env.REACT_APP_BASE_URL;
const token = localStorage.getItem('token');

export const fetchVehicules = createAsyncThunk('Vehicules/fetchVehicules', async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await axios.get(`${API}Vehicule`, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// export const fetchUser = createAsyncThunk('users/fetchUser', async (id, thunkAPI) => {
//     const { rejectWithValue } = thunkAPI;
//     try {
//         const res = await fetch(`${API}User/${id}`);
//         const data = await res.json();
//         return data;
//     } catch (error) {
//         return rejectWithValue(error.message);
//     }
// });

export const deleteVehicule = createAsyncThunk('Vehicules/deleteVehicule', async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        await fetch(`${API}Vehicule/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const insertVehicule = createAsyncThunk('vehicules/insertVehicule ', async (item, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    // const { auth } = getState();
    // item.userId = auth.id;

    try {
        const res = await axios.post(
            `${API}Vehicule`,
            {
                // email: item.email,
                // name: item.name,
                // telephone: item.telephone,
                // password: item.password,
                // role_id: item.role_id
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

export const editVehicule = createAsyncThunk('Vehicules/editVehicule ', async (item, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await axios.patch(
            `${API}Vehicule/${item.id}`,
            {
                // email: item.email,
                // name: item.name,
                // telephone: item.telephone,
                // role_id: item.role_id
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

const vehiculeSlice = createSlice({
    name: 'Vehicules',
    initialState,
    reducers: {
        cleanRecord: (state) => {
            state.record = null;
        }
    },

    extraReducers: {
        //get one user post
        // [fetchUser.pending]: (state) => {
        //     state.loading = true;
        //     state.error = null;
        // },
        // [fetchUser.fulfilled]: (state, action) => {
        //     state.loading = false;
        //     state.record = action.payload;
        // },
        // [fetchUser.rejected]: (state, action) => {
        //     state.loading = false;
        //     state.error = action.payload;
        // },
        //fetch users
        [fetchVehicules.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [fetchVehicules.fulfilled]: (state, action) => {
            state.loading = false;
            state.records = action.payload;
        },
        [fetchVehicules.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //create user
        [insertVehicule.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [insertVehicule.fulfilled]: (state, action) => {
            state.loading = false;
            state.records.push(action.payload);
        },
        [insertVehicule.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //delete user
        [deleteVehicule.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [deleteVehicule.fulfilled]: (state, action) => {
            state.loading = false;
            state.records = state.records.filter((el) => el.id !== action.payload);
        },
        [deleteVehicule.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        //edit user
        [editVehicule.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [editVehicule.fulfilled]: (state, action) => {
            state.loading = false;
            state.record = action.payload;
        },
        [editVehicule.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export default vehiculeSlice.reducer;
