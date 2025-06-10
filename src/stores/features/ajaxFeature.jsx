import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../axios';

export const getCountries = createAsyncThunk("getCountries", async () => {
    const res = await axiosClient.get('countries');
    return res.data.data;
});

const ajaxFeature = createSlice({
    name: 'Ajax',
    initialState: {
        countries: null,
        loading: false,
        error: false,
    },
    extraReducers: (builder) => {
        builder.addCase(getCountries.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getCountries.fulfilled, (state, action) => {
            state.loading = false;
            state.countries = action.payload;
        });

        builder.addCase(getCountries.rejected, (state) => {
            state.loading = false;
        });
    }

});

export default ajaxFeature.reducer;
