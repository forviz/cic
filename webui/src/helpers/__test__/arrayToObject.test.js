import arrayToObject from '../arrayToObject';

describe('arrayToObject', () => {
  it('should return object', () => {
    const arr = [
      { id: 1, value: '555'}
    ];
    expect(arrayToObject(arr, 'id')).toEqual({ 1: { id: 1, value: '555' }});
  });
});
