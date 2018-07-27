/* global test, expect */

import getRawUrl from '../getRawUrl';

test('it should strip the query string from a url', () => {
  expect(getRawUrl('http://test.com?hey-there')).toEqual('http://test.com');
});

test('it should strip the hash section from a url', () => {
  expect(getRawUrl('http://test.com#hey-there')).toEqual('http://test.com');
});

test('it should strip the query string and hash section from a url', () => {
  expect(
    getRawUrl('http://test.com?query-stuff=what-the-hey#hey-there'),
  ).toEqual('http://test.com');
});
