import { apiSlice } from "../apiSlice";

const TASKS_URL = "/task";

export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashbordStats: builder.query({
      query: () => ({
        url: `${TASKS_URL}/dashboard`,
        method: "GET",
        credentials: "include",
      }),
    }),
    
    createTask: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/create`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    getAllTask: builder.query({
      query: ({ strQuery, isTrashed, search }) => {
        const params = new URLSearchParams();
        if (strQuery && strQuery !== "all") params.append("stage", strQuery);
        if (isTrashed !== undefined) params.append("isTrashed", isTrashed);
        if (search) params.append("search", search);
        
        return {
          url: `${TASKS_URL}?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
    }),

    duplicateTask: builder.mutation({
      query: (id) => ({
        url: `${TASKS_URL}/duplicate/${id}`,
        method: "POST",
        body: {},
        credentials: "include",
      }),
    }),

    updateTask: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/update/${data.id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    trashTask: builder.mutation({
      query: ({ id }) => ({
        url: `${TASKS_URL}/${id}`,
        method: "PUT",
        credentials: "include",
      }),
    }),

    createSubTask: builder.mutation({
      query: ({ data, id }) => ({
        url: `${TASKS_URL}/create-subtask/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    getSingleTask: builder.query({
      query: (id) => ({
        url: `${TASKS_URL}/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    postTaskActivity: builder.mutation({
      query: ({data, id}) => ({
        url: `${TASKS_URL}/activity/${id}`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    deleteRestoreTask: builder.mutation({
      query: ({id, actionType}) => ({
        url: `${TASKS_URL}/delete-restore/${id}?actionType=${actionType}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const { 
  useGetDashbordStatsQuery,
  useCreateTaskMutation, 
  useGetAllTaskQuery, 
  useDuplicateTaskMutation, 
  useUpdateTaskMutation, 
  useCreateSubTaskMutation, 
  useTrashTaskMutation,
  useGetSingleTaskQuery,
  usePostTaskActivityMutation,
  useDeleteRestoreTaskMutation,
} = taskApiSlice;