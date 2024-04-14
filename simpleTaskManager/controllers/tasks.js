const taskSchema = require("../models/tasks");
const asyncWrapper = require("../middleware/asyncWrapper");
const { createCustomError } = require("../errors/custom-error");

const getAllTasks = asyncWrapper(async (req, res) => {
  const tasks = await taskSchema.find({});
  //console.log(tasks);
  res.status(200).json({ tasks });
  //res.status(200).json({ tasks, amount: tasks.length });                        // Alternate options
  //res.status(200).json({ success: true, data: {tasks, nbHits: tasks.length} }); // Alternate options
});

const createNewTask = asyncWrapper(async (req, res) => {
  //console.log(req.body);
  const task = await taskSchema.create(req.body);
  res.status(201).json({ task }); // 201 is for sucessful post request
  // try {
  // } catch (error) {
  //   res.status(500).json({ msg: error }); // 500 is general server error
  // }
});

const getSingleTask = asyncWrapper(async (req, res) => {
  const { id: taskID } = req.params;
  const task = await taskSchema.findOne({ _id: taskID });
  if (!task) {
    // If task doesnt exist
    return next(createCustomError(`No task with iD : ${taskID}`, 404));
  }
  res.status(200).json({ task });
  // try {
  // } catch (error) {
  //   res.status(500).json({ msg: error });
  // }
});

const deleteTask = asyncWrapper(async (req, res) => {
  const { id: taskID } = req.params;
  const task = await taskSchema.findOneAndDelete({ _id: taskID });
  if (!task) {
    return next(createCustomError(`No task with iD : ${taskID}`, 404));
  }
  // res.status(200).json({ task });
  res.status(200).json({ task: null, status: "success" }); // a more conventional response perhaps
  // try {
  // } catch (error) {
  //   res.status(500).json({ msg: error });
  // }
});

const updateTask = asyncWrapper(async (req, res) => {
  //console.log(req.body);
  const { id: taskID } = req.params;
  const updatedTask = await taskSchema.findOneAndUpdate(
    { _id: taskID },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!task) {
    return next(createCustomError(`No task with iD : ${taskID}`, 404));
  }
  res.status(200).json({ updatedTask });
  // try {
  // } catch (error) {
  //   res.status(500).json({ msg: error });
  // }
});

module.exports = {
  getAllTasks,
  createNewTask,
  getSingleTask,
  updateTask,
  deleteTask,
};
