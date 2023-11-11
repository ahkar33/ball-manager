import { AlignType } from "rc-table/lib/interface";
import Table, { ColumnType } from "antd/es/table";
import { useEffect, useState } from "react";
import CreateUpdateTeamModal from "./CreateUpdateTeamModal/CreateUpdateTeamModal";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ITeam } from "@/interfaces";

const Teams = () => {
	const [teams, setTeams] = useState<ITeam[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [selectedTeam, setSelectedTeam] = useState<ITeam | null>(null);

	useEffect(() => {
		const storeTeams = localStorage.getItem("teams");
		if (storeTeams !== null) {
			setTeams(JSON.parse(storeTeams));
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

	const columns: ColumnType<ITeam>[] = [
		{
			title: "No.",
			key: "no",
			align: "center" as AlignType,
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
		// {
		// 	title: "Action",
		// 	key: "action",
		// 	align: "center" as AlignType,
		// 	render: (_, record: IContactUserRes) => (
		// 		<Actions>
		// 			<DetailsButton onClick={() => openDetailsModal(record)}>
		// 				Details
		// 			</DetailsButton>
		// 			<DeleteButton onClick={() => openConfirmModal(record)}>
		// 				Delete
		// 			</DeleteButton>
		// 		</Actions>
		// 	),
		// },
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
				// loading={isLoading}
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
				setTeams={setTeams}
				isTeamNameExists={isTeamNameExists}
			/>
		</div>
	);
};

export default Teams;
