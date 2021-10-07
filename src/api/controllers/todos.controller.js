const httpStatus = require('http-status');
const Todos = require('../models/todos.model');
const { insertTodos, listTodos } = require('../helpers/esHelper.js');

/**
 * Create new Todo
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const todos = new Todos(req.body);
    const savedTodo = await todos.save();
    await insertTodos(savedTodo);
    res.status(httpStatus.CREATED);
    res.json(savedTodo.transform());
  } catch (error) {
    next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { count, data } = await listTodos(req.body);
    res.json({ count, data });
  } catch (error) {
    next(error);
  }
};
