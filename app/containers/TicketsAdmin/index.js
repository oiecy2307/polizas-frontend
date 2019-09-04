/**
 *
 * TicketsAdmin
 *
 */

import React, { memo, useState } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import Calendar from 'components/SelectableCalendar';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { TabButton } from 'utils/globalStyledComponents';
import PorAsignar from './privateComponents/porAsignar';
import makeSelectTicketsAdmin from './selectors';
import reducer from './reducer';
import saga from './saga';
import { Content, LeftSection } from './styledComponents';

export function TicketsAdmin() {
  useInjectReducer({ key: 'ticketsAdmin', reducer });
  useInjectSaga({ key: 'ticketsAdmin', saga });
  const [optionSelected, setOptionSelected] = useState('porAsignar');

  const handleSelectOption = option => () => {
    setOptionSelected(option);
  };

  return (
    <div>
      <Helmet>
        <title>Tickets</title>
        <meta name="description" content="Description of TicketsAdmin" />
      </Helmet>
      <div>
        <TabButton
          selected={optionSelected === 'porAsignar'}
          onClick={handleSelectOption('porAsignar')}
        >
          Por asignar
        </TabButton>
        <TabButton
          selected={optionSelected === 'abiertos'}
          onClick={handleSelectOption('abiertos')}
        >
          Abiertos
        </TabButton>
        <TabButton
          selected={optionSelected === 'cerrados'}
          onClick={handleSelectOption('cerrados')}
        >
          Cerrados
        </TabButton>
      </div>
      <Content>
        <LeftSection>
          <PorAsignar />
        </LeftSection>
        <Calendar responsive maxResponsive={1190} />
      </Content>
    </div>
  );
}

TicketsAdmin.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  ticketsAdmin: makeSelectTicketsAdmin(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(TicketsAdmin);
