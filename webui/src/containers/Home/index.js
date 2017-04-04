import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Link } from 'react-router-dom';

import * as Actions from './actions';

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      initPage: Actions.initPage,
      createSpace: Actions.createSpace,
      uploadImage: Actions.uploadImage,
    }, dispatch),
  };
}
class Home extends Component {

  constructor(props) {
    super(props);
    this.handleAddSpace = this.handleAddSpace.bind(this);
    this.handleUploadImage = this.handleUploadImage.bind(this);
  }

  // componentDidMount() {
  //   const { actions } = this.props;
  //   actions.initPage();
  // }

  handleAddSpace() {
    const { actions } = this.props;
    const name = 'Space2';
    actions.createSpace(name);
  }

  handleUploadImage() {
    const { actions } = this.props;
    const file = 'Space2';
    actions.uploadImage(file);
  }

  render() {
    console.log('render', this.props);
    const { user } = this.props;
    const { spaces } = user;

    return (
      <div>
        <div className="row">
          <div className="col-sm-12">
            <div className="btn-toolbar" role="toolbar" aria-label="...">
              <button type="button" className="btn btn-default pull-right" onClick={this.handleAddSpace}>+ Add Space</button>
              <button type="button" className="btn btn-default pull-right" onClick={this.handleUploadImage}>Upload Image</button>
            </div>
          </div>
        </div>
        <div className="row">
          {
            _.map(spaces, (space) =>
              <div className="col-sm-4" key={space._id}>
                <div className="card">
                  <h3>{space.name || 'No name'}</h3>
                  <p>{space.updatedAt}</p>
                  <Link to={`/space/${space._id}`} className="btn btn-default">ENTER</Link>
                </div>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
