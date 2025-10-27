import clsx from "clsx";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import AddUser from "../components/AddUser";
import Button from "../components/Button";
import ConfirmatioDialog, { UserAction } from "../components/Dialogs";
import Title from "../components/Title";
import Loading from "../components/Loader";
import { useDeleteUserMutation, useGetTeamListQuery, useUserActionMutation } from "../redux/slices/api/userApiSlice";
import { getInitials } from "../utils";

const Users = () => {
  const { user } = useSelector((state) => state.auth);
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);

  const { data, isLoading, error, refetch } = useGetTeamListQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [userAction] = useUserActionMutation();

  const userActionHandler = async () => {
    try {
      const result = await userAction({
        isActive: !selected?.isActive,
        id: selected?._id,
      });

      refetch();
      toast.success(result.data.message);
      setSelected(null);
      setTimeout(() => {
        setOpenAction(false);
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.error);
    }
  };

  const deleteHandler = async () => {
    try {
      const result = await deleteUser(selected);

      refetch();
      toast.success("Deleted successfully");
      setSelected(null);
      setTimeout(() => {
        setOpenDialog(false);
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.error);
    }
  };

  const deleteClicks = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const userStatusClick = (id) => {
    setSelected(id);
    setOpenAction(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 text-lg">Error loading team members</p>
          <p className="text-gray-600">{error?.data?.message || error.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <div className='w-full flex justify-between items-center'>
        <Title title='Team Members' />
        {/* Only show Add User button for admins */}
        {user?.isAdmin && (
          <Button
            icon={<IoMdAdd />}
            label='Add User'
            className='flex flex-row-reverse gap-1 items-center bg-gradient-to-r from-purple-600 to-blue-700 text-white px-4 py-2 rounded-md hover:from-purple-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-300'
            onClick={() => setOpen(true)}
          />
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
        {data?.map((member, index) => (
          <div key={index} className='bg-white p-4 rounded-lg shadow-md border border-gray-200'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center'>
                <span className='text-white font-semibold text-lg'>
                  {getInitials(member.name)}
                </span>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900'>{member.name}</h3>
                <p className='text-sm text-gray-600'>{member.email}</p>
                <p className='text-xs text-gray-500'>{member.title || member.role}</p>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div
                  className={clsx(
                    "w-2 h-2 rounded-full",
                    member.isActive ? "bg-green-500" : "bg-red-500"
                  )}
                />
                <span className='text-sm text-gray-600'>
                  {member.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Only show action buttons for admins */}
              {user?.isAdmin && (
                <div className='flex gap-2'>
                  <Button
                    label={member.isActive ? "Disable" : "Enable"}
                    className='text-xs px-2 py-1'
                    onClick={() => userStatusClick(member)}
                  />
                  <Button
                    label='Delete'
                    className='text-xs px-2 py-1 bg-red-600 text-white hover:bg-red-700'
                    onClick={() => deleteClicks(member)}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <AddUser open={open} setOpen={setOpen} refetch={refetch} />
      
      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={userActionHandler}
      />
    </div>
  );
};

export default Users;