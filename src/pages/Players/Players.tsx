import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

const Players = () => {
	const [players, setPlayers] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const getPlayers = async (page = 1) => {
		try {
			setIsLoading(true);
			const {
				data: { data },
			} = await axios.get(
				`https://www.balldontlie.io/api/v1/players?page=${page}`
			);
			setPlayers(data);
		} catch (error) {
			message.error("Something went wrong when getting players data");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getPlayers();
	}, []);

	return (
		<div className="items-center justify-center space-y-4 h-full p-12 w-full"></div>
	);
};

export default Players;
