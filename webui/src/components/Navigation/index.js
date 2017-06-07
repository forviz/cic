import React, { Component } from 'react';
import T from 'prop-types';
import {
  Link,
} from 'react-router-dom';

import './Navigation.css';

const NavItem = ({ label, prefix = '', path, items = [] }) => (
  <li className="Navigation-item">
    <Link to={`${prefix}${path}`}>{label}</Link>
    {
      items.length > 0 &&
      <ul className="Navigation-subnav">
        {items.map(item => <NavItem {...item} key={`${prefix}${path}`} prefix={path} />)}
      </ul>
    }
  </li>);

NavItem.propTypes = {
  label: T.string,
  prefix: T.string,
  path: T.string.isRequired,
  items: T.arrayOf(T.shape({
    label: T.string,
  })),
};

NavItem.defaultProps = {
  label: '',
  prefix: '',
  items: [],
};

export default class Navigation extends Component {

  static propTypes = {
    items: T.arrayOf(T.shape({
      label: T.string.isRequired,
      path: T.string.isRequired,
    })),
  }

  static defaultProps = {
    items: [],
  }

  render() {
    const { items } = this.props;
    return (
      <div className="Navigation-bar">
        <ul className="Navigation">
          {
            items.map(item => <NavItem {...item} key={`${item.path}`} />)
          }
        </ul>
      </div>
    );
  }
}
