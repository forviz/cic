import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Button, Row, Col, Form, Input } from 'antd';

import * as Actions from './actions';
import { getActiveSpace, getActiveApiKey } from '../../../selectors';

class ApiKeySingle extends Component {

  static propTypes = {
    space: PropTypes.object,
    contentType: PropTypes.object,
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const { updateApiKey } = this.props.actions;
        updateApiKey(values.spaceId, values._id, { name: values.name });
      }
    });
  }

  createFormRef = (form) => {
    this.form = form;
  }

  render() {
    const { space, apiKey, form } = this.props;
    const { getFieldDecorator } = form;
    const fieldValues = {
      _id: apiKey._id,
      name: apiKey.name,
      spaceId: space._id,
      deliveryKey: apiKey.deliveryKey,
      previewKey: apiKey.previewKey,
    }

    if (!space) return (<div />);

    return (
      <div>
        <Row>
          <Col>
            <h2>Single Api</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form onSubmit={this.handleSubmit}>
              <Form.Item>
                {getFieldDecorator('_id', {
                  initialValue: _.get(fieldValues, '_id', ''),
                })(
                  <Input type="hidden" />
                )}
              </Form.Item>
              <Form.Item label="Name">
                {getFieldDecorator('name', {
                  initialValue: _.get(fieldValues, 'name', ''),
                  rules: [{ required: true, message: 'Please input the name of key.' }],
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item label="SpaceId">
                {getFieldDecorator('spaceId', {
                  initialValue: _.get(fieldValues, 'spaceId', ''),
                })(
                  <Input disabled />
                )}
              </Form.Item>
              <Form.Item label="Content Delivery API - access token">
                {getFieldDecorator('deliveryKey', {
                  initialValue: _.get(fieldValues, 'deliveryKey', ''),
                })(
                  <Input disabled />
                )}
              </Form.Item>
              <Form.Item label="Content Preview API - access token">
                {getFieldDecorator('previewKey', {
                  initialValue: _.get(fieldValues, 'previewKey', ''),
                })(
                  <Input disabled />
                )}
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    space: getActiveSpace(state, ownProps),
    apiKey: getActiveApiKey(state, ownProps),
  }
}

const actions = {
  updateApiKey: Actions.updateApiKey,
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)( Form.create()(ApiKeySingle));
