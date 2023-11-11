import { useState } from "react";
import { ITeam } from "@/interfaces";
import { Button, Form, Input, Modal, Space, message } from "antd";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { addTeam } from "@/store/team/teamSlice";

type CreateUpdateTeamModalProps = {
	open: boolean;
	onCancel: () => void;
	item: ITeam | null;
	isEdit: boolean;
	isTeamNameExists: (teamName: string) => boolean;
};

const CreateUpdateTeamModal = ({
	open,
	onCancel,
	item,
	isEdit,
	isTeamNameExists,
}: CreateUpdateTeamModalProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();

	const onFinish = ({ name, region, country }: ITeam) => {
		try {
			setIsLoading(true);
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
			onCancel();
		} catch (error) {
			message.error("Creating Team Failed");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal
			centered
			destroyOnClose
			open={open}
			closable={false}
			footer={false}
			title={isEdit ? "Update Team" : "Create New Team"}
			onCancel={onCancel}
			maskClosable={false}
		>
			<Form
				layout="vertical"
				requiredMark={false}
				initialValues={
					{
						// ...item,
					}
				}
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

				<Form.Item className="mt-10">
					<Space size={"middle"}>
						<Button type="default" onClick={onCancel}>
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
