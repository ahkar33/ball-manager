import { useEffect, useState } from "react";
import { IPlayer, ITeam } from "@/interfaces";
import { Button, Form, Input, Modal, Space, message } from "antd";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { addTeam, setInTeamUsers, updateTeam } from "@/store/team/teamSlice";

type CreateUpdateTeamModalProps = {
	open: boolean;
	onCancel: () => void;
	item: ITeam | null;
	isEdit: boolean;
	isTeamNameExists: (teamName: string) => ITeam | undefined;
	inTeamPlayers: IPlayer[];
};

const CreateUpdateTeamModal = ({
	open,
	onCancel,
	item: selectedItem,
	isEdit,
	isTeamNameExists,
	inTeamPlayers,
}: CreateUpdateTeamModalProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	const [playerList, setPlayerList] = useState<IPlayer[]>([]);
	const [item, setItem] = useState<ITeam | null>(null);

	const handleCancel = () => {
		onCancel();
		setPlayerList([]);
		setItem(null);
	};

	useEffect(() => {
		if (selectedItem) {
			setPlayerList(selectedItem?.players);
			setItem(selectedItem);
		}
	}, [selectedItem]);

	const onFinish = ({ name, region, country }: ITeam) => {
		try {
			setIsLoading(true);
			if (!isEdit) {
				if (isTeamNameExists(name)) {
					message.error("Name already exists");
					return;
				}
				const reqData: ITeam = {
					id: uuidv4(),
					name,
					region,
					country,
					player_count: 0,
					players: [],
				};
				dispatch(addTeam(reqData));
			} else {
				if (!item) return;
				const searchTeam = isTeamNameExists(name);
				if (!searchTeam) {
					const reqData = { ...item, name, region, country };
					dispatch(updateTeam(reqData));
				} else if (searchTeam && searchTeam.id === item.id) {
					const reqData = { ...item, name, region, country };
					dispatch(updateTeam(reqData));
				} else {
					message.error("Name already exists");
					return;
				}
			}
			message.success("success");
			handleCancel();
		} catch (error) {
			message.error("Creating Team Failed");
		} finally {
			setIsLoading(false);
		}
	};

	const handleRemovePlayer = (player: IPlayer) => {
		if (!item) return;
		const updatedPlayers = playerList.filter(
			(_player) => _player.id !== player.id
		);
		const reqData = {
			...item,
			players: updatedPlayers,
			player_count: updatedPlayers.length,
		};
		setItem(reqData);
		setPlayerList(updatedPlayers);
		const updatedInTeamPlayers = inTeamPlayers.filter(
			(user) => user.id !== player.id
		);
		dispatch(updateTeam(reqData));
		dispatch(setInTeamUsers(updatedInTeamPlayers));
		message.success("Success");
	};

	return (
		<Modal
			centered
			destroyOnClose
			open={open}
			closable={false}
			footer={false}
			title={isEdit ? "Update Team" : "Create New Team"}
			onCancel={handleCancel}
			maskClosable={false}
		>
			<Form
				layout="vertical"
				requiredMark={false}
				initialValues={{
					...item,
				}}
				onFinish={onFinish}
			>
				<Form.Item
					name="name"
					label="Name"
					rules={[
						{
							required: true,
							message: "Name is required",
						},
					]}
				>
					<Input size="large" type="text" />
				</Form.Item>

				<Form.Item
					name="region"
					label="Region"
					rules={[
						{
							required: true,
							message: "Region is required",
						},
					]}
				>
					<Input size="large" type="text" />
				</Form.Item>

				<Form.Item
					name="country"
					label="Country"
					rules={[
						{
							required: true,
							message: "Country is required",
						},
					]}
				>
					<Input size="large" type="text" />
				</Form.Item>

				{playerList.length > 0 && (
					<div className="mt-4">
						<h3 className="text-lg font-semibold mb-2">Player List</h3>
						{playerList.map((player, index) => (
							<div
								key={player.id}
								className="flex items-center justify-between mb-2"
							>
								<p className="mr-2">{index + 1}. {player.first_name}</p>
								<Button
									type="primary"
									onClick={() => handleRemovePlayer(player)}
									className="bg-red-500 hover:!bg-red-400 hover:text-gray-100"
								>
									Remove
								</Button>
							</div>
						))}
					</div>
				)}

				<Form.Item className="mt-10">
					<Space size={"middle"}>
						<Button type="default" onClick={handleCancel}>
							Cancel
						</Button>
						<Button type="primary" htmlType="submit" loading={isLoading}>
							{isEdit ? "Update" : "Create"}
						</Button>
					</Space>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default CreateUpdateTeamModal;
