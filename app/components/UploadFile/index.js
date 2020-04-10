/**
 *
 * UploadFile
 *
 */

import React, { memo, useRef } from 'react';
import PropTypes from 'prop-types';
import PlusIcon from '@material-ui/icons/AddCircle';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Container, Input, Layer } from './styledComponents';

function UploadFile({
  image,
  isAction,
  onFilesSelected,
  type,
  name,
  loading,
  progress,
}) {
  const filesRef = useRef(null);

  const handleChangeFiles = () => {
    const files = Array.from(filesRef.current.files);
    onFilesSelected(files);
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
          <CircularProgress variant="static" value={progress} />
        </div>
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
};

export default memo(UploadFile);
