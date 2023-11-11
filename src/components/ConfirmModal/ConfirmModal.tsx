import { Modal, Button } from "antd";

interface ConfirmModalPropsType {
	confirmMessage: string;
	onOk: () => void;
	open: boolean;
	onClose: () => void;
	isLoading?: boolean;
}

const ConfirmModal = ({
	confirmMessage,
	onOk,
	open,
	onClose,
	isLoading,
}: ConfirmModalPropsType) => {
	return (
		<Modal
			width={300}
			open={open}
			onOk={onOk}
			onCancel={onClose}
			okText="Yes"
			cancelText="Cancel"
			closable={false}
			maskClosable={false}
			footer={[
				<Button key="back" onClick={onClose}>
					Cancel
				</Button>,
				<Button
					key="submit"
					type="primary"
					danger
					loading={isLoading}
					onClick={onOk}
				>
					Yes
				</Button>,
			]}
		>
			<p>{confirmMessage}</p>
		</Modal>
	);
};

export default ConfirmModal;
