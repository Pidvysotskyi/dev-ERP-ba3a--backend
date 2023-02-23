const { Todo } = require("../../models");

const editTodo = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;
  const { todoId, todoNote } = req.body;

  const todoParams = { userId, todoNote };

  const updatedTodo = new Todo(todoParams);

  await updatedTodo.update(todoId);

  const todo = await Todo.getByid(todoId);

  res.status(201).json({
    message: `Todo ${todoId} Updated`,
    todo,
  });
};

module.exports = editTodo;
