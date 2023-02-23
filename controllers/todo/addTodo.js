const { Todo } = require("../../models");

const addTodo = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;
  const { projectKey, dueDate, todoNote } = req.body;

  const todoParams = { projectKey, dueDate, userId, todoNote };

  const newTodo = new Todo(todoParams);

  const newTodoId = await newTodo.add();

  const todo = await Todo.getByid(newTodoId);

  res.status(201).json({
    message: `Todo ${todo.todoId} Created`,
    todo,
  });
};

module.exports = addTodo;
