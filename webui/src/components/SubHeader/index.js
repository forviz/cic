import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

const SubHeader = styled.div`
  padding: 10px 0 8px;
  border-bottom: 1px solid #ccc;
  margin: 10px 0 15px;
`;

const Text = styled.span`
  font-size: 24px;
  font-weight: normal;
`;

const SubHeaderComponent = ({ title }) => (
  <SubHeader>
    <Text>{title}</Text>
  </SubHeader>
);

SubHeaderComponent.propTypes = {
  title: T.string,
};

SubHeaderComponent.defaultProps = {
  title: '',
};

export default SubHeaderComponent;
