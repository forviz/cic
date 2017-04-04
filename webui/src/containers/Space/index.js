import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  Route,
} from 'react-router-dom'


import { Layout, Breadcrumb } from 'antd';
const { Content, Sider } = Layout;

import SpaceSidebar from './Sidebar';

import ContentTypeListContainer from './ContentType/list';
import ContentTypeSingleContainer from './ContentType/single';
import EntryListContainer from './Entry/list';
import EntrySingleContainer from './Entry/single';
import SpaceApiKeyContainer from './ApiKeys/list';
import SpaceApiKeySingleContainer from './ApiKeys/single';
import SpaceSettingContainer from './Settings';

import * as Actions from './actions';
import { getActiveSpace } from '../../selectors';

const mapStateToProps = (state, ownProps) => {

  return {
    space: getActiveSpace(state, ownProps),
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      initWithSpaceId: Actions.initWithSpaceId,
    }, dispatch),
  };
}

class Space extends Component {

  render() {
    const { space } = this.props;
    if (!space) return (<div />);

    const routes = [
      {
        path: '/spaces/:spaceId/content_types',
        exact: true ,
        main: ContentTypeListContainer,
      },
      {
        path: '/spaces/:spaceId/content_types/:contentTypeId',
        exact: true,
        main: ContentTypeSingleContainer,
      },
      {
        path: '/spaces/:spaceId/entries',
        exact: true ,
        main: EntryListContainer
      },
      {
        path: '/spaces/:spaceId/entries/:entryId',
        exact: true ,
        main: EntrySingleContainer
      },
      {
        path: '/spaces/:spaceId/api/keys',
        exact: true ,
        main: SpaceApiKeyContainer
      },
      {
        path: '/spaces/:spaceId/api/keys/:keyId',
        extact: true,
        main: SpaceApiKeySingleContainer,
      },
      {
        path: '/spaces/:spaceId/settings',
        exact: true ,
        main: SpaceSettingContainer
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
                <Route path="/spaces/:spaceId/content_types" render={() => <span>Content Type</span>} />
                <Route path="/spaces/:spaceId/entries" render={() => <span>Entries</span>} />
                <Route path="/spaces/:spaceId/assets" render={() => <span>Assets</span>} />
                <Route path="/spaces/:spaceId/api/keys" render={() => <span>API Keys</span>} />
                <Route path="/spaces/:spaceId/settings" render={() => <span>Settings</span>} />
              </Breadcrumb.Item>
            </Breadcrumb>
            <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
              {
                routes.map((route, index) =>
                  <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    component={route.main}
                  />)
              }
            </Content>
          </Layout>
        </Layout>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Space);
