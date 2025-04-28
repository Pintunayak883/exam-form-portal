import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface User {
  id: string;
  name: string;
  aadhaarNo: string;
  phone: string;
  currentDate: string;
  status: "pending" | "approve" | "reject";
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk<User[]>(
  "users/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/api/admin/users");
      const users = res.data.users.map((u: any) => ({ ...u, id: u._id }));
      return users as User[];
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message ||
          "User fetch karte time kuch gadbad ho gayi"
      );
    }
  }
);

export const updateUserStatus = createAsyncThunk<
  User,
  { id: string; status: "approve" | "reject" }
>("users/updateStatus", async ({ id, status }, thunkAPI) => {
  try {
    const res = await axios.put(`/api/admin/candidate/${id}`, { status });
    const u = res.data;
    return { ...u, id: u._id || u.id } as User;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message ||
        "Status update karte time kuch gadbad ho gayi"
    );
  }
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchUsers handlers
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // updateUserStatus handlers - do NOT toggle global loading
      .addCase(
        updateUserStatus.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.users = state.users.map((user) =>
            user.id === action.payload.id ? action.payload : user
          );
        }
      );
  },
});

export default userSlice.reducer;
