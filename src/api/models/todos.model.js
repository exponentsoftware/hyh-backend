const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../utils/APIError');

/**
 * Todo Schema
 * @private
 */
const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxlength: 64,
      minLength: 4,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 256,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
todoSchema.pre('save', async (next) => {
  try {
    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
todoSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      'id',
      'title',
      'description',
      'createdAt',
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
todoSchema.statics = {

  /**
   * List todo in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of todo to be skipped.
   * @param {number} limit - Limit number of todo to be returned.
   * @returns {Promise<Todo[]>}
   */
  list({
    page = 1, perPage = 30, title, description,
  }) {
    const options = omitBy({ title, description }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  /**
   * Return new validation error
   * if error is a mongoose duplicate key error
   *
   * @param {Error} error
   * @returns {Error|APIError}
   */
  checkDuplicate(error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: [
          {
            field: 'title',
            location: 'body',
            messages: ['"Title" already exists'],
          },
        ],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  },
};
/**
 * @typedef Todos
 */
module.exports = mongoose.model('Todos', todoSchema);
