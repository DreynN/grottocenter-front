import fetch from 'isomorphic-fetch';
import { getCaveUrl, postCreateCaveUrl, putCaveUrl } from '../conf/Config';
import makeErrorMessage from '../helpers/makeErrorMessage';

export const LOAD_CAVE_SUCCESS = 'LOAD_CAVE_SUCCESS';
export const LOAD_CAVE_LOADING = 'LOAD_CAVE_LOADING';
export const LOAD_CAVE_ERROR = 'LOAD_CAVE_ERROR';

export const POST_CAVE = 'POST_CAVE';
export const POST_CAVE_SUCCESS = 'POST_CAVE_SUCCESS';
export const POST_CAVE_FAILURE = 'POST_CAVE_FAILURE';

export const UPDATE_CAVE = 'UPDATE_CAVE';
export const UPDATE_CAVE_SUCCESS = 'UPDATE_CAVE_SUCCESS';
export const UPDATE_CAVE_FAILURE = 'UPDATE_CAVE_FAILURE';

export const postCaveAction = () => ({
  type: POST_CAVE
});
export const postCaveSuccess = cave => ({
  cave,
  type: POST_CAVE_SUCCESS
});
export const postCaveFailure = (error, httpCode) => ({
  type: POST_CAVE_FAILURE,
  error,
  httpCode
});

export const updateCaveAction = () => ({
  type: UPDATE_CAVE
});
export const updateCaveSuccess = cave => ({
  cave,
  type: UPDATE_CAVE_SUCCESS
});
export const updateCaveFailure = (error, httpCode) => ({
  type: UPDATE_CAVE_FAILURE,
  error,
  httpCode
});

export const fetchCave = caveId => dispatch => {
  dispatch({ type: LOAD_CAVE_LOADING });

  return fetch(getCaveUrl + caveId)
    .then(response => {
      if (response.status >= 400) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => dispatch({ type: LOAD_CAVE_SUCCESS, data }))
    .catch(error =>
      dispatch({
        type: LOAD_CAVE_ERROR,
        error: makeErrorMessage(error.message, `Fetching cave id ${caveId}`)
      })
    );
};

export const postCave = data => (dispatch, getState) => {
  dispatch(postCaveAction());

  const requestOptions = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: getState().login.authorizationHeader
  };

  return fetch(postCreateCaveUrl, requestOptions)
    .then(response => {
      if (response.status >= 400) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(res => {
      dispatch(postCaveSuccess(res));
    })
    .catch(error =>
      dispatch(
        postCaveFailure(
          makeErrorMessage(error.message, `Bad request`),
          error.message
        )
      )
    );
};

export const updateCave = data => (dispatch, getState) => {
  dispatch(updateCaveAction());

  const requestOptions = {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: getState().login.authorizationHeader
  };

  return fetch(putCaveUrl(data.id), requestOptions)
    .then(response => {
      if (response.status >= 400) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(res => {
      dispatch(updateCaveSuccess(res));
    })
    .catch(error =>
      dispatch(
        updateCaveFailure(
          makeErrorMessage(error.message, `Bad request`),
          error.message
        )
      )
    );
};
