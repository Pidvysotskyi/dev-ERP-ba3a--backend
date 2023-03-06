const { TodoKp } = require("../../models");

const addTodo = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;
  const { kpKey, dueDate, todoNote } = req.body;

  const todoParams = { kpKey, dueDate, userId, todoNote };

  const newTodo = new TodoKp(todoParams);

  const newTodoId = await newTodo.add();

  const todo = await TodoKp.getByid(newTodoId);

  res.status(201).json({
    message: `Todo ${todo.todoId} Created`,
    todo,
  });
};

module.exports = addTodo;
