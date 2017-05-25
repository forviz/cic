import _ from 'lodash';
import { getIdentityFromToken } from '../../utils/jwtUtils';

const Space = require('../../models/Space');
const User = require('../../models/User');
const Organization = require('../../models/Organization');

/**
 * Get
 */
/* eslint-disable import/prefer-default-export */
export const getUserFromIdentity = async (identity) => {
  try {
    const user = await User.findByIdentity(identity);
    if (user) return user;

    // Else create new one
    const newUser = new User();
    newUser.email = '';
    const [provider, providerId] = _.split(identity, '|');
    newUser.identities = [
      {
        provider,
        user_id: providerId,
        connection: provider,
        isSocial: true,
      },
    ];
    await newUser.save();
    return newUser;
  } catch (e) {
    console.log(e);
    return e;
  }
};
/* eslint-enable import/prefer-default-export */

const getOrganizationsFromUser = async (user) => {
  try {
    const organizations = await Organization.findByIdentity(user._id);
    if (!_.isEmpty(organizations)) return organizations;

    // Else create new one
    const newOrganization = new Organization();
    newOrganization.name = 'Default';
    newOrganization.users.Owners = [user._id];

    user.organizations.push(newOrganization._id);
    await user.save();
    await newOrganization.save();
    return [newOrganization];
  } catch (e) {
    console.log(e);
  }
};

exports.getAll = async (req, res, next) => {
  const userOpenId = getIdentityFromToken(req);
  const user = await getUserFromIdentity(userOpenId);

  try {
    const userOrgazation = await Organization.find({
      $or: [{ 'users.Members': user._id }, { 'users.Owners': user._id }],
    });

    const result = await Space.find({
      organization: { $in: _.map(userOrgazation, '_id') }
    });

    res.json({
      items: result,
    });
  } catch (e) {
    next(e);
  }
};

exports.getSingle = (req, res, next) => {
  const spaceId = req.params.space_id;
  Space.findOne({ _id: spaceId }).exec((err, space) => {
    if (err) { next(err); }
    res.json({
      title: 'find space',
      space,
    });
  });
};

exports.updateSpace = async (req, res) => {
  const spaceId = req.params.space_id;
  const spaceName = req.body.name;
  const defaultLocale = req.body.defaultLocale;

  const space = await Space.findOne({ _id: spaceId });

  if (space) {
    if (spaceName) space.name = spaceName;
    if (defaultLocale) space.defaultLocale = defaultLocale;
    await space.save();

    res.json({
      status: 'SUCCESS',
      detail: 'Update space successfully',
      space,
    });
  }
};

exports.createSpace = async (req, res) => {
  const spaceName = req.body.name;
  const defaultLocale = req.body.defaultLocale;

  const userOpenId = getIdentityFromToken(req);
  const user = await getUserFromIdentity(userOpenId);
  const organizations = await getOrganizationsFromUser(user);

  const organizationToUse = organizations[0];

  const space = new Space({
    name: spaceName,
    defaultLocale,
    users: [user._id],
    organization: organizationToUse._id,
  });

  organizationToUse.spaces.push(space._id);

  await space.save();
  await organizationToUse.save();

  res.json({
    status: 'SUCCESS',
    detail: 'Create space successfully',
    space,
    user,
    organization: organizationToUse,
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
