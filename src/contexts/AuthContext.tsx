import React, { createContext, useState, ReactNode, useContext } from 'react';
import axios from 'axios';
import { User } from '../core/user.type';
import { TComment } from '../core/comment.type';
import { useTheme } from 'next-themes';

interface AuthContextType {
  user: User | null;
  token: string | null;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    phoneNumber: string,
    username: string,
    password: string,
    email?: string,
    companyName?: string,
    firstName?: string,
    lastName?: string,
  ) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (updatedUser: Partial<User>) => Promise<void>;
  comments: TComment[];
  addComment: (comment: TComment) => Promise<boolean>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  token: null,
  error: null,
  setError: () => {},
  login: async () => false,
  register: async () => false,
  logout: () => {},
  updateUserProfile: async () => {},
  comments: [],
  addComment: async () => false,
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_API_PATH;
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('token')
  );
  const [error, setError] = useState<string | null>(null);
  const { setTheme } = useTheme();
  const [comments, setComments] = useState<TComment[]>([]);

  const mapUserResponse = (user: any): User => {
    return {
      id: user.id,
      username: user.username,
      fullName: user.full_name,
      phoneNumber: user.phone_number,
      email: user.email,
      companyName: user.company_name,
      availableFunds: user.available_funds,
      monthlyFee: user.monthly_fee,
      debitAmount: user.debit_amount,
    };
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(BASE_URL + '/login/', { username, password });
      const { token, user } = response.data;
      const mappedUser = mapUserResponse(user);
      setToken(token);
      setUser(mappedUser);
      setError(null);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(mappedUser));
      return true;
    } catch (error) {
      console.error('Login failed', error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data.error === 'Invalid credentials') {
          setError('Неправильные учетные данные');
        } else {
          setError('Ошибка при входе');
        }
      } else {
        setError('Ошибка при входе');
      }
      return false;
    }
  };

  const register = async (
    phoneNumber: string,
    password: string,
    username: string,
  ): Promise<boolean> => {
    try {
      await axios.post(BASE_URL + '/registration/', {
        phone_number: phoneNumber,
        password: password,
        username: username,
      });
      setError(null);
      return true;
    } catch (error) {
      console.error('Register failed', error);
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.username);
      } else {
        setError('Ошибка при регистрации');
      }
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
    localStorage.removeItem('shop-storage');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setTheme('light');
  };

  const updateUserProfile = async (updatedUser: Partial<User>): Promise<void> => {
    if (!token || !user) return;

    try {
      const response = await axios.put(`${BASE_URL}/profile/`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedUserData = mapUserResponse(response.data);
      setUser(updatedUserData);
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      setError(null);
    } catch (error) {
      console.error('Profile update failed', error);
      setError('Ошибка при обновлении профиля');
    }
  };

// comments
const addComment = async (comment: TComment): Promise<boolean> => {
  if (!token) {
    console.error('Token is not available');
    return false;
  }

  try {
    // console.log('Attempting to add comment', comment);  // Added for debugging
    const response = await axios.post(`${BASE_URL}/create_comment/`, comment, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    // console.log('Comment added successfully', response.data);
    setComments([...comments, response.data]);  // Ensure you're adding the response comment
    setError(null);
    return true;
  } catch (error) {
    console.error('Adding comment failed', error);
    setError('Ошибка при добавлении комментария');
    return false;
  }
};


  return (
    <AuthContext.Provider value={{ user, token, error, setError, login, register, logout, updateUserProfile, comments, addComment }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};