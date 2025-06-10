import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../axios';
import toast from 'react-hot-toast';

export const login = createAsyncThunk("login", async (formData, { rejectWithValue }) => {
    try {
        const res = await axiosClient.post(`${import.meta.env.VITE_API_URL}login`, formData);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Login failed");
    }
});

export const getUser = createAsyncThunk("getUser", async () => {
    const res = await axiosClient.get('user');
    console.log(res)
    return res.data;
});

export const logout = createAsyncThunk("Logout", async (auth) => {
    const authContext = auth;
    const res = await axiosClient.post(`${import.meta.env.VITE_API_URL}logout`).then(res => {
        toast.success("Logged out.");
        authContext.setToken(null);
        authContext.setUser(null);
        window.location.reload()
    });
    return res.data;
});

const authFeature = createSlice({
    name: 'Auth',
    initialState: {
        user: null,
        data: null,
        loading: false,
        error: false,
    },
    extraReducers: (builder) => {
        // login
        builder.addCase(login.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.user = action.payload.user;
        });

        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // logout
        builder.addCase(logout.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(logout.fulfilled, (state, action) => {
            state.loading = false;
            state.data = null;
            state.user = null;
        });

        builder.addCase(logout.rejected, (state, action) => {
            state.loading = false;
        });

        // getUser
        builder.addCase(getUser.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        });

        builder.addCase(getUser.rejected, (state, action) => {
            state.loading = false;
        });
    }
});

export default authFeature.reducer;
