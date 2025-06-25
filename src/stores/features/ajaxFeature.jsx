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

export const getUsers = createAsyncThunk("getUsers", async () => {
    const res = await axiosClient.get("users/all");
    return res.data.data;
});

export const getDailyReports = createAsyncThunk("getDailyReports", async () => {
    const res = await axiosClient.get("daily-reports/all");
    return res.data.data;
});

export const getSalaries = createAsyncThunk("getSalaries", async () => {
    const res = await axiosClient.get("salaries/all-salaries");
    return res.data.data;
});

export const getProductCategories = createAsyncThunk("getProductCategories", async () => {
    const res = await axiosClient.get("product_categories/all");
    return res.data.data;
});

export const getProducts = createAsyncThunk("getProducts", async () => {
    const res = await axiosClient.get("products/all");
    return res.data.data;
});

const ajaxFeature = createSlice({
    name: 'Ajax',
    initialState: {
        expenseCategories: null,
        roles: null,
        games: null,
        gameAssets: null,
        users: null,
        dailyReports: null,
        salaries: null,
        productCategories: null,
        products: null,
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

        // USERS
        builder.addCase(getUsers.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload;
        });

        builder.addCase(getUsers.rejected, (state) => {
            state.loading = false;
        });

        // DAILY REPORTS
        builder.addCase(getDailyReports.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getDailyReports.fulfilled, (state, action) => {
            state.loading = false;
            state.dailyReports = action.payload;
        });

        builder.addCase(getDailyReports.rejected, (state) => {
            state.loading = false;
        });

        // SALARIES
        builder.addCase(getSalaries.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getSalaries.fulfilled, (state, action) => {
            state.loading = false;
            state.salaries = action.payload;
        });

        builder.addCase(getSalaries.rejected, (state) => {
            state.loading = false;
        });

        // PRODUCT CATEGORIES
        builder.addCase(getProductCategories.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getProductCategories.fulfilled, (state, action) => {
            state.loading = false;
            state.productCategories = action.payload;
        });

        builder.addCase(getProductCategories.rejected, (state) => {
            state.loading = false;
        });

        // PRODUCTS
        builder.addCase(getProducts.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload;
        });

        builder.addCase(getProducts.rejected, (state) => {
            state.loading = false;
        });
    }
});

export default ajaxFeature.reducer;
