const mongoose = require('mongoose');
const _ = require('lodash');

const Application = require('../../models/Application');

const mongooseObject = mongoose.Types.ObjectId;

const isObjectId = (id) => {
  return (mongooseObject.isValid(id));
};

exports.getAllApplication = async (req, res) => {
  try {
    const allApplication = await Application.find({ });
    res.json({
      items: allApplication,
      skip: 0,
      limit: 100,
      total: allApplication.length,
    });
  } catch (e) {
    res.status(400).json({
      status: 'ERROR',
      message: e.message,
    });
  }
};

exports.getApplication = async (req, res) => {
  try {
    const id = req.params.id;
    if (_.isEmpty(id)) throw new Error('Please Request ID');

    if (!isObjectId(id)) throw new Error('Not ObjectID');

    const application = await Application.findOne({ _id: id });

    res.json({
      status: 'SUCCESSFUL',
      ...application.toObject(),
    });
  } catch (e) {
    res.status(400).json({
      status: 'ERROR',
      message: e.message,
    });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const id = req.params.id;
    if (_.isEmpty(id)) throw new Error('Please Request ID');
    if (!isObjectId(id)) throw new Error('Not ObjectID');

    const application = await Application.findOneAndUpdate(
      { _id: id },
      _.pick(req.body, ['_id', 'name', 'description', 'redirectURL', 'read', 'write']),
      {
        new: true,
        upsert: true,
      },
    );

    res.json({
      status: 'SUCCESS',
      ..._.pick(application, ['_id', 'name', 'description', 'redirectURL', 'read', 'write']),
    });
  } catch (e) {
    res.status(400).json({
      status: 'ERROR',
      message: e.message,
    });
  }
};

exports.createApplication = async (req, res) => {
  const { name, description, redirectURL, read, write } = req.body;
  try {
    if (_.isEmpty(name)) throw new Error('NameIsRequired');
    if (read === undefined) throw new Error('ReadIsRequired');
    if (write === undefined) throw new Error('WriteIsRequired');
    const application = new Application({
      name,
      description,
      redirectURL,
      read,
      write,
    });
    await application.save();

    res.json({
      status: 'SUCCESSFUL',
      item: _.pick(application, ['_id', 'name', 'description', 'redirectURL', 'read', 'write']),
    });
  } catch (e) {
    // next(e);
    res.status(400).json({
      status: 'ERROR',
      message: e.message,
    });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const id = req.params.id;
    if (_.isEmpty(id)) throw new Error('Please Request ID');
    if (!isObjectId(id)) throw new Error('Not ObjectID');

    await Application.remove({ _id: id });
    res.json({
      status: 'SUCCESS Deleted',
      _id: id,
    });
  } catch (e) {
    res.status(400).json({
      status: 'ERROR',
      message: e.message,
    });
  }
};
