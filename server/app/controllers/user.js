import handleError from '../utils/errors';
import { getIdentityFromToken } from '../utils/jwtUtils';
import { getUserFromIdentity } from './space';

exports.getMe = async (req, res) => {
  const userOpenId = getIdentityFromToken(req);
  try {
    const user = await getUserFromIdentity(userOpenId);
    res.json({
      status: 'SUCCESS',
      user,
    });
  } catch (e) {
    handleError(res, e.message);
  }
};

exports.updateMe = async (req, res) => {
  try {
    const userOpenId = getIdentityFromToken(req);
    const user = await getUserFromIdentity(userOpenId);
    const profile = req.body;
    user.profile = profile;

    await user.save();

    res.json({
      status: 'SUCCESS',
      user,
    });
  } catch (e) {
    handleError(res, e.message);
  }
};
