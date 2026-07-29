import assert from 'node:assert';
import { test, describe } from 'node:test';
import { validateRegisterInput, validateLoginInput } from './validators';

describe('validators', () => {
  describe('validateRegisterInput', () => {
    test('returns valid=true for correct registration details', () => {
      const result = validateRegisterInput('john_doe', 'john@example.com', 'password123', 'password123');
      assert.strictEqual(result.valid, true);
      assert.deepStrictEqual(result.errors, {});
    });

    test('returns error for empty username', () => {
      const result = validateRegisterInput('', 'john@example.com', 'password123', 'password123');
      assert.strictEqual(result.valid, false);
      assert.strictEqual(result.errors.username, 'Username must not be empty');
    });

    test('returns error for invalid email format', () => {
      const result = validateRegisterInput('john_doe', 'invalid-email', 'password123', 'password123');
      assert.strictEqual(result.valid, false);
      assert.strictEqual(result.errors.email, 'Invalid email address');
    });

    test('returns error when passwords do not match', () => {
      const result = validateRegisterInput('john_doe', 'john@example.com', 'password123', 'different_password');
      assert.strictEqual(result.valid, false);
      assert.strictEqual(result.errors.confirmPassword, 'Passwords must match');
    });

    test('returns error for empty password', () => {
      const result = validateRegisterInput('john_doe', 'john@example.com', '', '');
      assert.strictEqual(result.valid, false);
      assert.strictEqual(result.errors.password, 'Password must not be empty');
    });
  });

  describe('validateLoginInput', () => {
    test('returns valid=true for non-empty credentials', () => {
      const result = validateLoginInput('john_doe', 'password123');
      assert.strictEqual(result.valid, true);
      assert.deepStrictEqual(result.errors, {});
    });

    test('returns error for empty username and password', () => {
      const result = validateLoginInput('', '');
      assert.strictEqual(result.valid, false);
      assert.strictEqual(result.errors.username, 'Username must not be empty');
      assert.strictEqual(result.errors.password, 'Password must not be empty');
    });
  });
});
