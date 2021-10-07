const express = require('express');
const { validate } = require('express-validation');
const controller = require('../../controllers/todos.controller');
const {
  createTodos,
  listTodos,
} = require('../../validations/todos.validation');

const router = express.Router();

router
  .route('/')
  /**
   * @api {post} v1/Todo Create Todo
   * @apiDescription Create a new todo
   * @apiVersion 1.0.0
   * @apiName CreateTodo
   * @apiGroup Todo
   *
   * @apiParam  {String{4..64}}         title          Todo's title
   * @apiParam  {String{4..64}}         description    Todo's description
   *
   * @apiSuccess (Created 201) {String}  id            Todo's id
   * @apiSuccess (Created 201) {String}  title         Todo's title
   * @apiSuccess (Created 201) {String}  description   Todo's description
   * @apiSuccess (Created 201) {Date}    createdAt            Timestamp
   *
   * @apiError (Bad Request 400)         ValidationErrorSome parameters may contain invalid values
   */
  .post(validate(createTodos, {}, {}), controller.create);

router
  .route('/list')
  /**
   * @api {post} v1/digital_document/list Sorted and Filtered Data
   * @apiDescription Get list of sorted and filtered data
   * @apiVersion 1.0.0
   * @apiName List
   * @apiGroup List
   *
   * @apiParam  {String}         term                 searching term
   * @apiParam  {String}         fieldToSort          name of field which is to be sorted
   * @apiParam  {String}         order                order ( can be asc or desc )
   * @apiParam  [String]         fieldsToFilter       name of fields from which term will be search
   * @apiParam  {String}         collectionId         To search in specific collection id
   * @apiParam  {Bool}           inCollection         Set  true/false to filter from collection
   * @apiParam  {Number{1-}}     [page=1]  List page
   * @apiParam  {Number{1-100}}  [perPage=1]          digital document per page
   *
   * @apiSuccess (Created 201)    {object}            sorted data object
   *
   * @apiError (Bad Request 400) ValidationError      Some parameters may contain invalid values
   */
  .post(validate(listTodos), controller.list);

module.exports = router;
