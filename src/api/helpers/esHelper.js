const _ = require('lodash');
const { esConfig } = require('../../config/vars');
const esService = require('../services/esService');

exports.insertTodos = async (todos) => {
  const bodyObject = _.pick(todos, [
    'title',
    'description',
  ]);
  const body = {
    id: todos._id.toHexString(),
    indexName: esConfig.indexName,
    body: bodyObject,
  };
  await esService.indexDocument(body);
};

async function prepareObject(result) {
  const resultList = result.map(obj => obj._source);
  return resultList;
}

exports.listTodos = async ({ term, page = 1, perPage = 10 }) => {
  let query;
  const offset = page;
  const limit = perPage;
  if (!term) {
    query = {
      query: {
        match_all: {},
      },
    };
  } else {
    query = {
      query: {
        multi_match: {
          query: term,
          type: 'phrase_prefix',
          fields: ['title', 'description'],
        },
      },
    };
  }
  const options = {
    indexName: esConfig.indexName,
    body: {
      size: limit,
      from: limit * (offset - 1),
      query: query.query,
    },
  };
  const { hits } = await esService.search(options);
  const { count } = await esService.countDocuments(query);
  const data = await prepareObject(hits.hits);
  return { count, data };
};
