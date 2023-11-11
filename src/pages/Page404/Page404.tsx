import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const Page404: React.FC = () => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(`/teams`);
		location.reload();
	};

	return (
		<Result
			className="mt-10"
			status="404"
			title="404"
			subTitle="PAGE NOT FOUND"
			extra={
				<Button onClick={handleClick} type="primary">
					Back Home
				</Button>
			}
		/>
	);
};

export default Page404;
