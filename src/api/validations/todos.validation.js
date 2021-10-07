const { Joi } = require('express-validation');

module.exports = {
  // POST /v1/todos
  createTodos: {
    body: Joi.object({
      title: Joi.string().required().label('Title'),
      description: Joi.string().required().label('Description'),
    }),
  },

  // GET /v1/todos/list
  listTodos: {
    body: Joi.object({
      term: Joi.string()
        .optional()
        .allow('')
        .empty()
        .trim()
        .label('Searching term'),
      fieldToSort: Joi.string().trim().label('Filed to sort'),
      order: Joi.string().trim().label('Order'),
      page: Joi.number().min(1).label('Page'),
      perPage: Joi.number().min(1).max(100).label('Per page'),
    }),
  },
};
