/**
 *
 * CommentItem
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { getFullName, getCurrentUser } from 'utils/helper';
import moment from 'moment/min/moment-with-locales';

import Avatar from 'components/Avatar';
import DeleteIcon from '@material-ui/icons/Delete';

import { Container } from './styledComponents';

function CommentItem({ comment, onDelete }) {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    handleSetCurrentUser();
  }, []);

  const handleSetCurrentUser = async () => {
    setCurrentUser(await getCurrentUser());
  };

  const userFullName = getFullName(comment.user);
  const time = moment(get(comment, 'createdAt', new Date())).fromNow();
  const canDelete = currentUser.id === get(comment, 'user.id', '');
  return (
    <Container>
      <Avatar src={get(comment, 'user.image', '')} name={userFullName} />
      <div className="content">
        <div className="header">
          <div>
            <b>{userFullName}</b> <span>{time}</span>
          </div>
          {canDelete && <DeleteIcon onClick={() => onDelete(comment.id)} />}
        </div>
        <div>{comment.text}</div>
      </div>
    </Container>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.object,
  onDelete: PropTypes.func,
};

export default memo(CommentItem);
