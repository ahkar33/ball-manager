import { ITeam } from "@/interfaces";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type TeamsState = {
	teams: ITeam[];
};

const initialState: TeamsState = {
	teams: [],
};

export const teamSlice = createSlice({
	name: "teams",
	initialState,
	reducers: {
		setTeams: (state, action: PayloadAction<ITeam[]>) => {
			state.teams = action.payload;
		},
		addTeam: (state, action: PayloadAction<ITeam>) => {
			state.teams.push(action.payload);
		},
		deleteTeam: (state, action: PayloadAction<string>) => {
			state.teams = state.teams.filter((team) => team.id !== action.payload);
		},
		updateTeam: (state, action) => {
			const updatedTeam = action.payload;
			const index = state.teams.findIndex((team) => team.id === updatedTeam.id);
			if (index !== -1) {
				state.teams[index] = updatedTeam;
			}
			localStorage.setItem("teams", JSON.stringify([...state.teams]));
		},
	},
});

export const { setTeams, addTeam, deleteTeam, updateTeam } = teamSlice.actions;

export default teamSlice.reducer;
