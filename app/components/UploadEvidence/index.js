/**
 *
 * UploadEvidence
 *
 */

import React, { memo, useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import UploadFile from 'components/UploadFile';
import { wsUploadEvidence } from 'services/tickets';
import { Container } from './styledComponents';

const getFileType = fileName => {
  const stringSections = fileName.split('.');
  return stringSections[stringSections.length - 1];
};

const getDataUrl = file =>
  new Promise(resolve => {
    const type = getFileType(file.name);
    const isImageType = type === 'png' || type === 'jpg' || type === 'jpge';

    if (!isImageType) {
      resolve('');
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      resolve(ev.target.result);
    };
    reader.readAsDataURL(file);
  });

function UploadEvidence() {
  const [files, setFiles] = useState([]);
  const [filesToServer, setFilesToServer] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    if (filesToServer.length) {
      handleUploadFiles(filesToServer);
    }
  }, [filesToServer]);

  console.log('filesfilesfiles', files);
  console.log('uploadedFiles', uploadedFiles);
  const handleFilesSelected = async newFiles => {
    const lNewFiles = [];
    const filesLocalUrls = await Promise.all(newFiles.map(f => getDataUrl(f)));
    newFiles.forEach((f, i) => {
      lNewFiles.push({
        file: f,
        image: filesLocalUrls[i],
        type: getFileType(f.name),
        name: f.name,
        key: `${new Date().getTime()}-${f.name}`,
        loading: true,
        progress: 0,
      });
    });
    setFiles([...files, ...lNewFiles]);
    setFilesToServer(lNewFiles);
  };

  const handleUpdateFileState = (file, { loaded = 1, total = 1 }) => {
    setFiles(sFiles => {
      const toUpdateFiles = [...sFiles];
      const index = toUpdateFiles.findIndex(f => f.key === file.key);
      toUpdateFiles[index] = {
        ...file,
        loading: loaded < total,
        progress: parseInt((loaded / total) * 100, 10),
      };
      return toUpdateFiles;
    });
  };

  const handleUploadFiles = async filesToUpload => {
    try {
      filesToUpload.forEach(file => {
        wsUploadEvidence(file.file, 1, e =>
          handleUpdateFileState(file, e),
        ).then(response => setUploadedFiles(uf => [...uf, response.data]));
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container>
      {files.map(f => (
        <UploadFile key={f.key} {...f} />
      ))}
      <UploadFile isAction onFilesSelected={handleFilesSelected} />
    </Container>
  );
}

UploadEvidence.propTypes = {};

export default memo(UploadEvidence);
