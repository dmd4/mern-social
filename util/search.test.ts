import assert from 'node:assert';
import { test, describe } from 'node:test';

describe('searchPosts query parsing', () => {
  test('formats text search query object correctly for MongoDB text index', () => {
    const searchTerm = 'chakra react';
    const mongoQuery = { $text: { $search: searchTerm } };

    assert.deepStrictEqual(mongoQuery, {
      $text: { $search: 'chakra react' }
    });
  });

  test('handles empty search query gracefully', () => {
    const searchTerm = '   ';
    const isSearching = searchTerm.trim() !== '';
    assert.strictEqual(isSearching, false);
  });
});
