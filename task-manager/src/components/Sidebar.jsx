import clsx from "clsx";
import React from "react";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../redux/slices/authSlice";

// Import your logo - you'll need to add the actual image file
// import revoltMediaLogo from "../assets/revolt-media-logo.png";

const linkData = [
  {
    label: "Dashboard",
    link: "dashboard",
    icon: <MdDashboard />,
  },
  {
    label: "Tasks",
    link: "tasks",
    icon: <FaTasks />,
  },
  {
    label: "Completed",
    link: "completed/completed",
    icon: <MdTaskAlt />,
  },
  {
    label: "In Progress",
    link: "in-progress/in progress",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "To Do",
    link: "todo/todo",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "Team",
    link: "team",
    icon: <FaUsers />,
  },
  {
    label: "Trash",
    link: "trashed",
    icon: <FaTrashAlt />,
  },
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const location = useLocation();

  const path = location.pathname.split("/")[1];

  // Filter links based on admin status
const sidebarLinks = linkData.filter(link => {
  // Show Trash only for admin users
  if (link.label === "Trash") {
    return user?.isAdmin === true;
  }
  // Show Team for all authenticated users (read-only for non-admins)
  // Show all other links for everyone
  return true;
});

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  const NavLink = ({ el }) => {
    return (
      <Link
        to={el.link}
        onClick={closeSidebar}
        className={clsx(
          "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 text-base hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 transition-all duration-300",
          path === el.link.split("/")[0] ? "bg-gradient-to-r from-purple-600 to-blue-700 text-white shadow-lg" : ""
        )}
      >
        {el.icon}
        <span className='hover:text-purple-600 transition-colors duration-200'>{el.label}</span>
      </Link>
    );
  };

  return (
    <div className='w-full  h-full flex flex-col gap-6 p-5'>
      <h1 className='flex gap-3 items-center'>
        {/* Temporary placeholder - replace with your logo image */}
        <div className='bg-gradient-to-r from-purple-600 to-blue-700 p-3 rounded-full shadow-lg'>
          <span className='text-white text-lg font-bold'>R</span>
        </div>
        <div className='flex flex-col'>
          <span className='text-xl font-bold text-gray-800'>Revolt.</span>
          <span className='text-sm font-medium text-gray-600 tracking-wider'>MEDIA</span>
        </div>
      </h1>

      <div className='flex-1 flex flex-col gap-y-5 py-8'>
        {sidebarLinks.map((link) => (
          <NavLink el={link} key={link.label} />
        ))}
      </div>

      <div className=''>
        <button className='w-full flex gap-2 p-2 items-center text-lg text-gray-800'>
          <MdSettings />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;