import { AlignType } from "rc-table/lib/interface";
import Table, { ColumnType } from "antd/es/table";
import { useEffect, useState } from "react";
import CreateUpdateTeamModal from "./CreateUpdateTeamModal/CreateUpdateTeamModal";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ITeam } from "@/interfaces";
import { ConfirmModal } from "@/components";
import { TeamsState, setInTeamUsers, setTeams } from "@/store/team/teamSlice";
import { useDispatch, useSelector } from "react-redux";
import TeamDetailsModal from "./TeamDetailsModal/TeamDetailsModal";

const Teams = () => {
	const teams = useSelector(
		(state: { teams: TeamsState }) => state.teams.teams
	);
	const inTeamPlayers = useSelector(
		(state: { teams: TeamsState }) => state.teams.inTeamPlayers
	);

	const dispatch = useDispatch();
	const [isOpen, setIsOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [selectedTeam, setSelectedTeam] = useState<ITeam | null>(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);

	useEffect(() => {
		try {
			setIsLoading(true);
			const storeTeams = localStorage.getItem("teams");
			if (storeTeams) {
				dispatch(setTeams(JSON.parse(storeTeams)));
			}
			const storeInTeamUsers = localStorage.getItem("inTeamPlayers");
			if (storeInTeamUsers) {
				dispatch(setInTeamUsers(JSON.parse(storeInTeamUsers)));
			}
		} catch (error) {
			message.error("Something went wrong when getting teams data");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("teams", JSON.stringify([...teams]));
	}, [teams]);

	const closeCreateUpdateModal = () => {
		setIsOpen(false);
		setIsEdit(false);
		setSelectedTeam(null);
	};

	const isTeamNameExists = (teamName: string) => {
		return teams.find((team) => team.name === teamName);
	};

	const deleteTeam = (): void => {
		const newTeams = teams.filter((team) => team.id !== selectedTeam?.id);
		dispatch(setTeams(newTeams));
		const updatedInTeamPlayers = inTeamPlayers.filter((user) => {
			return !selectedTeam?.players.find((player) => player.id === user.id);
		});
		dispatch(setInTeamUsers(updatedInTeamPlayers));
		message.success("success");
		closeDeleteModal();
	};

	const openDeleteModal = (record: ITeam) => {
		setSelectedTeam(record);
		setIsDeleteModalOpen(true);
	};

	const closeDeleteModal = () => {
		setSelectedTeam(null);
		setIsDeleteModalOpen(false);
	};

	const handleClickEdit = (record: ITeam) => {
		setIsOpen(true);
		setIsEdit(true);
		setSelectedTeam(record);
	};

	const handleClickDetails = (record: ITeam) => {
		setIsDetailsOpen(true);
		setSelectedTeam(record);
	};

	const closeDetailsModal = () => {
		setSelectedTeam(null);
		setIsDetailsOpen(false);
	};

	const columns: ColumnType<ITeam>[] = [
		{
			title: "No.",
			key: "no",
			align: "center" as AlignType,
			width: 100,
			render: (_, __, index: number) => <>{index + 1}</>,
		},
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			align: "center" as AlignType,
		},
		{
			title: "Play Count",
			dataIndex: "player_count",
			key: "play_count",
			align: "center" as AlignType,
			width: 230,
		},
		{
			title: "Region",
			dataIndex: "region",
			key: "region",
			align: "center" as AlignType,
		},
		{
			title: "Country",
			dataIndex: "country",
			key: "country",
			align: "center" as AlignType,
		},
		{
			title: "Action",
			key: "action",
			align: "center" as AlignType,
			render: (_, record: ITeam) => (
				<div className="flex gap-3 justify-center">
					<Button
						type="primary"
						className="bg-red-500 hover:!bg-red-400 hover:text-gray-100"
						onClick={() => openDeleteModal(record)}
					>
						Delete
					</Button>
					<Button
						type="primary"
						className="bg-green-500 hover:!bg-green-400 hover:text-gray-100"
						onClick={() => handleClickEdit(record)}
					>
						Edit
					</Button>
					<Button
						type="primary"
						className="bg-yellow-500 hover:!bg-yellow-400 hover:text-gray-100"
						onClick={() => handleClickDetails(record)}
					>
						Details
					</Button>
				</div>
			),
		},
	];

	const renderTop = () => (
		<Button
			type="primary"
			icon={<PlusOutlined />}
			onClick={() => setIsOpen(true)}
		>
			Create New
		</Button>
	);

	return (
		<div className="items-center justify-center space-y-4 h-full p-12 w-full mt-10">
			{renderTop()}
			<Table
				dataSource={teams}
				columns={columns}
				loading={isLoading}
				bordered
				size="small"
				pagination={false}
				rowKey="id"
			/>
			<CreateUpdateTeamModal
				item={selectedTeam}
				open={isOpen}
				onCancel={closeCreateUpdateModal}
				isEdit={isEdit}
				isTeamNameExists={isTeamNameExists}
				inTeamPlayers={inTeamPlayers}
			/>
			<ConfirmModal
				open={isDeleteModalOpen}
				onClose={closeDeleteModal}
				onOk={deleteTeam}
				confirmMessage={"Are you sure you want to delete?"}
			/>
			<TeamDetailsModal
				open={isDetailsOpen}
				handleCancel={closeDetailsModal}
				team={selectedTeam}
			/>
		</div>
	);
};

export default Teams;
