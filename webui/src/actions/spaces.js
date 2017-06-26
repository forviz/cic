import _ from 'lodash';
import { fetchCreateSpace, fetchUpdateSpace, fetchDeleteSpace } from '../api/cic/spaces';
import { fetchCreateContentType } from '../api/cic/contentTypes';
import { openNotification } from './notification';
import { cic } from '../App';
import { getSpaceFetchStatus } from '../selectors/spaces';
import { handleError } from './application';

export const receiveSpace = (spaceId, space) => {
  return {
    type: 'ENTITIES/SPACE/RECEIVED',
    spaceId,
    space,
  };
};


export const getSpace = (spaceId) => {
  return (dispatch, getState) => {
    const fetchStatus = getSpaceFetchStatus(getState(), spaceId);

    // If haven't loaded, do load it from server
    if (fetchStatus !== 'loaded') {
      openNotification('info', { message: 'fetching space' });
      cic.getSpace(spaceId)
      .then((res) => {
        dispatch(receiveSpace(spaceId, res.space));
        openNotification('success', { message: `fetching space ${_.get(res, 'name')} done` });
      });
    }
  };
};

export const createNewSpace = (name, { organizationId, defaultLocale }) => {
  return () => {
    return fetchCreateSpace(name, { organizationId, defaultLocale })
    .then((res) => {
      openNotification('success', { message: 'Space created' });
      return res;
    }).catch((error) => {
      handleError(error);
    });
  };
};

export const updateSpace = (spaceId, { name, defaultLocale }) => {
  return () => {
    fetchUpdateSpace(spaceId, { name, defaultLocale })
    .then((res) => {
      openNotification('success', { message: `Space ${name} Updated` });
      return res;
    });
  };
};

export const deleteSpace = (spaceId, history) => {
  return (dispatch) => {
    return fetchDeleteSpace(spaceId)
    .then((res) => {
      dispatch({ type: 'ENTITITIES/SPACE/DELETE', spaceId });
      openNotification('success', { message: 'Space Deleted' });
      history.push('/');
      return res;
    });
  };
};


export const populateSpaceWithTemplate = (spaceId, template) => {
  return (dispatch) => {
    switch (template) {
      case 'website':
        /* Create Pages, Category, Posts */
        Promise.all([
          fetchCreateContentType(spaceId, {
            name: 'Pages',
            identifier: 'pages',
            description: 'Static page for website',
            displayField: 'title',
            fields: [
              { name: 'Title', identifier: 'title', type: 'Text', required: true },
              { name: 'Detail', identifier: 'detail', type: 'LongText', required: false, localized: true },
            ],
          }),
          fetchCreateContentType(spaceId, {
            name: 'Category',
            identifier: 'category',
            description: 'Post Category',
            displayField: 'title',
            fields: [
              { name: 'Title', identifier: 'title', type: 'Text', required: true },
              { name: 'Detail', identifier: 'detail', type: 'LongText', required: false },
            ],
          }),
          fetchCreateContentType(spaceId, {
            name: 'Posts',
            identifier: 'posts',
            description: 'Blog post',
            displayField: 'title',
            fields: [
              { name: 'Title', identifier: 'title', type: 'Text', required: true },
              { name: 'Detail', identifier: 'detail', type: 'LongText', required: false },
              {
                name: 'Category', identifier: 'category', type: 'Link', required: false, validations: { linkContentType: ['category'] },
              },
              {
                name: 'Tag',
                identifier: 'tag',
                type: 'Array',
                items: {
                  type: 'Link',
                  linkType: 'Entry',
                  validations: [{ linkContentType: ['category'] }],
                },
              },
            ],
          }),
        ], () => {
          dispatch({
            type: 'CREATE/TEMPLATE/COMPLETE',
          });
          openNotification('success', { message: 'Create space with template completed' });
        });
        break;
      case 'condo':
        /* Create UnitType, Unit, Floor */

        Promise.all([
          fetchCreateContentType(spaceId, {
            name: 'Unit Type',
            identifier: 'unit-type',
            description: 'Property Type (1 Bedroom, 2 Bedroom, etc)',
            displayField: 'title',
            fields: [
              { name: 'Title', identifier: 'title', type: 'Text', required: true },
              {
                name: 'Gallery',
                identifier: 'gallery',
                type: 'Array',
                items: {
                  type: 'Link',
                  linkType: 'Asset',
                },
                required: false,
              },
            ],
          }),
          fetchCreateContentType(spaceId, {
            name: 'Unit',
            identifier: 'unit',
            description: 'Property Unit (Room, Home, Space, etc)',
            displayField: 'title',
            fields: [
              { name: 'Title', identifier: 'title', type: 'Text', required: true },
              { name: 'Size', identifier: 'size', type: 'Number' },
              { name: 'Floor', identifier: 'floor', type: 'Number' },
              { name: 'Price', identifier: 'price', type: 'Number' },
              { name: 'Tag', identifier: 'tag', type: 'Array', items: { type: 'Symbol' } },
              { name: 'Type', identifier: 'type', type: 'Link', validations: { linkContentType: ['unit-type'] } },
            ],
          }),
          fetchCreateContentType(spaceId, {
            name: 'Gallery',
            identifier: 'gallery',
            description: 'Project Gallery',
            displayField: 'title',
            fields: [
              { name: 'Title', identifier: 'title', type: 'Text', required: true },
              { name: 'Detail', identifier: 'detail', type: 'LongText', required: false },
              { name: 'Category', identifier: 'category', type: 'Link', required: false, validations: { linkContentType: ['category'] } },
            ],
          }),
        ], () => {
          dispatch({
            type: 'CREATE/TEMPLATE/COMPLETE',
          });
          openNotification('success', { message: 'Create space with template completed' });
        });
        break;
      case 'directory':
        /* Create Shop, , Category, Floor, Facilities */

        Promise.all([
          fetchCreateContentType(spaceId, {
            name: 'Shop',
            identifier: 'shop',
            description: 'Tenant in store',
            displayField: 'title',
            fields: [
              { name: 'Title', identifier: 'title', type: 'Text', required: true },
              { name: 'Category', identifier: 'type', type: 'Link', validations: { linkContentType: ['category'] } },
              { name: 'Floor', identifier: 'type', type: 'Link', validations: { linkContentType: ['floor'] } },
              {
                name: 'Logo',
                identifier: 'logo',
                type: 'Media',
              },
              {
                name: 'Gallery',
                identifier: 'gallery',
                type: 'Array',
                items: {
                  type: 'Media',
                },
                required: false,
              },
            ],
          }),
          fetchCreateContentType(spaceId, {
            name: 'Category',
            identifier: 'category',
            description: 'Shop Category',
            displayField: 'title',
            fields: [
              { name: 'Title', identifier: 'title', type: 'Text', required: true },
              { name: 'Detail', identifier: 'detail', type: 'LongText', required: false },
            ],
          }),
          fetchCreateContentType(spaceId, {
            name: 'Floor',
            identifier: 'floor',
            description: 'Store Floor',
            displayField: 'title',
            fields: [
              { name: 'Title', identifier: 'title', type: 'Text', required: true },
            ],
          }),
        ], () => {
          dispatch({
            type: 'CREATE/TEMPLATE/COMPLETE',
          });
          openNotification('success', { message: 'Create space with template completed' });
        });
        break;
      default: break;
    }
  };
};
