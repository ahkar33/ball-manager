import { AuthType, clearUserInfo } from "@/store/auth/authSlice";
import { Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  PoweroffOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { ConfirmModal } from "@/components";

const Navbar = () => {
  const username = useSelector(
    (state: { auth: AuthType }) => state.auth.username
  );
  const dispatch = useDispatch();
  const location = useLocation();
  const [selectedLink, setSelectedLink] = useState(location.pathname);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setSelectedLink(location.pathname);
  }, [location.pathname]);

  const logout = () => {
    dispatch(clearUserInfo());
    	message.success("Successfully Logout");
  };

  return (
    <div className="bg-gray-800 p-4 flex justify-between items-center fixed top-0 w-full z-10">
      <div className="flex space-x-4">
        <Link
          to="/teams"
          className={`no-underline ${
            selectedLink === "/teams" ? "text-blue-300" : "text-white"
          }`}
        >
          <TeamOutlined /> Teams
        </Link>
        <Link
          to="/players"
          className={`no-underline ${
            selectedLink === "/players" ? "text-blue-300" : "text-white"
          }`}
        >
          <UsergroupAddOutlined /> Players
        </Link>
      </div>
      <div className="flex items-center">
        {username && <h4 className="text-white mr-2">{username}</h4>}
        <Button
          type="primary"
          danger
          icon={<PoweroffOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Logout
        </Button>
      </div>
      <ConfirmModal
        onOk={logout}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        confirmMessage={"Are you sure you want to logout?"}
      />
    </div>
  );
};

export default Navbar;
