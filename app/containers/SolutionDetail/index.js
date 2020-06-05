/**
 *
 * SolutionDetail
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import { get, times } from 'lodash';
import HtmlParser from 'html-react-parser';

import { wsGetSolutionById, wsUpdateSolution } from 'services/solutions';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import { wsGetProductsBrief } from 'services/products';

import Skeleton from '@material-ui/lab/Skeleton';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { stateToHTML } from 'draft-js-export-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { Divider, FloatRight } from 'utils/globalStyledComponents';
import Input from 'components/InputText';
import CommentItem from 'components/CommentItem';
import Button from 'components/Button';
import EmptyState from 'components/EmptyState';
import Dialog from 'components/Dialog';
import CreateEditSolution from 'components/CreateEditSolution';

import {
  Container,
  TopSection,
  Header,
  Body,
  MainContainer,
  EditorWrapper,
} from './styledComponents';

export function SolutionDetail({ dispatch, match }) {
  const [notFound, setNotFound] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [solution, setSolution] = useState({});
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isEditing, setIsEditing] = useState(false);
  const [attributeEditing, setAttributeEditing] = useState('problem');
  const [editSolutionOpen, setEditSolutionOpen] = useState(false);
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    fetchSolution();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await wsGetProductsBrief();
      const lProducts = get(response, 'data', []);
      setProductsList(lProducts);
    } catch (e) {
      // ERROR HANDLER
    }
  };

  const fetchSolution = async () => {
    try {
      const id = get(match, 'params.id', null);
      if (!id) return;
      dispatch(aSetLoadingState(true));
      const response = await wsGetSolutionById(id);
      if (!response || response.error) {
        dispatch(aOpenSnackbar('No fue posible obtener solución', 'error'));
        setNotFound(true);
        return;
      }
      if (!response.data) setNotFound(true);
      else setSolution(response.data);
    } catch (e) {
      setNotFound(true);
      dispatch(aOpenSnackbar('No fue posible obtener solución', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
      setInitialLoading(false);
    }
  };

  const handleDeleteComment = () => {};

  const onEditorStateChange = lEditorState => {
    setEditorState(lEditorState);
  };

  const handleChangeEditingState = attribute => {
    setAttributeEditing(attribute);
    setIsEditing(!isEditing);
    if (!isEditing) {
      const lSolution = get(solution, 'solution', '');
      const lProblem = get(solution, 'problem', '');

      const body = attribute === 'problem' ? lProblem : lSolution;
      if (body) {
        const newState = convertFromRaw(JSON.parse(body));
        setEditorState(EditorState.createWithContent(newState));
      } else {
        setEditorState(EditorState.createEmpty());
      }
    }
  };

  const handleSaveSolution = async () => {
    try {
      dispatch(aSetLoadingState(true));
      const id = get(match, 'params.id', null);
      const body = {
        id,
      };
      body[attributeEditing] = JSON.stringify(
        convertToRaw(editorState.getCurrentContent()),
      );
      const response = await wsUpdateSolution(body);
      if (response.error) {
        dispatch(aOpenSnackbar('Ocurrió al guardar cambios', 'error'));
      } else {
        dispatch(aOpenSnackbar('Cambios guardados con éxito', 'success'));
      }
      fetchSolution();
      setIsEditing(false);
    } catch (e) {
      const error = get(e, 'data.message', '') || 'Ocurrió al guardar cambios';
      dispatch(aOpenSnackbar(error, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  if (notFound) {
    return (
      <div>
        <Helmet>
          <title>Detalle de solución</title>
        </Helmet>
        <EmptyState message="No se encontró el ticket" />
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div>
        <Helmet>
          <title>Detalle de solución</title>
        </Helmet>
        {times(10, i => (
          <React.Fragment key={i}>
            <Skeleton
              animation="wave"
              height="40px"
              width="100%"
              variant="text"
              key={i}
            />
          </React.Fragment>
        ))}
      </div>
    );
  }

  const shortName = get(solution, 'shortName', '');
  const problem = get(solution, 'problem', '');
  const solutionText = get(solution, 'solution', '');
  let htmlProblem = '<div></div>';
  let htmlSolution = '<div></div>';

  if (problem) {
    try {
      htmlProblem = stateToHTML(convertFromRaw(JSON.parse(problem)));
    } catch (e) {
      htmlProblem = '<div></div>';
    }
  }

  if (solutionText) {
    try {
      htmlSolution = stateToHTML(convertFromRaw(JSON.parse(solutionText)));
    } catch (e) {
      htmlSolution = '<div></div>';
    }
  }

  const products = (get(solution, 'products', []) || []).map(product => ({
    label: `# ${product.name}(${get(product, 'solutionProduct.version', '')})`,
  }));

  console.log('products', products);

  return (
    <MainContainer>
      <Helmet>
        <title>{shortName || 'Detalle de solución'}</title>
      </Helmet>
      <Container>
        <TopSection>
          <h3>
            {shortName}
            <Button
              onClick={() => setEditSolutionOpen(true)}
              variant="outlined"
            >
              Editar
            </Button>
          </h3>
          <div className="products">
            {products.map(p => (
              <div>{p.label}</div>
            ))}
          </div>
        </TopSection>
      </Container>
      <Divider size="24" />
      <Container>
        <Header>
          <h3>
            Problema
            <Button
              onClick={() => handleChangeEditingState('problem')}
              variant="outlined"
            >
              Editar
            </Button>
          </h3>
          <div className="incoming-html">{HtmlParser(htmlProblem)}</div>
        </Header>
      </Container>
      <Divider size="24" />
      <Container>
        <Header>
          <h3>
            Solución
            <Button
              onClick={() => handleChangeEditingState('solution')}
              variant="outlined"
            >
              Editar
            </Button>
          </h3>
          <div className="incoming-html">{HtmlParser(htmlSolution)}</div>
        </Header>
      </Container>
      <Divider size="24" />
      {false && (
        <Container>
          <Body>
            <h4>Comentarios</h4>
            <Divider size="24" />
            {[].map(c => (
              <CommentItem
                key={c.id}
                comment={c}
                onDelete={handleDeleteComment}
              />
            ))}
            <Divider size="24" />
            <Input multiline rows={4} label="Escribe un comentario" />
            <FloatRight>
              <Button variant="text">Comentar</Button>
            </FloatRight>
          </Body>
        </Container>
      )}
      <Dialog
        open={isEditing}
        onClose={() => setIsEditing(false)}
        title={
          attributeEditing === 'problem' ? 'Editar problema' : 'Editar solución'
        }
        withActions
        positiveAction="Guardar"
        onPositiveAction={handleSaveSolution}
        onNegativeAction={() => setIsEditing(false)}
      >
        <EditorWrapper>
          <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="editor-class"
            onEditorStateChange={onEditorStateChange}
            toolbar={{
              options: [
                'inline',
                'blockType',
                'fontSize',
                'list',
                'textAlign',
                'colorPicker',
                'link',
                'history',
              ],
            }}
          />
        </EditorWrapper>
      </Dialog>
      <CreateEditSolution
        open={editSolutionOpen}
        onClose={() => setEditSolutionOpen(false)}
        callback={fetchSolution}
        dispatch={dispatch}
        defaultSolution={solution}
        products={productsList}
      />
    </MainContainer>
  );
}

SolutionDetail.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(SolutionDetail);
