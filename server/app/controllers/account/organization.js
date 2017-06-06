import { getUserFromIdentity } from '../space/index';
import { getIdentityFromToken } from '../../utils/jwtUtils';

const mongoose = require('mongoose');

const _ = require('lodash');
const Organization = require('../../models/Organization');

const mongooseObject = mongoose.Types.ObjectId;

exports.getAll = async (req, res) => {
  const organizations = await Organization.find({ });

  res.json({
    status: 'SUCCESS',
    items: organizations,
  });
};

exports.getSingle = async (req, res, next) => {
  const organizationId = req.params.organization_id;
  Organization.findOne({ _id: organizationId }).exec((err, organization) => {
    if (err) next(err);
    res.json({
      status: 'SUCCESS',
      title: 'find organization',
      organization,
    });
  });
};

exports.createOrganization = async (req, res, next) => {
  try {
    const userOpenId = getIdentityFromToken(req);
    const user = await getUserFromIdentity(userOpenId);

    // console.log("user:: ", user);

    const organization = new Organization();
    organization.name = req.body.name;

    organization.users.Owners = [user._id];

    // console.log("organization:: ", organization);

    user.organizations.push(organization._id);  // Add organizations to User

    await organization.save();
    await user.save();

    res.json({
      status: 'SUCCESS',
      item: organization,
    });
  } catch (e) {
    next(e);
  }
};

exports.getAllMemberOrganization = async (req, res, next) => {
  const organizationId = req.params.organization_id;

  try {
    if (!mongooseObject.isValid(organizationId)) {
      throw new Error('Not objectId');
    }

    const result = await Organization.find({ _id: organizationId }).populate('users.Members');

    res.json({
      status: 'SUCCESS',
      organization: organizationId,
      members: result[0].users.Members,
    });
  } catch (e) {
    next(e);
  }
};

exports.delMemberOrganization = async (req, res, next) => {
  try {
    const organizationId = req.params.organization_id;
    const userId = req.params.user_id;

    await Organization.update({
      _id: organizationId },
      {
        $pull: {
          'users.Members': userId,
        },
      },
    );

    res.json({
      status: 'SUCCESS',
    });
  } catch (e) {
    next(e);
  }
};

exports.createMemberOrganization = async (req, res, next) => {
  try {
    const userId = req.body.user_id;
    const organizationId = req.params.organization_id;

    // const organization = await Organization.find({ _id: organizationId });
    // console.log("find organization:: ", organization);
    // organization[0].users.Members.push(userId);

    // const organization = new Organization();
    // organization.update( { "_id": organizationId },
    // { "users.Members": userId },
    // { upsert: true } )

    // const organization = await Organization.findOne({ _id: organizationId });
    // organization.users.Members.push(userId);
    //
    // const result = await organization.save();

    const checkMember = await Organization.find({ 'users.Members': userId });

    if (!_.isEmpty(checkMember)) {
      // console.log("IF");
      res.json({
        status: 'มีแล้ว ไม่แอดแล้ว',
      });
    } else {
      // console.log("ELSE");
      await Organization.update({
        _id: organizationId,
      }, {
        $push: {
          'users.Members': userId,
        },
      });

      res.json({
        status: 'SUCCESS',
      });
    }
  } catch (e) {
    next(e);
  }
};
