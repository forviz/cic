import _ from 'lodash';

export default (info) => {
  console.log('mapImageInfoToFile', info);
  const file = info.file;
  return {
    uid: _.get(file, 'uid'),
    publicId: _.get(file, 'response.public_id'),
    fileName: _.get(file, 'name'),
    contentType: _.get(file, 'type'),
    url: _.get(file, 'response.url'),
    details: {
      image: {
        width: _.get(file, 'response.width'),
        height: _.get(file, 'response.height'),
      },
      size: _.get(file, 'size'),
    }
  }
}
