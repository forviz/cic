import React, { Component } from 'react';
import T from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  Route,
  Link,
} from 'react-router-dom';

import { Layout, Breadcrumb, Spin } from 'antd';
import SpaceSidebar from './Sidebar';

import ContentTypeListContainer from './ContentType/list';
import ContentTypeSingleContainer from './ContentType/single';
import EntryListContainer from './Entry/list';
import EntrySingleContainer from './Entry/single';
import AssetListContainer from './Asset/list';
import AssetSingleContainer from './Asset/single';
import SpaceApiKeyContainer from './ApiKeys/list';
import SpaceApiKeySingleContainer from './ApiKeys/single';
import SpaceSettingContainer from './Settings';

import { fetchSpace, fetchSpaceEntries } from '../../api/cic/spaces';

import * as SpaceActions from '../../actions/spaces';
import * as EntryActions from '../../actions/entries';
import { getSpaceId, getActiveSpace } from '../../selectors';

const { Content, Sider } = Layout;

const mapStateToProps = (state, ownProps) => {
  return {
    spaceId: getSpaceId(ownProps),
    space: getActiveSpace(state, ownProps),
  };
};

const mapActions = {
  initWithSpaceId: (spaceId) => {
    return (dispatch) => {
      fetchSpace(spaceId)
      .then((space) => {
        dispatch(SpaceActions.receiveSpace(spaceId, space));
        fetchSpaceEntries(spaceId)
        .then((entries) => {
          _.forEach(entries, (entry) => {
            dispatch(EntryActions.receiveEntry(entry._id, entry));
          });
        });
      });
    };
  },
  // getSpace: SpaceActions.getSpace,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(mapActions, dispatch),
  };
};

class Space extends Component {

  static propTypes = {
    spaceId: T.string.isRequired,
    space: T.shape({
      name: T.string,
    }).isRequired,
    actions: T.shape({
      getSpace: T.func,
    }).isRequired,
  }

  static defaultProps = {
    space: {},
  }

  constructor(props) {
    super(props);
    const { spaceId, actions } = props;
    const { initWithSpaceId } = actions;
    initWithSpaceId(spaceId);
  }

  render() {
    const { space } = this.props;
    if (!space) return (<Spin />);

    const routes = [
      {
        path: '/spaces/:spaceId/content_types',
        exact: true,
        main: ContentTypeListContainer,
      },
      {
        path: '/spaces/:spaceId/content_types/:contentTypeId',
        exact: true,
        main: ContentTypeSingleContainer,
      },
      {
        path: '/spaces/:spaceId/entries',
        exact: true,
        main: EntryListContainer,
      },
      {
        path: '/spaces/:spaceId/entries/:entryId',
        exact: true,
        main: EntrySingleContainer,
      },
      {
        path: '/spaces/:spaceId/assets',
        exact: true,
        main: AssetListContainer,
      },
      {
        path: '/spaces/:spaceId/assets/:assetId',
        exact: true,
        main: AssetSingleContainer,
      },
      {
        path: '/spaces/:spaceId/api/keys',
        exact: true,
        main: SpaceApiKeyContainer,
      },
      {
        path: '/spaces/:spaceId/api/keys/:keyId',
        extact: true,
        main: SpaceApiKeySingleContainer,
      },
      {
        path: '/spaces/:spaceId/settings',
        exact: true,
        main: SpaceSettingContainer,
      },
    ];

    return (
      <div>
        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <Route
              key="space-sidebar"
              path="/spaces/:spaceId"
              exact={false}
              component={SpaceSidebar}
            />
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb style={{ margin: '12px 0' }}>
              <Breadcrumb.Item>{space.name}</Breadcrumb.Item>
              <Breadcrumb.Item>
                <Route path="/spaces/:spaceId/content_types" render={() => <Link to={`/spaces/${space._id}/content_types`}>Content Type</Link>} />
                <Route path="/spaces/:spaceId/entries" render={() => <Link to={`/spaces/${space._id}/entries`}>Entries</Link>} />
                <Route path="/spaces/:spaceId/assets" render={() => <Link to={`/spaces/${space._id}/assets`}>Assets</Link>} />
                <Route path="/spaces/:spaceId/api/keys" render={() => <Link to={`/spaces/${space._id}/api/keys`}>API Keys</Link>} />
                <Route path="/spaces/:spaceId/settings" render={() => <Link to={`/spaces/${space._id}/settings`}>Settings</Link>} />
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Route
                  path="/spaces/:spaceId/content_types/:contentTypeId"
                  render={({ match }) => <span>{_.get(_.find(space.contentTypes, ct => ct._id === match.params.contentTypeId), 'name')}</span>}
                />
                <Route path="/spaces/:spaceId/entries/:entryId" render={({ match }) => <span>{match.params.entryId}</span>} />
              </Breadcrumb.Item>
            </Breadcrumb>
            <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
              {
                routes.map(route =>
                  (<Route
                    key={route.path}
                    path={route.path}
                    exact={route.exact}
                    component={route.main}
                  />))
              }
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Space);
