const mongoose = require('mongoose');
const mongooseObject = mongoose.Types.ObjectId;
const _ = require('lodash');

const Entry = require('../../models/Entry');
const Space = require('../../models/Space');
const _helper = require('./helper');

/**
 * Entries
 */

const checkObjectId = (data) => {
    if (typeof (data) !== 'object') {
        if (!mongooseObject.isValid(data))
            throw {error: 'Not objectID!!'};
    } else {
        for (let indexData in data) {
            if (!mongooseObject.isValid(data[indexData]))
                throw {error: 'Not objectID!!'};
        }
    }
    return true;
}

const getQuery = (q) => {
    const queryString = {
        "content_type": "contentTypeId",
        'eq': '$eq',
        'ne': '$ne',
        'gt': '$gt',
        'gte': '$gte',
        'lt': '$lt',
        'lte': '$lte',
        'in': '$in',
        'nin': '$nin'
    };
    const isObjectId = [
        "_id", "contentTypeId", "_spaceId"
    ];


    const _q = {};
    for (let index in q) {
        const indexQuery = queryString[index] ? queryString[index] : index;
        if (typeof (q[index]) === 'object') {
            for (let __index in q[index]) {
                if (queryString[__index]) {
                    if (typeof (_q[indexQuery]) !== 'object') {
                        _q[indexQuery] = {};
                    }
                    const tempVal = (__index === 'in' || __index === 'nin') ? q[index][__index].split(',') : q[index][__index];
                    _q[indexQuery][queryString[__index]] = tempVal;
                }
            }
        } else {
            _q[indexQuery] = {
                $eq: q[index]
            };
        }
        if (isObjectId.indexOf(indexQuery) >= 0) {
            for (let tempIndex in _q[indexQuery]) {
                checkObjectId(_q[indexQuery][tempIndex]);
            }
        }
    }

    return _q;
}

const getEntry = async (query, spaceId, entryId = null) => {
    const reqQuery = {...query};
    let select = "", skip = 0, limit = 0;
    if (reqQuery.select) {
        select = reqQuery.select;
        delete reqQuery.select;
    }
    if (reqQuery.skip) {
        skip = parseInt(reqQuery.skip);
        delete reqQuery.skip;
    }
    if (reqQuery.limit) {
        limit = parseInt(reqQuery.limit);
        delete reqQuery.limit;
    }

    const _getQuery = getQuery(reqQuery);

    checkObjectId(spaceId);

    const _query = {
        ..._getQuery,
        _spaceId: {$eq: spaceId}
    };
    if (entryId !== null) {
        checkObjectId(entryId);
        _query["_id"] = {$eq: entryId};
    }
//        console.log(_query);

    return await Entry.find(_query).select(select).limit(limit).skip(skip);

}


exports.getAllEntries = async(req, res, next) => {
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

exports.getSingleEntry = async(req, res, next) => {
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
}

// UPDATE CONTENT TYPE
const updateEntry = (req, res, next) => {

    const spaceId = req.params.space_id;
    const entryId = req.params.entry_id;
    const contentTypeId = req.headers['x-cic-content-type'];
    const fields = req.body.fields;
    const status = req.body.status;
    console.log('updateEntry', fields);

    Space.findOne({_id: spaceId}, (err, space) => {
        if (err) {
            return next(err);
        }

        // Check contentType
        const contentTypeInfo = _.find(space.contentTypes, ct => ct._id.equals(contentTypeId));

        if (!contentTypeInfo) {
            res.json({
                status: 'UNSUCCESSFUL',
                detail: `Invalid contentType ${contentTypeId}`,
            });
            return;
        }

        const isExistingInSpace = _.find(space.entries, entry => entry.equals(entryId));
        if (isExistingInSpace) {

            const validation = _helper.validateFields(fields, contentTypeInfo);
            if (!validation.valid) {
                res.json({
                    status: 'UNSUCCESSFUL',
                    message: validation.message,
                });
                return;
            }

            // Not update spaces.entry
            // Update entry
            Entry.findOne({_id: entryId}, (err, entry) => {
                entry.fields = fields;
                entry.status = status;
                entry.save((err1) => {
                    if (err1)
                        return _helper.handleError(err1, next);
                    res.json({
                        status: 'SUCCESS',
                        detail: 'Updating entry successfully',
                        entry,
                    });
                });
            });
        } else {
            // 1. Create and Insert new entry
            // 2. Update spaces.entry
            const newEntry = new Entry({
                contentTypeId,
                fields,
                status: 'draft',
                _spaceId: spaceId,
            });

            newEntry.save((err) => {
                if (err)
                    return _helper.handleError(err, next);

                // Update space
                space.entries.push(newEntry._id);
                space.save((err2) => {
                    if (err2) {
                        return next(err2);
                    }
                    res.json({
                        status: 'SUCCESS',
                        detail: 'Create new entry successfully',
                        entry: newEntry,
                    });
                });
            });
        }
    });
};

exports.updateEntry = updateEntry;

// CREATE CONTENT TYPE
exports.createEntry = (req, res, next) => {
    // Create new objectId
    const entryId = mongoose.Types.ObjectId();
    req.params.entry_id = entryId;
    return updateEntry(req, res, next);
};

exports.deleteEntry = (req, res, next) => {
    const spaceId = req.params.space_id;
    const entryId = req.params.entry_id;
    Entry.remove({_id: entryId}, (err) => {
        if (err)
            return _helper.handleError(err, next);

        // Remove entry ref from space
        Space.findOne({_id: spaceId}, (err, space) => {
            if (err)
                return _helper.handleError(err, next);
            space.entries = _.filter(space.entries, _id => !_id.equals(entryId));

            space.save((err2) => {
                if (err2)
                    return _helper.handleError(err2, next);
                res.json({
                    status: 'SUCCESS',
                    detail: 'delete entry successfully',
                });
            });
        });
    });
};

exports.truncateEntry = (req, res, next) => {
    const spaceId = req.params.space_id;
    Space.findOne({_id: spaceId}, (err, space) => {
        if (err) {
            return next(err);
        }
        space.entries = [];
        space.save((err) => {
            if (err)
                return _helper.handleError(err, next);

            Entry.remove({_spaceId: spaceId}, (err2) => {
                if (err2)
                    return _helper.handleError(err2, next);
                res.json({
                    status: 'SUCCESS',
                    detail: 'clear all entries in space successfully',
                    space,
                });
            });
        });
    });
};
