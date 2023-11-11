import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/auth/authSlice";
import teamReducer from "@/store/team/teamSlice";

const preloadedState = {
	auth: {
		username: localStorage.getItem("username") || "",
	},
};

const store = configureStore({
	reducer: {
		auth: authReducer,
		teams: teamReducer,
	},
	preloadedState,
});

export default store;
