import Notice from "../models/notification.js";
import Task from "../models/task.js";
import User from "../models/user.js";

export const createTask = async (req, res) => {
  try {
    // Handle case where user might not be logged in (for development)
    const userId = req.user?.userId || "000000000000000000000000"; // Default ObjectId

    const { title, team, stage, date, priority, assets } = req.body;

    // Validate required fields
    if (!title || !stage || !date || !priority) {
      return res.status(400).json({ 
        status: false, 
        message: "Missing required fields: title, stage, date, priority" 
      });
    }

    // Process assets to ensure they're in the correct format
    let processedAssets = [];
    if (assets && Array.isArray(assets)) {
      processedAssets = assets.map(asset => {
        // If asset is a string (old format), convert to object
        if (typeof asset === 'string') {
          return {
            name: asset,
            size: 0,
            type: 'application/octet-stream',
            lastModified: Date.now()
          };
        }
        // If asset is an object but missing properties, fill defaults
        if (typeof asset === 'object' && asset !== null) {
          return {
            name: asset.name || 'Unknown file',
            size: asset.size || 0,
            type: asset.type || 'application/octet-stream',
            lastModified: asset.lastModified || Date.now()
          };
        }
        // Fallback for any other case
        return {
          name: 'Unknown file',
          size: 0,
          type: 'application/octet-stream',
          lastModified: Date.now()
        };
      });
    }

    let text = "New task has been assigned to you";
    if (team?.length > 1) {
      text = text + ` and ${team?.length - 1} others.`;
    }

    text =
      text +
      ` The task priority is set a ${priority} priority, so check and act accordingly. The task date is ${new Date(
        date
      ).toDateString()}. Thank you!!!`;

    const activity = {
      type: "assigned",
      activity: text,
      by: userId,
    };

    const task = await Task.create({
      title,
      team: team || [],
      stage: stage.toLowerCase(),
      date,
      priority: priority.toLowerCase(),
      assets: processedAssets,
      activities: activity,
    });

    // Only create notification if user is logged in
    if (req.user?.userId) {
      await Notice.create({
        team: team || [],
        text,
        task: task._id,
      });
    }

    res
      .status(200)
      .json({ status: true, task, message: "Task created successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const duplicateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    const newTask = await Task.create({
      ...task,
      title: task.title + " - Duplicate",
    });

    newTask.team = task.team;
    newTask.subTasks = task.subTasks;
    newTask.assets = task.assets;
    newTask.priority = task.priority;
    newTask.stage = task.stage;

    await newTask.save();

    //alert users of the task
    let text = "New task has been assigned to you";
    if (task.team.length > 1) {
      text = text + ` and ${task.team.length - 1} others.`;
    }

    text =
      text +
      ` The task priority is set a ${
        task.priority
      } priority, so check and act accordingly. The task date is ${task.date.toDateString()}. Thank you!!!`;

    await Notice.create({
      team: task.team,
      text,
      task: newTask._id,
    });

    res
      .status(200)
      .json({ status: true, message: "Task duplicated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const postTaskActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { type, activity } = req.body;

    const task = await Task.findById(id);

    const data = {
      type,
      activity,
      by: userId,
    };

    task.activities.push(data);

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Activity posted successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const dashboardStatistics = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;

    const allTasks = isAdmin
      ? await Task.find({
          isTrashed: false,
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 })
      : await Task.find({
          isTrashed: false,
          team: { $all: [userId] },
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 });

    const users = await User.find({ isActive: true })
      .select("name title role isAdmin createdAt")
      .limit(10)
      .sort({ _id: -1 });

    //   group task by stage and calculate counts
    const groupTaskks = allTasks.reduce((result, task) => {
      const stage = task.stage;

      if (!result[stage]) {
        result[stage] = 1;
      } else {
        result[stage] += 1;
      }

      return result;
    }, {});

    // Group tasks by priority
    const groupData = Object.entries(
      allTasks.reduce((result, task) => {
        const { priority } = task;

        result[priority] = (result[priority] || 0) + 1;
        return result;
      }, {})
    ).map(([name, total]) => ({ name, total }));

    // calculate total tasks
    const totalTasks = allTasks?.length;
    const last10Task = allTasks?.slice(0, 10);

    const summary = {
      totalTasks,
      last10Task,
      users: isAdmin ? users : [],
      tasks: groupTaskks,
      graphData: groupData,
    };

    res.status(200).json({
      status: true,
      message: "Successfully",
      ...summary,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { stage, isTrashed } = req.query;

    // For development: show non-trashed tasks by default, but allow showing trashed tasks if requested
    let query = { isTrashed: false }; // Show only non-trashed tasks by default
    
    // If isTrashed parameter is explicitly set to true, show trashed tasks
    if (isTrashed === 'true') {
      query = { isTrashed: true };
    }
    
    // If isTrashed parameter is explicitly set to 'all', show all tasks
    if (isTrashed === 'all') {
      query = {}; // Show all tasks regardless of trash status
    }

    if (stage) {
      query.stage = stage;
    }

    console.log("=== GET TASKS DEBUG ===");
    console.log("Query params:", { stage, isTrashed });
    console.log("Final query:", query);

    let queryResult = Task.find(query)
      .populate({
        path: "team",
        select: "name title email",
      })
      .sort({ _id: -1 });

    const tasks = await queryResult;

    // Process assets for each task to ensure consistent format
    const processedTasks = tasks.map(task => {
      if (task.assets && Array.isArray(task.assets)) {
        task.assets = task.assets.map(asset => {
          // If asset is a string (old format), convert to object
          if (typeof asset === 'string') {
            return {
              name: asset,
              size: 0,
              type: 'application/octet-stream',
              lastModified: Date.now()
            };
          }
          // If asset is an object but missing properties, fill defaults
          if (typeof asset === 'object' && asset !== null) {
            return {
              name: asset.name || 'Unknown file',
              size: asset.size || 0,
              type: asset.type || 'application/octet-stream',
              lastModified: asset.lastModified || Date.now()
            };
          }
          // Fallback for any other case
          return {
            name: 'Unknown file',
            size: 0,
            type: 'application/octet-stream',
            lastModified: Date.now()
          };
        });
      }
      return task;
    });

    console.log("Tasks found:", tasks.length);
    console.log("======================");

    res.status(200).json({
      status: true,
      tasks: processedTasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate({
        path: "team",
        select: "name title role email",
      })
      .populate({
        path: "activities.by",
        select: "name",
      });

    res.status(200).json({
      status: true,
      task,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const createSubTask = async (req, res) => {
  try {
    const { title, tag, date } = req.body;

    const { id } = req.params;

    const newSubTask = {
      title,
      date,
      tag,
    };

    const task = await Task.findById(id);

    task.subTasks.push(newSubTask);

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "SubTask added successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, team, stage, priority, assets } = req.body;

    const task = await Task.findById(id);

    task.title = title;
    task.date = date;
    task.priority = priority.toLowerCase();
    task.assets = assets;
    task.stage = stage.toLowerCase();
    task.team = team;

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Task updated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const trashTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    task.isTrashed = true;

    await task.save();

    res.status(200).json({
      status: true,
      message: `Task trashed successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteRestoreTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType } = req.query;

    if (actionType === "delete") {
      await Task.findByIdAndDelete(id);
    } else if (actionType === "deleteAll") {
      await Task.deleteMany({ isTrashed: true });
    } else if (actionType === "restore") {
      const resp = await Task.findById(id);

      resp.isTrashed = false;
      await resp.save();
    } else if (actionType === "restoreAll") {
      await Task.updateMany(
        { isTrashed: true },
        { $set: { isTrashed: false } }
      );
    }

    res.status(200).json({
      status: true,
      message: `Operation performed successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};