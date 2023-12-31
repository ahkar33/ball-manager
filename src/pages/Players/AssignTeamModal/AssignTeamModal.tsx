import { useEffect, useState } from "react";
import { IPlayer } from "@/interfaces";
import { Button, Form, Modal, Select, Space, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
	TeamsState,
	addInTeamUser,
	setTeams,
	updateTeam,
} from "@/store/team/teamSlice";

type AssignTeamModalPropsType = {
	open: boolean;
	onCancel: () => void;
	item: IPlayer | null;
};

const AssignTeamModal = ({
	open,
	onCancel,
	item,
}: AssignTeamModalPropsType) => {
	const teams = useSelector(
		(state: { teams: TeamsState }) => state.teams.teams
	);
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		try {
			setIsLoading(true);
			const storeTeams = localStorage.getItem("teams");
			if (storeTeams !== null) {
				dispatch(setTeams(JSON.parse(storeTeams)));
			}
		} catch (error) {
			message.error("Something went wrong when getting teams data");
		} finally {
			setIsLoading(false);
		}
	}, []);

	const onFinish = (data: { team: string }) => {
		try {
			setIsLoading(true);
			let selectedTeam = teams.find((team) => team.id === data.team);
			if (!item || !selectedTeam) return;
			selectedTeam = {
				...selectedTeam,
				players: [...selectedTeam.players, item],
			};
			selectedTeam = {
				...selectedTeam,
				player_count: selectedTeam.players.length,
			};
			dispatch(updateTeam(selectedTeam));
			dispatch(addInTeamUser(item));
			message.success("Success");
			onCancel();
		} catch (error) {
			message.error("Assigning Team Failed");
		} finally {
			setIsLoading(false);
		}
	};

	const teamOptions = teams.map((team) => ({
		label: team.name,
		value: team.id,
	}));

	return (
		<Modal
			centered
			destroyOnClose
			open={open}
			closable={false}
			footer={false}
			title={"Choose Team"}
			onCancel={onCancel}
			maskClosable={false}
		>
			<Form layout="vertical" requiredMark={false} onFinish={onFinish}>
				<Form.Item
					name="team"
					label="Team"
					rules={[
						{
							required: true,
							message: "",
						},
					]}
				>
					<Select
						size="large"
						showSearch
						optionFilterProp="children"
						filterOption={(input, option) =>
							(option?.label?.toLowerCase() ?? "").includes(
								input?.toLowerCase()
							)
						}
						options={teamOptions}
					/>
				</Form.Item>

				<Form.Item className="mt-10">
					<Space size={"middle"}>
						<Button type="default" onClick={onCancel}>
							Cancel
						</Button>
						<Button type="primary" htmlType="submit" loading={isLoading}>
							Assign
						</Button>
					</Space>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default AssignTeamModal;
