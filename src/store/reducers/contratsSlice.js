import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = { records: [], loading: false, error: null, record: null };
const API = process.env.REACT_APP_BASE_URL;
const token = localStorage.getItem('token');

export const fetchContrats = createAsyncThunk('contrats/fetchContrats', async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await axios.get(`${API}Contrat`, {
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

export const deleteContrat = createAsyncThunk('contrats/deleteContrat', async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        await fetch(`${API}Contrat/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const insertContrat = createAsyncThunk('contrats/insertContrat', async (item, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    // const { auth } = getState();
    // item.userId = auth.id;

    try {
        const res = await axios.post(
            `${API}Contrat`,
            {
                ref: item.ref,
                societe_id: item.societe_id,
                vehicule_id: item.vehicule_id,
                intervention_chaque: item.intervention_chaque,
                date_debut: item.date_debut,
                date_fin: item.date_fin,
                status_id: item.status_id
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

export const editContrat = createAsyncThunk('contrats/editContart', async (item, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await axios.patch(
            `${API}Contrat/${item.id}`,
            {
                ref: item.ref,
                societe_id: item.societe_id,
                vehicule_id: item.vehicule_id,
                intervention_chaque: item.intervention_chaque,
                date_debut: item.date_debut,
                date_fin: item.date_fin,
                status_id: item.status_id
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

const contratSlice = createSlice({
    name: 'Contrats',
    initialState,
    reducers: {
        cleanRecord: (state) => {
            state.record = null;
        }
    },

    extraReducers: {
        //get one user post
        [fetchContrats.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [fetchContrats.fulfilled]: (state, action) => {
            state.loading = false;
            state.records = action.payload;
        },
        [fetchContrats.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //fetch users
        // [fetchUsers.pending]: (state) => {
        //     state.loading = true;
        //     state.error = null;
        // },
        // [fetchUsers.fulfilled]: (state, action) => {
        //     state.loading = false;
        //     state.records = action.payload;
        // },
        // [fetchUsers.rejected]: (state, action) => {
        //     state.loading = false;
        //     state.error = action.payload;
        // },
        //create user
        [insertContrat.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [insertContrat.fulfilled]: (state, action) => {
            state.loading = false;
            state.records.push(action.payload);
        },
        [insertContrat.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //delete user
        [deleteContrat.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [deleteContrat.fulfilled]: (state, action) => {
            state.loading = false;
            state.records = state.records.filter((el) => el.id !== action.payload);
        },
        [deleteContrat.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        //edit user
        [editContrat.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [editContrat.fulfilled]: (state, action) => {
            state.loading = false;
            state.record = action.payload;
        },
        [editContrat.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export default contratSlice.reducer;
