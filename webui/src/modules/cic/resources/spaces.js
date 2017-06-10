import { fetchWithResponse } from '../helper';

export const fetchSpace = (spaceId) => {
  return fetchWithResponse(`${BASE_URL}/spaces/${spaceId}${urlParam}`)
  .then((response) => {
    const space = _.get(response, 'space');
    // console.log('space', space);
    if (space) {
      return space;
    }
    throw responseError({
      appMessage: 'Cannot find spaces',
    });
  });
};
