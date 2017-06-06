const mongoose = require('mongoose');
const _ = require('lodash');

const Entry = require('../../models/Entry');
const Space = require('../../models/Space');
const helper = require('./helper');

const mongooseObject = mongoose.Types.ObjectId;

/**
 * Entries
 */
/* eslint-disable guard-for-in, no-restricted-syntax */
const checkObjectId = (data) => {
  if (typeof (data) !== 'object') {
    if (!mongooseObject.isValid(data)) throw new Error('Not objectID!!');
  } else {
    for (const keyData in data) {
      if (!mongooseObject.isValid(data[keyData])) throw new Error('Not objectID!!');
    }
  }
  return true;
};

const getQuery = (q) => {
  const queryString = {
    content_type: 'contentTypeId',
    eq: '$eq',
    ne: '$ne',
    gt: '$gt',
    gte: '$gte',
    lt: '$lt',
    lte: '$lte',
    in: '$in',
    nin: '$nin',
  };
  const isObjectId = ['_id', 'contentTypeId', '_spaceId'];

  const _q = {};
  for (const key in q) {
    const keyQuery = queryString[key] ? queryString[key] : key;
    if (typeof (q[key]) === 'object') {
      for (const __key in q[key]) {
        if (queryString[__key]) {
          if (typeof (_q[keyQuery]) !== 'object') {
            _q[keyQuery] = {};
          }
          const tempVal = (__key === 'in' || __key === 'nin') ? q[key][__key].split(',') : q[key][__key];
          _q[keyQuery][queryString[__key]] = tempVal;
        }
      }
    } else {
      _q[keyQuery] = {
        $eq: q[key],
      };
    }
    if (isObjectId.indexOf(keyQuery) >= 0) {
      for (const tempIndex in _q[keyQuery]) {
        checkObjectId(_q[keyQuery][tempIndex]);
      }
    }
  }

  return _q;
};

const getEntry = async (query, spaceId, entryId = null) => {
  const reqQuery = { ...query };
  let select = '';
  let skip = 0;
  let limit = 0;

  if (reqQuery.select) {
    select = reqQuery.select;
    delete reqQuery.select;
  }
  if (reqQuery.skip) {
    skip = parseInt(reqQuery.skip, 10);
    delete reqQuery.skip;
  }
  if (reqQuery.limit) {
    limit = parseInt(reqQuery.limit, 10);
    delete reqQuery.limit;
  }

  const _getQuery = getQuery(reqQuery);

  checkObjectId(spaceId);

  const _query = {
    ..._getQuery,
    _spaceId: { $eq: spaceId },
  };
  if (entryId !== null) {
    checkObjectId(entryId);
    _query._id = { $eq: entryId };
  }

  const result = await Entry.find(_query).select(select).limit(limit).skip(skip);
  return result;
};
/* eslint-enable guard-for-in, no-restricted-syntax */

exports.getAllEntries = async (req, res) => {
  try {
    const spaceId = req.params.space_id;
    const reqQuery = req.query;
    const result = await getEntry(reqQuery, spaceId);
    res.json({
      items: result,
    });
  } catch (e) {
    res.status(500).json(e);
  }
};

exports.getSingleEntry = async (req, res) => {
  try {
    const spaceId = req.params.space_id;
    const entryId = req.params.entry_id;
    const reqQuery = req.query;
    const result = await getEntry(reqQuery, spaceId, entryId);
    res.json({
      item: (result.length > 0) ? result[0] : [],
    });
  } catch (e) {
    res.status(500).json(e);
  }
};

// UPDATE CONTENT TYPE
const updateEntry = async (req, res, next) => {
  const spaceId = req.params.space_id;
  const entryId = req.params.entry_id;
  const contentTypeId = req.headers['x-cic-content-type'];
  const fields = req.body.fields;
  const status = req.body.status;

  try {
    const space = await Space.findOne({ _id: spaceId });
    const isExistingEntry = _.some(space.entries, id => id.equals(entryId));
    const contentTypeInfo = _.find(space.contentTypes, ct => ct._id.equals(contentTypeId));
    if (!contentTypeInfo) {
      res.json({
        status: 'UNSUCCESSFUL',
        detail: `Invalid contentType ${contentTypeId}`,
      });
      return;
    }

    if (isExistingEntry) {
      const validation = helper.validateFields(fields, contentTypeInfo);
      if (!validation.valid) {
        res.json({
          status: 'UNSUCCESSFUL',
          message: validation.message,
        });
        return;
      }
    }

    const entry = await Entry.findOneAndUpdate({ _id: entryId }, {
      contentTypeId,
      fields,
      status: status || 'draft',
      _spaceId: spaceId,
    }, {
      new: true,
      upsert: true,
    });

    // Add to space.entires if not exists
    space.entries = _.uniq([...space.entries, entry._id]);
    await space.save();

    res.json({
      status: 'SUCCESS',
      detail: 'Create new entry successfully',
      entry,
    });
  } catch (e) {
    next(e);
  }
};

exports.updateEntry = updateEntry;

// CREATE CONTENT TYPE
exports.createEntry = (req, res, next) => {
  // Create new objectId
  const entryId = mongoose.Types.ObjectId();
  req.params.entry_id = entryId;
  console.log('createEntry entryId', entryId);
  return updateEntry(req, res, next);
};

exports.deleteEntry = async (req, res, next) => {
  const spaceId = req.params.space_id;
  const entryId = req.params.entry_id;

  try {
    await Entry.remove({ _id: entryId });
    const space = await Space.findOne({ _id: spaceId });
    space.entries = _.filter(space.entries, _id => !_id.equals(entryId));
    await space.save();

    res.json({
      status: 'SUCCESS',
      detail: 'delete entry successfully',
    });
  } catch (e) {
    next(e);
  }
};

exports.truncateEntry = async (req, res, next) => {
  const spaceId = req.params.space_id;

  try {
    await Entry.remove({ _spaceId: spaceId });
    const space = await Space.findOne({ _id: spaceId });
    space.entries = [];
    await space.save();

    res.json({
      status: 'SUCCESS',
      detail: 'clear all entries in space successfully',
      space,
    });
  } catch (e) {
    next(e);
  }
};
