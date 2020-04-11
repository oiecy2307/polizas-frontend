/**
 *
 * UploadFile
 *
 */

import React, { memo, useRef } from 'react';
import PropTypes from 'prop-types';
import PlusIcon from '@material-ui/icons/AddCircle';
import GarbageIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { aOpenSnackbar } from 'containers/App/actions';

import { Container, Input, Layer, Div } from './styledComponents';

function UploadFile({
  image,
  isAction,
  onFilesSelected,
  type,
  name,
  loading,
  progress,
  onDelete,
  dispatch,
}) {
  const filesRef = useRef(null);

  const handleChangeFiles = () => {
    const files = Array.from(filesRef.current.files);
    if (files.some(f => f.size > 50 * 1000000)) {
      dispatch(aOpenSnackbar('El tamaño máximo es de 50MB', 'error'));
    }
    const filteredFiles = files.filter(f => f.size <= 50 * 1000000);
    if (filteredFiles.length) onFilesSelected(filteredFiles);
  };

  const handleOpenFileInput = () => {
    filesRef.current.click();
  };

  if (isAction) {
    return (
      <Container onClick={handleOpenFileInput}>
        <PlusIcon />
        <div className="note">50MB máximo</div>
        <Input
          ref={filesRef}
          type="file"
          value=""
          onChange={handleChangeFiles}
          multiple
        />
      </Container>
    );
  }

  const isImageType = type === 'png' || type === 'jpg' || type === 'jpge';

  return (
    <Container>
      {isImageType ? (
        <img src={image} alt="evidence" />
      ) : (
        <div className="data-type">{name}</div>
      )}
      {loading && <Layer />}
      {loading && (
        <div className="absolute">
          <CircularProgress
            variant={progress < 100 ? 'static' : 'indeterminate'}
            value={progress}
          />
        </div>
      )}
      {!loading && (
        <Div className="absolute delete" onClick={onDelete}>
          <GarbageIcon />
        </Div>
      )}
    </Container>
  );
}

UploadFile.propTypes = {
  image: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  isAction: PropTypes.bool,
  onFilesSelected: PropTypes.func,
  loading: PropTypes.bool,
  progress: PropTypes.number,
  onDelete: PropTypes.func,
  dispatch: PropTypes.func,
};

UploadFile.defaultProps = {
  onDelete: () => {},
};

export default memo(UploadFile);
