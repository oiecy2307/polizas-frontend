/**
 *
 * ExpandableItem
 *
 */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import ArrowExpandableIcon from '@material-ui/icons/KeyboardArrowDown';
import {
  Container,
  Header,
  IconContainer,
  ExpandedSection,
  Content,
} from './styledComponents';

const iconStyle = {
  color: '#919EAB',
  fontSize: 24,
  cursor: 'pointer',
};

function ExpandableItem({ header, content }) {
  const [expanded, setExpanded] = useState(false);
  const handleExpand = () => {
    setExpanded(!expanded);
  };
  return (
    <Container>
      <Header onClick={handleExpand}>
        {header}
        <IconContainer expanded={expanded}>
          <ArrowExpandableIcon style={{ ...iconStyle }} />
        </IconContainer>
      </Header>
      <ExpandedSection expanded={expanded}>
        <Content>{content}</Content>
      </ExpandedSection>
    </Container>
  );
}

ExpandableItem.propTypes = {
  header: PropTypes.any,
  content: PropTypes.any,
};

export default memo(ExpandableItem);
