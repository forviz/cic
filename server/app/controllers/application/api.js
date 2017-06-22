const mongoose = require('mongoose');
const _ = require('lodash');

const Application = require('../../models/Application');

const mongooseObject = mongoose.Types.ObjectId;

const checkID = (id) => {
  if (typeof (id) !== 'object') {
    if (!mongooseObject.isValid(id)) throw new Error('Not objectID!!');
  }
};

exports.getAllApplication = async (req, res) => {
  try {
    const allApplication = await Application.find({ });
    res.json(allApplication);
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
    if (id === undefined) throw new Error('Bad Request');

    checkID(id);

    const getApplication = await Application.findOne({ _id: id });
    res.json(getApplication);
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
    if (id === undefined) throw new Error('Bad Request');
    checkID(id);

    await Application.findOneAndUpdate({ _id: id },
      req.body,
    );

    const application = await Application.findOne({ _id: id });
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
  const applicationName = _.get(req, 'body.name', '');
  const applicationDescription = _.get(req, 'body.description', '');
  const applicationRedirectURL = _.get(req, 'body.redirectURL', '');
  const applicationRead = _.get(req, 'body.read');
  const applicationWrite = _.get(req, 'body.write');
  try {
    if (applicationName === '') throw new Error('NameIsRequired');
    if (applicationRead === undefined) throw new Error('ReadIsRequired');
    if (applicationWrite === undefined) throw new Error('WriteIsRequired');
    const application = new Application();
    application.name = applicationName;
    application.description = applicationDescription;
    application.redirectURL = applicationRedirectURL;
    application.read = applicationRead;
    application.write = applicationWrite;
    await application.save();

    res.json({
      status: 'SUCCESSFUL',
      ..._.pick(application, ['_id', 'name', 'description', 'redirectURL', 'read', 'write']),
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
    if (id === undefined) throw new Error('BadRequest');
    checkID(id);

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
