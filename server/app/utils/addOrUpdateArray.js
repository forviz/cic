import _ from 'lodash';

export default (collection, item) => {
  const doExist = _.find(collection, el => e._id.equals(item._id));
  if (doExist) {
    return _.map(collection, el => {
      if (el._id.equal(item._id))
    })
  }
}
