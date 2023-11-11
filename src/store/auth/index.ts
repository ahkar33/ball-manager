import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/auth/authSlice";

const preloadedState = {
	auth: {
		username: localStorage.getItem("username") || "",
	},
};

const store = configureStore({
	reducer: {
		auth: authReducer,
	},
	preloadedState,
});

export default store;
