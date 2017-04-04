import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { Menu } from 'antd';
// const { SubMenu } = Menu;
//
import { NavLink } from 'react-router-dom';

import { getActiveSpace } from '../../selectors';

const mapStateToProps = (state, ownProps) => {
  return {
    location: _.get(ownProps, 'location'),
    space: getActiveSpace(state, ownProps),
  }
};

class SpaceSidebar extends Component {

  render() {

    const { space, location } = this.props;
    if (!space) return (<div />);

    const spaceId = space._id;

    let selectedKeys = [];
    if (_.includes(location.pathname, 'content_types')) selectedKeys = [`/spaces/${spaceId}/content_types`];
    if (_.includes(location.pathname, 'entries')) selectedKeys = [`/spaces/${spaceId}/entries`];
    if (_.includes(location.pathname, 'assets')) selectedKeys = [`/spaces/${spaceId}/assets`];
    if (_.includes(location.pathname, 'api/keys')) selectedKeys = [`/spaces/${spaceId}/api/keys`];
    if (_.includes(location.pathname, 'settings')) selectedKeys = [`/spaces/${spaceId}/settings`];

    return (
      <div>
        <h2 style={{ padding: 15 }}>{space.name}</h2>
        <Menu selectedKeys={selectedKeys}>
          <Menu.Item key={`/spaces/${spaceId}/content_types`}>
            <NavLink to={`/spaces/${spaceId}/content_types`}>Content Types</NavLink>
          </Menu.Item>
          <Menu.Item key={`/spaces/${spaceId}/entries`}>
            <NavLink to={`/spaces/${spaceId}/entries`}>Entries</NavLink>
          </Menu.Item>
          <Menu.Item key={`/spaces/${spaceId}/assets`}>
            <NavLink to={`/spaces/${spaceId}/assets`}>Assets</NavLink>
          </Menu.Item>
          <Menu.Item key={`/spaces/${spaceId}/api/keys`}>
            <NavLink to={`/spaces/${spaceId}/api/keys`}>API Keys</NavLink>
          </Menu.Item>
          <Menu.Item key={`/spaces/${spaceId}/settings`}>
            <NavLink to={`/spaces/${spaceId}/settings`}>Settings</NavLink>
          </Menu.Item>
        </Menu>
      </div>
    )
  }
}

export default connect(mapStateToProps)(SpaceSidebar);
