import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClient'

export const getAllProblem = createAsyncThunk(
  'problem/getAll',
  async (_, { rejectWithValue }) => {
    try {
    const response =  await axiosClient.get('/problem/getAll');
    return response.data
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


export const solvedProblem = createAsyncThunk(
  'problem/solved',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/problem/solved');
      return response.data.solvedProblems;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const problemSlice = createSlice({
  name: 'problems',
  initialState: {
    allProblem:null,
    solvedProblems:null,
    isLoading: false,
    error: null
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProblem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllProblem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allProblem = action.payload;
      })
      .addCase(getAllProblem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.allProblem = null;
      })
  
      .addCase(solvedProblem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(solvedProblem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.solvedProblems = action.payload;
      })
      .addCase(solvedProblem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.solvedProblems = null;
      })
  }
});

export default problemSlice.reducer;
