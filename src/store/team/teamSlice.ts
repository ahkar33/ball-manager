import { ITeam } from "@/interfaces";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type TeamsState = {
	teams: ITeam[];
}

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
	},
});

export const { setTeams, addTeam, deleteTeam } = teamSlice.actions;

export default teamSlice.reducer;
