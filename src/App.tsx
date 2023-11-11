import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Login, Page404, Players, Teams } from "@/pages";
import { Navbar } from "@/components";
import { useSelector } from "react-redux";
import { AuthType } from "./store/auth/authSlice";

const PrivateRoute = () => {
	const username = useSelector(
		(state: { auth: AuthType }) => state.auth.username
	);
	return username ? <Outlet /> : <Navigate to="/" />;
};

function App() {
	const username = useSelector(
		(state: { auth: AuthType }) => state.auth.username
	);
	const renderNavbar = () => {
		if (username) {
			return <Navbar />;
		}
		return null;
	};

	return (
		<>
			{renderNavbar()}
			<Routes>
				<Route path="/" element={<Login />} />
				<Route element={<PrivateRoute />}>
					<Route path="/teams" element={<Teams />} />
					<Route path="/players" element={<Players />} />
					<Route path="*" element={<Page404 />} />
				</Route>
			</Routes>
		</>
	);
}

export default App;
