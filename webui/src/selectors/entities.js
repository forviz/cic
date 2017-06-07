import _ from 'lodash';

export const getEntryFetchStatus = (state, entryId) => _.get(state, `entities.entries.fetchStatus.${entryId}`);
