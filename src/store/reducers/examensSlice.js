import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = { records: [], loading: false, error: null, record: null };
const API = process.env.REACT_APP_BASE_URL;
const token = localStorage.getItem('token');

export const fetchExamens = createAsyncThunk('examens/fetchExamens', async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await axios.get(`${API}Examen`, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// export const fetchUser = createAsyncThunk('contrats/fetchUser', async (id, thunkAPI) => {
//     const { rejectWithValue } = thunkAPI;
//     try {
//         const res = await fetch(`${API}User/${id}`);
//         const data = await res.json();
//         return data;
//     } catch (error) {
//         return rejectWithValue(error.message);
//     }
// });

export const deleteExamen = createAsyncThunk('examens/deleteExamen', async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        await fetch(`${API}Examen/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const insertExamen = createAsyncThunk('examens/insertExamen', async (item, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    // const { auth } = getState();
    // item.userId = auth.id;

    try {
        const res = await axios.post(
            `${API}Examen`,
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

export const editExamen = createAsyncThunk('examens/editExamen', async (item, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const res = await axios.patch(
            `${API}Examen/${item.id}`,
            {
                email: item.email,
                name: item.name,
                telephone: item.telephone,
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

const examenSlice = createSlice({
    name: 'examens',
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
        [fetchExamens.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [fetchExamens.fulfilled]: (state, action) => {
            state.loading = false;
            state.records = action.payload;
        },
        [fetchExamens.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //create user
        [insertExamen.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [insertExamen.fulfilled]: (state, action) => {
            state.loading = false;
            state.records.push(action.payload);
        },
        [insertExamen.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        //delete user
        [deleteExamen.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [deleteExamen.fulfilled]: (state, action) => {
            state.loading = false;
            state.records = state.records.filter((el) => el.id !== action.payload);
        },
        [deleteExamen.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        //edit user
        [editExamen.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [editExamen.fulfilled]: (state, action) => {
            state.loading = false;
            state.record = action.payload;
        },
        [editExamen.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export default examenSlice.reducer;
