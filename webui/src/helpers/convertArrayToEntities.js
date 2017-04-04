import _ from 'lodash';

const convertArrayToEntities = (arr, key) => {
  return _.reduce(arr, (total, item) => {
    const itemKey = item[key];
    return {
      ...total,
      [itemKey]: item,
    }
  }, {});
}

export default convertArrayToEntities;
