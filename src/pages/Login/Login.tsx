import { AuthType, saveUserInfo } from "@/store/auth/authSlice";
import { Button, Form, Input, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {  Navigate, useNavigate } from "react-router-dom";

const Login = () => {
	const username = useSelector(
		(state: { auth: AuthType }) => state.auth.username
	);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	if (username) {
		return <Navigate to={`/teams`} />;
	}

	const onFinish = (values: { username: string }) => {
		dispatch(saveUserInfo({ username: values.username }));
		navigate("/teams");
		message.success("Successfully Login");
	};

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gray-100">
			<h2 className="text-3xl font-semibold mb-3">Login</h2>
			<Form
				name="login-form"
				initialValues={{ remember: true }}
				onFinish={onFinish}
				className="bg-white p-8 rounded shadow-md"
			>
				<Form.Item
					name="username"
					rules={[{ required: true, message: "Username is required!" }]}
				>
					<Input placeholder="Username" className="mb-4" />
				</Form.Item>

				<Form.Item>
					<Button type="primary" htmlType="submit" className="w-full">
						Login
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default Login;
