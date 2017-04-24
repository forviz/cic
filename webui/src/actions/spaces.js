import { fetchSpace, fetchCreateSpace, fetchUpdateSpace } from '../api/cic/spaces';
import { fetchCreateContentType } from '../api/cic/contentTypes';
// import { upload } from '../../api/cic/assets';

// Fetch Space Info
export const getSpace = (spaceId) => {
  return (dispatch) => {
    fetchSpace(spaceId)
    .then((space) => {
      dispatch({
        type: 'SPACE/UPDATE/RECEIVED',
        spaceId,
        space,
      });
    });
  };
};


export const createNewSpace = (name, { defaultLocale }) => {

  return (dispatch) => {
    return fetchCreateSpace(name, { defaultLocale })
    .then((res) => {
      console.log('createSpace', res);
      return res;
    });
  };
};

export const updateSpace = (spaceId, { name, defaultLocale }) => {
  return (dispatch) => {
    fetchUpdateSpace(spaceId, { name, defaultLocale })
    .then((res) => {
      console.log('updateSpace', res);
    });
  };
};


export const populateSpaceWithTemplate = (spaceId, template) => {
  console.log('populateSpaceWithTemplate', spaceId, template);
  return (dispatch) => {
    switch (template) {
      case 'website':
        /* Create Pages, Category, Posts */

        return Promise.all([
          fetchCreateContentType(spaceId, {
            name: 'Pages',
            identifier: 'pages',
            description: 'Static page for website',
            displayField: 'title',
            fields: [
              { name: 'Title', identifier: 'title', type: 'Text', required: true },
              { name: 'Detail', identifier: 'detail', type: 'LongText', required: false, localized: true }
            ],
          }),
          fetchCreateContentType(spaceId, {
            name: 'Category',
            identifier: 'category',
            description: 'Post Category',
            displayField: 'title',
            fields: [
              { name: 'Title', identifier: 'title', type: 'Text', required: true },
              { name: 'Detail', identifier: 'detail', type: 'LongText', required: false }
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
                name: 'Category', identifier: 'category', type: 'Link', required: false, validations:{ linkContentType: ['category'] }
              },
              {
                name: 'Tag',
                identifier: 'tag',
                type: 'Array',
                items: {
                  type: "Link",
                  linkType: "Entry",
                  validations: [
                    {
                      linkContentType: [
                        "category"
                      ]
                    }
                  ]
                },
              },
            ],
          }),
        ], (response) => {
          dispatch({
            type: 'CREATE/TEMPLATE/COMPLETE',
          });
        });
        break;
      case 'condo':
        /* Create UnitType, Unit, Floor */

        return Promise.all([
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
                  linkType: 'Asset'
                }, required: false
              }
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
              {
                name: 'Tag',
                identifier: 'tag',
                type: 'Array',
                items: {
                  type: 'Symbol',
                }
              },
              { name: 'Type', identifier: 'type', type: 'Link', validations:{ linkContentType: ['unit-type'] } },
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
              { name: 'Category', identifier: 'category', type: 'Link', required: false, validations:{ linkContentType: ['category'] }},
            ],
          }),
        ], (response) => {
          dispatch({
            type: 'CREATE/TEMPLATE/COMPLETE',
          });
        });
        break;
      case 'directory':
        /* Create Shop, , Category, Floor, Facilities */

        return Promise.all([
          fetchCreateContentType(spaceId, {
            name: 'Shop',
            identifier: 'shop',
            description: 'Tenant in store',
            displayField: 'title',
            fields: [
              { name: 'Title', identifier: 'title', type: 'Text', required: true },
              { name: 'Category', identifier: 'type', type: 'Link', validations:{ linkContentType: ['category'] } },
              { name: 'Floor', identifier: 'type', type: 'Link', validations:{ linkContentType: ['floor'] } },
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
                }, required: false
              }
            ],
          }),
          fetchCreateContentType(spaceId, {
            name: 'Category',
            identifier: 'category',
            description: 'Shop Category',
            displayField: 'title',
            fields: [
              { name: 'Title', identifier: 'title', type: 'Text', required: true },
              { name: 'Detail', identifier: 'detail', type: 'LongText', required: false }
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
        ], (response) => {
          dispatch({
            type: 'CREATE/TEMPLATE/COMPLETE',
          });
        });
        break;
      default: break;
    }
  }
}
