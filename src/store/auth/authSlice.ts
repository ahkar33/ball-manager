import { createSlice } from "@reduxjs/toolkit";

export type AuthType = {
	username: string;
};

const initialState: AuthType = {
	username: "",
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		saveUserInfo: (state, action) => {
			state.username = action.payload.username;
			localStorage.setItem("username", action.payload.username);
		},
		clearUserInfo: (state) => {
			state.username = "";
			localStorage.removeItem("username");
		},
	},
});

export const { saveUserInfo, clearUserInfo } = authSlice.actions;

export default authSlice.reducer;
