import { AlignType } from "rc-table/lib/interface";
import Table, { ColumnType } from "antd/es/table";
import { useEffect, useState } from "react";
import CreateUpdateTeamModal from "./CreateUpdateTeamModal/CreateUpdateTeamModal";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ITeam } from "@/interfaces";
import { ConfirmModal } from "@/components";
import { TeamsState, setTeams } from "@/store/team/teamSlice";
import { useDispatch, useSelector } from "react-redux";

const Teams = () => {
	const teams = useSelector(
		(state: { teams: TeamsState }) => state.teams.teams
	);
	const dispatch = useDispatch();
	const [isOpen, setIsOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [selectedTeam, setSelectedTeam] = useState<ITeam | null>(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		try {
			setIsLoading(true);
			const storeTeams = localStorage.getItem("teams");
			if (storeTeams !== null) {
				dispatch(setTeams(JSON.parse(storeTeams)));
			}
		} catch (error) {
			message.error("Something went wrong when getting team data");
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

	const isTeamNameExists = (teamName: string): boolean => {
		return !!teams.find((team) => team.name === teamName);
	};

	const deleteTeam = (): void => {
		const newTeams = teams.filter((team) => team.id !== selectedTeam?.id);
		dispatch(setTeams(newTeams));
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
				<div>
					<Button
						type="primary"
						className="bg-red-500 hover:!bg-red-400 hover:text-gray-100"
						onClick={() => openDeleteModal(record)}
					>
						Delete
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
		<div className="items-center justify-center space-y-4 h-full p-12 w-full">
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
			/>
			<ConfirmModal
				open={isDeleteModalOpen}
				onClose={closeDeleteModal}
				onOk={deleteTeam}
				confirmMessage={"Are you sure you want to delete?"}
			/>
		</div>
	);
};

export default Teams;
