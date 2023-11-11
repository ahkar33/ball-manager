import IPlayer from "./IPlayer";

interface ITeam {
  id: string;
	name: string;
	player_count: number;
	region: string;
	country: string;
	players: IPlayer[]
}

export default ITeam;