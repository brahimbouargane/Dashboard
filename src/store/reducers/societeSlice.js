import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = { records: [], loading: false, error: null, record: null };
const API = process.env.REACT_APP_BASE_URL;
const token = localStorage.getItem('token');

export const fetchSocietes = createAsyncThunk('Societes/fetchSocietes', async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await axios.get(`${API}Societe`, {
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

export const deleteSociete = createAsyncThunk('Societes/deleteSociete', async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        await fetch(`${API}Societe/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const insertSociete = createAsyncThunk('Societes/insertSociete', async (item, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    // const { auth } = getState();
    // item.userId = auth.id;

    try {
        const res = await axios.post(
            `${API}Societe`,
            {
                logo: item.logo,
                societe: item.societe,
                email: item.email,
                responsable: item.responsable,
                adresse: item.adresse,
                telephone: item.telephone,
                fix: item.fix
            },
            {
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

export const editSociete = createAsyncThunk('Societes/editSociete', async (item, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await axios.patch(
            `${API}Societe/${item.id}`,
            {
                logo: item.logo,
                societe: item.societe,
                email: item.email,
                responsable: item.responsable,
                adresse: item.adresse,
                telephone: item.telephone,
                fix: item.fix
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

const societeSlice = createSlice({
    name: 'Societes',
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
        [fetchSocietes.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [fetchSocietes.fulfilled]: (state, action) => {
            state.loading = false;
            state.records = action.payload;
        },
        [fetchSocietes.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //create user
        [insertSociete.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [insertSociete.fulfilled]: (state, action) => {
            state.loading = false;
            state.records.push(action.payload);
        },
        [insertSociete.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //delete user
        [deleteSociete.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [deleteSociete.fulfilled]: (state, action) => {
            state.loading = false;
            state.records = state.records.filter((el) => el.id !== action.payload);
        },
        [deleteSociete.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        //edit user
        [editSociete.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [editSociete.fulfilled]: (state, action) => {
            state.loading = false;
            state.record = action.payload;
        },
        [editSociete.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export default societeSlice.reducer;
