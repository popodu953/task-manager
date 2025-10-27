import { useState } from "react";
import { FaList } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import BoardView from "../components/BoardView";
import Button from "../components/Button";
import Loading from "../components/Loader";
import Tabs from "../components/Tabs";
import Table from "../components/task/Table";
import TaskTitle from "../components/TaskTitle";
import Title from "../components/Title";
import AddTask from "../components/task/AddTask";
import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const Tasks = () => {
  const params = useParams();

  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  
  const status = params?.status || "";

  const {data, isLoading, error, refetch} = useGetAllTaskQuery({
    strQuery: status || "all",
    isTrashed: false,
    search: "",
  });

  console.log("=== TASKS DEBUG ===");
  console.log("isLoading:", isLoading);
  console.log("error:", error);
  console.log("data:", data);
  console.log("status:", status);
  console.log("==================");

  if (isLoading) {
    return (
      <div className='py-10'>
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <h3>Error Loading Tasks:</h3>
        <p>{error?.data?.message || error?.message || "Unknown error"}</p>
        <button 
          onClick={() => refetch()} 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
        <h3>No Data Received</h3>
        <p>Check your API connection and authentication.</p>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-4'>
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        {!status && (
          <Button
            onClick={() => setOpen(true)}
            label='Create Task'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5'
          />
        )}
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {!status && (
          <div className='w-full flex justify-between gap-4 md:gap-x-12 py-4'>
            <TaskTitle label='To Do' className={TASK_TYPE.todo} />
            <TaskTitle
              label='In Progress'
              className={TASK_TYPE["in progress"]}
            />
            <TaskTitle label='completed' className={TASK_TYPE.completed} />
          </div>
        )}

        {selected !== 1 ? (
          <BoardView tasks={data?.tasks || []} refetch={refetch} />
        ) : (
          <div className='w-full'>
            <Table tasks={data?.tasks || []} refetch={refetch} />
          </div>
        )}
      </Tabs>

      <AddTask open={open} setOpen={setOpen} refetch={refetch} />
    </div>
  );
};

export default Tasks;