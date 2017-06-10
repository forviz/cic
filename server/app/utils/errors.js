import cuid from 'cuid';

const handleError = (res, errorId) => {
  let status = 500;
  let message = '';

  switch (errorId) {
    case 'AccessTokenInvalid': message = 'The access token you sent could not be found or is invalid.'; break;
    case 'NotFound': status = 404; message = 'The resource could not be found'; break;
    default: message = 'Error';
  }

  res.status(status).send({
    sys: { type: 'Error', id: errorId },
    message,
    requestId: cuid(),
  });
};

export default handleError;
