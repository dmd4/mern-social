import assert from 'node:assert';
import { test, describe } from 'node:test';
import jwt from 'jsonwebtoken';
import { checkAuth } from './check-auth';
import { SECRET_KEY } from '../config';

describe('checkAuth', () => {
  test('throws error when no authorization header is provided', () => {
    const context = { req: { headers: {} } };
    assert.throws(
      () => checkAuth(context),
      { message: 'Authorization header must be provided' }
    );
  });

  test('throws error when token is missing from Bearer header', () => {
    const context = { req: { headers: { authorization: 'Bearer ' } } };
    assert.throws(
      () => checkAuth(context),
      { message: "Authentication token must be 'Bearer [token]'" }
    );
  });

  test('returns user object when a valid JWT token is provided', () => {
    const payload = { id: '123', email: 'user@example.com', username: 'testuser' };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    const context = { req: { headers: { authorization: `Bearer ${token}` } } };
    const user = checkAuth(context);

    assert.strictEqual(user.id, '123');
    assert.strictEqual(user.username, 'testuser');
    assert.strictEqual(user.email, 'user@example.com');
  });

  test('throws AuthenticationError when an invalid token is provided', () => {
    const context = { req: { headers: { authorization: 'Bearer invalid_token_xyz' } } };
    assert.throws(
      () => checkAuth(context),
      (err: any) => err.message.includes('Invalid/Expired token')
    );
  });
});
