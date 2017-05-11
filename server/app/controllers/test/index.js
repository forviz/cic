const mongoose = require('mongoose');
const _ = require('lodash');
import { getAccessToken, decodeToken, getIdentityFromToken } from '../../utils/jwtUtils';
const Space = require('../../models/Space');
const User = require('../../models/User');
const Entry = require('../../models/Entry');


/**
 * Get
 */
//const getUserFromIdentity = async (identity) => {
//  try {
//    const user = await User.findByIdentity(identity);
//    if (user) return user;
//
//    // Else create new one
//    const newUser = new User();
//    const [provider, providerId] = _.split(identity, '|');
//    newUser.identities = [
//      {
//        provider,
//        user_id: providerId,
//        connection: provider,
//        isSocial: true
//      }
//    ];
//    const result = await newUser.save();
//    return newUser;
//  } catch (e) {
//    console.log(e);
//  }
//}


exports.getAllEntries = async (req, res, next) => {
//  const userOpenId = getIdentityFromToken(req);
//  const user = await getUserFromIdentity(userOpenId);
    try {
        const spaceId = req.params.space_id;
        const result = await Space.find({"_id": spaceId})
                .populate({
                    path: 'entries'
                })
                .exec(function (err, space) {
                    if (err)
                        return handleError(err);
                });
        res.json({
            items: result,
        });
    } catch (e) {
        next(e);
    }
}

const getQuery = async (q) => {
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


    const _q = {};
    for (let index in q) {
        const indexQuery = queryString[index] ? queryString[index] : index;
        if (typeof (q[indexQuery]) === 'object') {
            for (let __index in q[indexQuery]) {
                if (queryString[__index]) {
                    if (typeof (_q[indexQuery]) !== 'object') {
                        _q[indexQuery] = {};
                    }
                    const tempVal = (__index === 'in' || __index === 'nin') ? q[indexQuery][__index].split(',') : q[indexQuery][__index];
                    _q[indexQuery][queryString[__index]] = tempVal;
                }
            }
        } else {
            _q[indexQuery] = {
                $eq: q[index]
            };
        }
    }
//    console.log(_q);

    return _q;
}

exports.getEntry = async (req, res, next) => {
//  const userOpenId = getIdentityFromToken(req);
//  const user = await getUserFromIdentity(userOpenId);
    try {
        const spaceId = req.params.space_id;
        const entryId = req.params.entry_id;

        const reqQuery = req.query;
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

        const _getQuery = await getQuery(reqQuery);

        const _query = {
            ..._getQuery,
            _spaceId: {$eq: spaceId}
        };
        if (entryId)
            _query["_id"] = {$eq: entryId};

        console.log(_query);

        const result = await Entry.find(_query).select(select).limit(limit).skip(skip);
        res.json({
            items: result,
        });
    } catch (e) {
        next(e);
    }
}
