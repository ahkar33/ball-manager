import { IPlayer } from "@/interfaces";
import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import AssignTeamModal from "./AssignTeamModal/AssignTeamModal";
import { useDispatch, useSelector } from "react-redux";
import { TeamsState, setInTeamUsers } from "@/store/team/teamSlice";

const Players = () => {
	const inTeamUsers = useSelector(
		(state: { teams: TeamsState }) => state.teams.inTeamUsers
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
				`https://www.balldontlie.io/api/v1/players?page=${pageNum}`
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
		<div className="items-center justify-center space-y-4 h-full p-12 w-full">
			<InfiniteScroll
				dataLength={players.length}
				next={() => {}}
				hasMore={hasMore}
				loader={null}
			>
				{players.map((player, index) => (
					<div
						key={player.id + player.first_name + index}
						className="flex gap-3"
					>
						<p>
							{index + 1} {player.first_name}
						</p>
						<button
							onClick={() => handleClick(player)}
							disabled={isPlayerExistsInTeam(player)}
						>
							Add
						</button>
					</div>
				))}
			</InfiniteScroll>

			{hasMore && (
				<div className="text-center mt-4">
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						onClick={handleLoadMore}
						disabled={isLoading}
					>
						{isLoading ? "Loading..." : "Load More"}
					</button>
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
