const mongoose = require('mongoose');
const _ = require('lodash');
import { getAccessToken, decodeToken, getIdentityFromToken } from '../../utils/jwtUtils';
const Space = require('../../models/Space');
const User = require('../../models/User');
const Organization = require('../../models/Organization');


/**
 * Get
 */
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
        isSocial: true
      }
    ];
    const result = await newUser.save();
    return newUser;
  } catch (e) {
    console.log(e);
  }
}

const getOrganizationsFromUser = async (user) => {
  try{

    const organizations = await Organization.findByIdentity(user._id);
    console.log('check organizations', organizations);
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

  console.log("userId:: ", user._id);

  try {
    // const result = await Space.find({ users: user._id });

    const userOrgazation = await Organization.find({$or: [{'users.Members':user._id},{'users.Owners':user._id}] });

    const result = await Space.find({
          organization: { $in: _.map(userOrgazation, '_id') }
       });

    res.json({
      results: result
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
  console.log("userOpenId:: ", userOpenId);
  console.log("user createSpace:: ", user);

  const organizations = await getOrganizationsFromUser(user);
  console.log("organization:: ", organizations);

  const organizationToUse = organizations[0];

  const space = new Space({
    name: spaceName,
    defaultLocale,
    users: [user._id],
    organization: organizationToUse._id
  });

  organizationToUse.spaces.push(space._id);

  await space.save();
  await organizationToUse.save();

  // space.save((err) => {
  //   if (err) { return next(err); }
    res.json({
      status: 'SUCCESS',
      detail: 'Create space successfully',
      space: space,
      user: user,
      organization: organizationToUse,
    });
  // });
};
/*exports.createSpace = async (req, res, next) => {
  const spaceName = req.body.name;
  const defaultLocale = req.body.defaultLocale;
  // const organization_id = req.body.organization_id;

  const userOpenId = getIdentityFromToken(req);
  const user = await getUserFromIdentity(userOpenId);

  const organization2 = await getOrganizationFromIdentity(userOpenId);

  console.log("user:: ", user);
  console.log("organization:: ", organization2);

  const space = new Space({
    name: spaceName,
    defaultLocale,
    users: [user._id],
    //organization: organization_id
  });

  const organization = new Organization();
  organization.spaces = [space._id];

  // await space.save();
  // await user.save();

  // space.save((err) => {
  //   if (err) { return next(err); }
  //   res.json({
  //     status: 'SUCCESS',
  //     detail: 'Create space successfully',
  //     space: space,
  //   });
  // });
};*/

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
