export const createNewOrganization = () => {
  return {
    type: 'CREATENEW/ORGANIZATION',
    kokoko: 'oooo',
  };
};

export const leaveOrganization = () => {
  return (dispatch) => {
    dispatch({
      type: 'LEAVE/ORGANIZATION',
    });

    dispatch({
      type: 'DOSOMETHING/ORGANIZATION',
    });
  };
};
