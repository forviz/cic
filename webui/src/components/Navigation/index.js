import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Link
} from 'react-router-dom';

import './Navigation.css';


const NavItem = ({ label, prefix = '', path, items = [] }) => {
  return (
    <li className="Navigation-item">
      <Link to={`${prefix}${path}`}>{label}</Link>
      {
        items.length > 0 &&
        <ul className="Navigation-subnav">
        {
          items.map(item => <NavItem {...item} key={`${prefix}${path}`} prefix={path} />)
        }
        </ul>
      }
    </li>
  );
};

export default class Navigation extends Component {

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })),
  }

  render() {
    const { items } = this.props;
    return (
      <div className="Navigation-bar">
        <ul className="Navigation">
        {
          items.map(item =>
            <NavItem {...item} key={`${item.path}`} />
          )
        }
        </ul>
      </div>
    )
  }
};
