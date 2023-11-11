import { ITeam } from "@/interfaces";
import { Descriptions, Modal } from "antd";

type TeamDetailsPropsType = {
	open: boolean;
	handleCancel: () => void;
	team: ITeam | null;
};

const TeamDetailsModal = ({
	open,
	handleCancel,
	team,
}: TeamDetailsPropsType) => {
	return (
		<Modal
			centered
			destroyOnClose
			open={open}
			maskClosable={false}
			footer={false}
			title={"Team Details"}
			onCancel={handleCancel}
		>
			<Descriptions bordered column={1}>
				<Descriptions.Item label="Name">{team?.name}</Descriptions.Item>
				<Descriptions.Item label="Region">{team?.region}</Descriptions.Item>
				<Descriptions.Item label="Player Count">
					{team?.player_count}
				</Descriptions.Item>
				<Descriptions.Item label="Country">{team?.country}</Descriptions.Item>
				<Descriptions.Item label="Player List">
					{team && team?.players.length > 0 ? (
						<>
							{team?.players.map((palyer, index) => (
								<div key={palyer.id} className="flex gap-2 w-36 mx-auto">
									<p>{index + 1}.</p>
									<p>
										{palyer.first_name} {palyer.last_name}
									</p>
								</div>
							))}
						</>
					) : (
						<p>There is no player yet</p>
					)}
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default TeamDetailsModal;
