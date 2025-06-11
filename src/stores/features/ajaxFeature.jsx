import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../axios';

export const getExpenseCategories = createAsyncThunk("getExpenseCategories", async () => {
    const res = await axiosClient.get('expense_categories/all');
    return res.data.data;
});

export const getRoles = createAsyncThunk("getRoles", async () => {
    const res = await axiosClient.get("roles/all");
    return res.data.data;
});

const ajaxFeature = createSlice({
    name: 'Ajax',
    initialState: {
        expenseCategories: null,
        roles: null,
        loading: false,
        error: false,
    },
    extraReducers: (builder) => {
        builder.addCase(getExpenseCategories.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getExpenseCategories.fulfilled, (state, action) => {
            state.loading = false;
            state.expenseCategories = action.payload;
        });

        builder.addCase(getExpenseCategories.rejected, (state) => {
            state.loading = false;
        });

        // ROLES
        builder.addCase(getRoles.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getRoles.fulfilled, (state, action) => {
            state.loading = false;
            state.roles = action.payload;
        });

        builder.addCase(getRoles.rejected, (state) => {
            state.loading = false;
        });
    }

});

export default ajaxFeature.reducer;
