const doFetchApplication = () => {
  return fetch('http://localhost:4000/v1/application', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then((response) => {
    return response.items;
  }).catch((e) => {
    console.log('error', e);
  });
};

const fetchApplicationSuccess = (result) => {
  return {
    type: 'APPLICATION/RECEIVED/SUCCESS',
    items: result,
  };
};

export const fetchApplication = () => {
  return (dispatch) => {
    doFetchApplication().then((result) => {
      dispatch(fetchApplicationSuccess(result));
    });
  };
};

//------------------------------------------------

const doDeleteApplication = (id) => {
  return fetch(`http://localhost:4000/v1/application/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then((response) => {
    console.log('rseponse delete ', response);
    return doFetchApplication().then((result) => {
      return result;
    });
  }).catch((e) => {
    console.log('error', e);
  });
};

const deleteApplicationSuccess = (result) => {
  return {
    type: 'APPLICATION/DELETE',
    items: result,
  };
};

export const deleteApplication = (id) => {
  return (dispatch) => {
    doDeleteApplication(id).then((result) => {
      dispatch(deleteApplicationSuccess(result));
    });
  };
};

//------------------------------------------------

const doCreateApplication = (values) => {
  const { name, description, redirectURL } = values;
  let { read, write } = values;
  if (read === undefined) read = false;
  if (write === undefined) write = false;
  return fetch('http://localhost:4000/v1/application', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description,
      redirectURL,
      read,
      write,
    }),
  })
  .then(response => response.json())
  .then((response) => {
    console.log('response CREATE', response);
    return doFetchApplication().then((result) => {
      return result;
    });
  }).catch((e) => {
    console.log('error', e);
  });
};

const createApplicationSuccess = (result) => {
  return {
    type: 'APPLICATION/CREATE',
    items: result,
  };
};

export const createApplication = (values) => {
  return (dispatch) => {
    doCreateApplication(values).then((result) => {
      dispatch(createApplicationSuccess(result));
    });
  };
};
