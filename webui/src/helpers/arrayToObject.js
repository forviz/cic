import _ from 'lodash';

const arrayToObject = (array, key) => {
  return _.reduce(array, (sum, item) => {
    return {
      ...sum,
      [item[key]]: item,
    };
  }, {});
};

export default arrayToObject;
