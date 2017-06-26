import React from 'react';
import styled from 'styled-components';
import { Card } from 'antd';

import { primaryColor } from '../../styles/colors';

const StyledCard = styled(Card)`
  margin-bottom: 16px;
  textAlign: left;
`;

const CardContent = styled.div`
  padding: 10px 16px;
  color: ${primaryColor};
`;

const CardImage = styled.img`
  max-width: 100%;
  backgroundColor: #f7f7f7;
`;

const CardHeader = styled.h3`
  color: rgba(0, 0, 0, 0.65);
`;

const CardDetail = styled.p`
  color: #666;
`;

const SpaceCard = ({ title, description = '', index }) => {
  return (
    <StyledCard loading={false} bodyStyle={{ padding: 0 }}>
      <CardImage src={`http://lorempixel.com/400/200/abstract/${index}`} alt="" />
      <CardContent>
        <CardHeader>{title}</CardHeader>
        <CardDetail>{description}</CardDetail>
      </CardContent>
    </StyledCard>
  );
};

export default SpaceCard;
