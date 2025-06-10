import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../axios';

export const updateSetting = createAsyncThunk("updateSetting", async (form) => {
    const res = await axiosClient.post('api/admin/profile/update', form);
    return res.data;
});

export const getSetting = createAsyncThunk("getSetting", async () => {
    const res = await axiosClient.get('api/admin/settings');
    return res.data;
});

export const logout = createAsyncThunk("api/logout", async (auth) => {
    const authContext = auth;
    authContext.setToken(null);
    authContext.setUser(null);
    const res = await axiosClient.post('api/logout');
    return res.data;
});

const settingFeature = createSlice({
    name: 'Setting',
    initialState: {
        data: null,
        loading: false,
        error: false,
    },
    extraReducers: (builder) => {
        // login
        builder.addCase(updateSetting.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(updateSetting.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        });

        builder.addCase(updateSetting.rejected, (state, action) => {
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

        // getSetting
        builder.addCase(getSetting.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getSetting.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload.data;
        });

        builder.addCase(getSetting.rejected, (state, action) => {
            state.loading = false;
        });
    }
});

export default settingFeature.reducer;
