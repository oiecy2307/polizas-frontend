/**
 *
 * UserProfile
 *
 */

import React, { memo, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { wsUploadEvidence } from 'services/tickets';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectUserProfile from './selectors';
import reducer from './reducer';
import messages from './messages';

export function UserProfile() {
  useInjectReducer({ key: 'userProfile', reducer });

  const filesRef = useRef(null);
  console.log('filesRef', filesRef);

  const handleChangeFiles = async () => {
    const files = Array.from(filesRef.current.files);
    try {
      const response = await wsUploadEvidence(files[0], 1);
      console.log('response', response);
    } catch (e) {
      console.error(e);
    }
    console.log('filesRef.current.files', files);
  };

  return (
    <div>
      <Helmet>
        <title>UserProfile</title>
        <meta name="description" content="Description of UserProfile" />
      </Helmet>
      <FormattedMessage {...messages.header} />
      <input
        ref={filesRef}
        type="file"
        value=""
        onChange={handleChangeFiles}
        multiple
      />
    </div>
  );
}

UserProfile.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  userProfile: makeSelectUserProfile(),
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
)(UserProfile);
