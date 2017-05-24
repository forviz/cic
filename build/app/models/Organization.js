'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var organizationSchema = new Schema({
	name: String,
	users: {
		Owners: [{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}],
		Admins: [{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}],
		Members: [{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}]
	},
	spaces: [{
		type: Schema.Types.ObjectId,
		ref: 'Space'
	}]
}, { timestamps: true });

organizationSchema.statics.findByIdentity = function (user_id, cb) {

	console.log("user_id:: ", user_id);
	return this.find({ 'users.Owners': user_id }, cb);
};

var Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;
//# sourceMappingURL=Organization.js.map