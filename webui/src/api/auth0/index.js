export const fetchAccessToken = () => {
  return fetch('https://forviz.au.auth0.com/oauth/token', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: 'yLXmVHUlO264Z1YNqFil3vdlmyWS2TBl',
      client_secret: 'KrMCp2mSWPRM0-xR_3-zpKBOuihIY5FbB749TtTXI4FQo0xKFwvL4LD6S6u0GxuS',
      audience: 'content.forviz.com',
      grant_type: 'client_credentials',
    }),
  })
  .then((response) => {
    console.log('fetchAccessToken', response);
    return response;
  });
};
