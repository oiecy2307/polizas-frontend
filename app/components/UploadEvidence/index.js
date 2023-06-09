/**
 *
 * UploadEvidence
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getFileType, getIsImage } from 'utils/helper';

import UploadFile from 'components/UploadFile';
import { wsUploadEvidence } from 'services/tickets';
import { Container } from './styledComponents';

const getDataUrl = file =>
  new Promise(resolve => {
    const isImageType = getIsImage(file.name);

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

function UploadEvidence({ onFilesUploaded, dispatch, defaultEvidence }) {
  const [files, setFiles] = useState([]);
  const [filesToServer, setFilesToServer] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    if (!defaultEvidence || !defaultEvidence.length) return;
    const newEvidence = defaultEvidence.map(f => ({
      image: f.url,
      key: f.fileName,
      loading: false,
      name: f.fileName,
      progress: 0,
      type: getFileType(f.fileName),
      file: f,
    }));
    setFiles(newEvidence);
    setUploadedFiles(newEvidence);
  }, []);

  useEffect(() => {
    if (filesToServer.length) {
      handleUploadFiles(filesToServer);
    }
  }, [filesToServer]);

  useEffect(() => {
    onFilesUploaded(uploadedFiles.map(f => f.file.id));
  }, [uploadedFiles]);

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
        progress: parseInt((loaded / total) * 100, 10),
      };
      return toUpdateFiles;
    });
  };

  const handleUploadFiles = async filesToUpload => {
    try {
      filesToUpload.forEach(file => {
        wsUploadEvidence(file.file, e => handleUpdateFileState(file, e)).then(
          response => {
            setUploadedFiles(uf => [...uf, { ...file, ...response.data }]);
            setFiles(sFiles => {
              const toUpdateFiles = [...sFiles];
              const index = toUpdateFiles.findIndex(f => f.key === file.key);
              toUpdateFiles[index] = {
                ...file,
                loading: false,
              };
              return toUpdateFiles;
            });
          },
        );
      });
    } catch (e) {
      // ERROR HANDLER
    }
  };

  const handleDeleteFile = file => {
    setFiles(sFiles => {
      const nFiles = [...sFiles];
      return nFiles.filter(f => f.key !== file.key);
    });
    setUploadedFiles(sUploadedFiles => {
      const nUploadedFiles = [...sUploadedFiles];
      return nUploadedFiles.filter(f => f.key !== file.key);
    });
  };

  return (
    <Container>
      {files.map(f => (
        <UploadFile key={f.key} {...f} onDelete={() => handleDeleteFile(f)} />
      ))}
      <UploadFile
        dispatch={dispatch}
        isAction
        onFilesSelected={handleFilesSelected}
      />
    </Container>
  );
}

UploadEvidence.propTypes = {
  onFilesUploaded: PropTypes.func,
  dispatch: PropTypes.func,
  defaultEvidence: PropTypes.array,
};

export default memo(UploadEvidence);
