const mongoose = require('mongoose');
const _ = require('lodash');
import { getAccessToken, decodeToken, getIdentityFromToken } from '../../utils/jwtUtils';
const Space = require('../../models/Space');
const User = require('../../models/User');


/**
 * Get
 */
const getUserFromIdentity = async (identity) => {
  try {
    const user = await User.findByIdentity(identity);
    if (user) return user;

    // Else create new one
    const newUser = new User();
    const [provider, providerId] = _.split(identity, '|');
    newUser.identities = [
      {
        provider,
        user_id: providerId,
        connection: provider,
        isSocial: true
      }
    ];
    const result = await newUser.save();
    return newUser;
  } catch (e) {
    console.log(e);
  }
}
// exports.getAll = (req, res, next) => {
//
//   const userOpenId = getUserFromToken(req);
//   User.findByIdentity(userOpenId, (err, user) => {
//     console.log('userOpenId', userOpenId, user);
//   });
//
//   Space.find({}, (err, spaces) => {
//     if (err) { return next(err); }
//     res.json({
//       items: spaces,
//     });
//   });
// };

exports.getAll = async (req, res, next) => {

  const userOpenId = getIdentityFromToken(req);
  const user = await getUserFromIdentity(userOpenId);

  try {
    const result = await Space.find({ users: user._id });
    res.json({
      items: result,
    });
  } catch (e) {
    next(e);
  }
}

exports.getSingle = (req, res, next) => {
  const spaceId = req.params.space_id;
  Space.findOne({ _id: spaceId }).exec((err, space) => {
    if (err) { return next(err); }
    res.json({
      title: 'find space',
      space,
    });
  });
}

exports.updateSpace = (req, res, next) => {

}

exports.createSpace = async (req, res, next) => {
  const spaceName = req.body.name;
  const defaultLocale = req.body.defaultLocale;

  const userOpenId = getIdentityFromToken(req);
  const user = await getUserFromIdentity(userOpenId);

  const space = new Space({
    name: spaceName,
    defaultLocale,
    users: [user._id],
  });

  space.save((err) => {
    if (err) { return next(err); }
    res.json({
      status: 'SUCCESS',
      detail: 'Create space successfully',
      space: space,
    });
  });
};

exports.deleteSpace = (req, res, next) => {
  const spaceId = req.params.space_id;
  Space.findOne({ _id: spaceId }, (err, space) => {
    if (err) { return next(err); }

    if (!space) {
      res.json({
        status: 'UNSUCCESSFUL',
        message: 'Cannot find space',
      });
    } else {
      space.remove();
      res.json({
        status: 'SUCCESSFUL',
        message: 'Delete successfully',
      });
    }
  });
};
