import { IPlayer } from "@/interfaces";
import { message, Button } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import AssignTeamModal from "./AssignTeamModal/AssignTeamModal";
import { useDispatch, useSelector } from "react-redux";
import { TeamsState, setInTeamUsers, setTeams } from "@/store/team/teamSlice";

const Players = () => {
	const inTeamUsers = useSelector(
		(state: { teams: TeamsState }) => state.teams.inTeamUsers
	);
	const teams = useSelector(
		(state: { teams: TeamsState }) => state.teams.teams
	);
	const [players, setPlayers] = useState<IPlayer[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [selectedPlayer, setSelectedPlayer] = useState<IPlayer | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const dispatch = useDispatch();

	const getPlayers = async (pageNum: number) => {
		try {
			setIsLoading(true);
			const response = await axios.get<{ data: IPlayer[] }>(
				`https://www.balldontlie.io/api/v1/players?page=${pageNum}&per_page=10`
			);
			const newData = response.data.data;
			if (newData.length === 0) {
				setHasMore(false);
			}
			setPlayers((prevPlayers) => [...prevPlayers, ...newData]);
		} catch (error) {
			message.error("Something went wrong when getting players data");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		try {
			const storeTeams = localStorage.getItem("teams");
			if (storeTeams) {
				dispatch(setTeams(JSON.parse(storeTeams)));
			}
			const storeInTeamUsers = localStorage.getItem("inTeamUsers");
			if (storeInTeamUsers !== null) {
				dispatch(setInTeamUsers(JSON.parse(storeInTeamUsers)));
			}
		} catch (error) {
			message.error("Something went wrong");
		}
	}, []);

	useEffect(() => {
		getPlayers(page);
	}, [page]);

	const handleLoadMore = () => {
		setPage((prev) => prev + 1);
	};

	const handleClose = () => {
		setIsOpen(false);
		setSelectedPlayer(null);
	};

	const handleClick = (player: IPlayer) => {
		setSelectedPlayer(player);
		setIsOpen(true);
	};

	const isPlayerExistsInTeam = (player: IPlayer): boolean => {
		const foundPlayer = inTeamUsers.find((user) => user.id === player.id);
		return !!foundPlayer;
	};

	return (
		<div className="flex flex-col items-center justify-center space-y-4 h-full p-12 w-full mt-10">
			<InfiniteScroll
				dataLength={players.length}
				next={() => {}}
				hasMore={hasMore}
				loader={null}
			>
				{players.map((player, index) => {
					const team = teams.find((team) =>
						team.players.find((_player) => _player.id === player.id)
					);
					return (
						<div
							key={player.id + player.first_name + index}
							className="flex items-center justify-between bg-gray-100 p-4 rounded shadow-md  mb-4"
							style={{
								width: 420,
							}}
						>
							<div className="flex items-center">
								<p className="font-bold mr-4">{index + 1}.</p>
								<div className="flex flex-col gap-2">
									<p>Name - {player.first_name}</p>
									<p>
										Team -{" "}
										{team ? (
											<span className="text-blue-500">{team.name}</span>
										) : (
											<span className="text-red-500">Not Assigned Yet</span>
										)}
									</p>
									<p>
										Position -{" "}
										{player.position ? (
											<span className="text-green-500">{player.position}</span>
										) : (
											<span className="text-red-500">Not Assigned</span>
										)}
									</p>
								</div>
							</div>
							<Button
								type="primary"
								onClick={() => handleClick(player)}
								disabled={isPlayerExistsInTeam(player)}
							>
								Assign
							</Button>
						</div>
					);
				})}
			</InfiniteScroll>

			{hasMore && (
				<div className="text-center mt-4">
					<Button
						type="primary"
						onClick={handleLoadMore}
						loading={isLoading}
						disabled={isLoading}
					>
						{isLoading ? "Loading..." : "Load More"}
					</Button>
				</div>
			)}

			<AssignTeamModal
				open={isOpen}
				onCancel={handleClose}
				item={selectedPlayer}
			/>
		</div>
	);
};

export default Players;
