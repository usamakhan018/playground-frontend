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

export const getGames = createAsyncThunk("getGames", async () => {
    const res = await axiosClient.get("games/all");
    return res.data.data;
});

export const getGameAssets = createAsyncThunk("getGameAssets", async () => {
    const res = await axiosClient.get("game_assets/all");
    return res.data.data;
});

const ajaxFeature = createSlice({
    name: 'Ajax',
    initialState: {
        expenseCategories: null,
        roles: null,
        games: null,
        gameAssets: null,
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

        // GAMES
        builder.addCase(getGames.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getGames.fulfilled, (state, action) => {
            state.loading = false;
            state.games = action.payload;
        });

        builder.addCase(getGames.rejected, (state) => {
            state.loading = false;
        });

        // GAME ASSETS
        builder.addCase(getGameAssets.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getGameAssets.fulfilled, (state, action) => {
            state.loading = false;
            state.gameAssets = action.payload;
        });

        builder.addCase(getGameAssets.rejected, (state) => {
            state.loading = false;
        });
    }
});

export default ajaxFeature.reducer;
