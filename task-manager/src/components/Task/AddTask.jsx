import React, { useState, useEffect } from "react";
import ModalWrapper from "../ModalWrapper";
import { DialogTitle } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList";
import SelectList from "../SelectList";
import { BiImages } from "react-icons/bi";
import Button from "../Button";
import { useCreateTaskMutation, useUpdateTaskMutation } from "../../redux/slices/api/taskApiSlice";
import { toast } from "sonner";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORITY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({ open, setOpen, refetch, task }) => {
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  
  const isEditMode = !!task;
  const isLoading = isCreating || isUpdating;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  
  // Fixed: Remove undefined 'task' references
  const [team, setTeam] = useState([]);
  const [stage, setStage] = useState(LISTS[0]);
  const [priority, setPriority] = useState(PRIORITY[2]);
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Initialize form with task data when editing
  useEffect(() => {
    if (task && open) {
      console.log("=== EDITING TASK ===");
      console.log("Task data:", task);
      console.log("Task assets:", task.assets);
      setValue("title", task.title);
      setValue("date", task.date ? new Date(task.date).toISOString().split('T')[0] : "");
      setTeam(task.team || []);
      setStage(task.stage?.toUpperCase() || LISTS[0]);
      setPriority(task.priority?.toUpperCase() || PRIORITY[2]);
      setAssets(task.assets || []);
      console.log("Assets set to:", task.assets || []);
    } else if (!task && open) {
      console.log("=== CREATING NEW TASK ===");
      // Reset form for new task
      reset();
      setTeam([]);
      setStage(LISTS[0]);
      setPriority(PRIORITY[2]);
      setAssets([]);
    }
  }, [task, open, setValue, reset]);

  const submitHandler = async (data) => {
    try {
      // Convert File objects to a format the server can handle
      // Handle both File objects (new uploads) and existing asset objects (from database)
      const processedAssets = assets.map(file => {
        // If it's a File object (new upload), extract metadata
        if (file instanceof File) {
          return {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
          };
        }
        // If it's already an object from database, return as is
        return file;
      });

      const taskData = {
        title: data.title,
        team: team,
        stage: stage.toLowerCase(),
        date: data.date,
        priority: priority.toLowerCase(),
        assets: processedAssets, // Send processed file info instead of File objects
      };

      console.log(`${isEditMode ? 'Updating' : 'Creating'} task with data:`, taskData);

      let result;
      if (isEditMode) {
        result = await updateTask({ id: task._id, ...taskData });
      } else {
        result = await createTask(taskData);
      }

      // Check if result has data property
      if (result.data && result.data.status) {
        toast.success(`Task ${isEditMode ? 'updated' : 'created'} successfully!`);
        reset();
        setOpen(false);
        // Reset form state
        setTeam([]);
        setStage(LISTS[0]);
        setPriority(PRIORITY[2]);
        setAssets([]);
        // Refetch tasks list
        if (refetch) refetch();
      } else {
        toast.error(result.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} task`);
      }
    } catch (error) {
      console.log(`${isEditMode ? 'Update' : 'Create'} task error:`, error);
      // Handle different error response formats
      const errorMessage = error?.data?.message || error?.message || `Failed to ${isEditMode ? 'update' : 'create'} task`;
      toast.error(errorMessage);
    }
  };

  const handleSelect = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    setAssets(files);
  };

  if (!open) return null;

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
        <DialogTitle
          as="h2"
          className="text-xl font-bold leading-6 text-gray-900 text-center mb-6"
        >
          {isEditMode ? 'Edit Task' : 'Add New Task'}
        </DialogTitle>

        <div className="space-y-4">
          <Textbox
            placeholder="Task Title"
            type="text"
            name="title"
            label="Task Title"
            register={register("title", { required: "Title is required" })}
            error={errors.title ? errors.title.message : ""}
          />

          <UserList setTeam={setTeam} team={team} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectList
              label="Task Stage"
              lists={LISTS}
              selected={stage}
              setSelected={setStage}
            />

            <Textbox
              placeholder="Date"
              type="date"
              name="date"
              label="Task Date"
              register={register("date", {
                required: "Date is required!",
              })}
              error={errors.date ? errors.date.message : ""}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectList
              label="Priority Level"
              lists={PRIORITY}
              selected={priority}
              setSelected={setPriority}
            />

            <div className="flex items-center justify-center">
              <label
                className="flex items-center gap-2 text-base text-gray-600 hover:text-blue-600 cursor-pointer p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors"
                htmlFor="imgUpload"
              >
                <BiImages className="text-xl" />
                <span>Add Assets</span>
                <input
                  type="file"
                  className="hidden"
                  id="imgUpload"
                  onChange={handleSelect}
                  accept=".jpg, .png, .jpeg"
                  multiple={true}
                />
              </label>
            </div>
          </div>

          {/* Debug section - remove this later */}
          <div className="text-xs text-gray-400 border p-2 rounded bg-gray-50">
            <div className="font-medium">Debug Info:</div>
            <div>Assets count: {assets.length}</div>
            <div>Assets type: {Array.isArray(assets) ? 'Array' : typeof assets}</div>
            {assets.length > 0 && (
              <div>
                <div>First asset type: {typeof assets[0]}</div>
                <div>First asset name: {assets[0]?.name || 'No name'}</div>
                <div>First asset size: {assets[0]?.size || 'No size'}</div>
              </div>
            )}
          </div>

          {assets.length > 0 && (
            <div className="text-sm text-gray-600 border border-green-200 bg-green-50 p-2 rounded">
              <div className="font-medium mb-1 text-green-800">✅ Selected files ({assets.length}):</div>
              {assets.map((file, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-green-700">
                  <span className="text-blue-600">📎</span>
                  <span className="font-medium">{file.name}</span>
                  <span className="text-gray-500">
                    ({Math.round((file.size || 0) / 1024)} KB)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="button"
            className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-3 rounded-lg font-medium transition-colors"
            onClick={() => {
              reset();
              setOpen(false);
              setTeam([]);
              setStage(LISTS[0]);
              setPriority(PRIORITY[2]);
              setAssets([]);
            }}
            label="Cancel"
          />
          
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center px-4 py-3">
              <span className="text-sm bg-gradient-to-r from-purple-600 to-blue-700 bg-clip-text text-transparent">{isEditMode ? 'Updating task...' : 'Creating task...'}</span>
            </div>
          ) : (
            <Button
              label={isEditMode ? 'Update Task' : 'Create Task'}
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-700 text-white hover:from-purple-700 hover:to-blue-800 px-4 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
            />
          )}
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddTask;