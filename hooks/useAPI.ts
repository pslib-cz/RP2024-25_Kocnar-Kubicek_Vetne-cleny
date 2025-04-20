import { useState } from 'react';

const API_URL = process.env.EXPO_PUBLIC_API_URL || '';
const API_BACKUP_URL = process.env.EXPO_PUBLIC_API_BACKUP_URL || '';

const fetchWithFallback = async <T = any>(path: string, options: RequestInit): Promise<T> => {
  try {
    const response = await fetch(`${API_URL}${path}`, options);
    if (!response.ok) {
      throw new Error('Primary API request failed');
    }

    return await response.json();
  } catch (primaryError) {
    console.warn('Primary API failed, trying backup API:', primaryError);

    try {
      const backupResponse = await fetch(`${API_BACKUP_URL}${path}`, options);

      if (!backupResponse.ok) {
        throw new Error('Backup API request failed');
      }

      return await backupResponse.json();
    } catch (backupError) {
      console.error('Backup API failed:', backupError);
      throw backupError;
    }
  }
};

export const useAPI = () => {
  const post = async <T = any>(path: string, payload?: any): Promise<T> => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload ? JSON.stringify(payload) : undefined,
    };
    return fetchWithFallback<T>(path, options);
  };

  const get = async <T = any>(path: string): Promise<T> => {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return fetchWithFallback<T>(path, options);
  };

  return { post, get };
};