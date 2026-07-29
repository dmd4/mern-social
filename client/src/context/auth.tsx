import React, { useReducer, createContext, ReactNode } from 'react';
import jwtDecode from 'jwt-decode';
import { User, AuthContextType } from '../types';

interface DecodedToken extends User {
  exp: number;
}

interface AuthState {
  user: User | null;
}

type AuthAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  user: null
};

const token = localStorage.getItem('jwtToken');
if (token) {
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem('jwtToken');
    } else {
      initialState.user = decodedToken;
    }
  } catch (e) {
    localStorage.removeItem('jwtToken');
  }
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {}
});

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
}

interface AuthProviderProps {
  children?: ReactNode;
  [key: string]: any;
}

function AuthProvider(props: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(userData: User) {
    localStorage.setItem('jwtToken', userData.token);
    dispatch({
      type: 'LOGIN',
      payload: userData
    });
  }

  function logout() {
    localStorage.removeItem('jwtToken');
    dispatch({ type: 'LOGOUT' });
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };
