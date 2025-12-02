'use client'

import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Get a fresh access token from Cognito via Amplify. Amplify will automatically use the refresh token when needed.
async function getAccessToken() {
  try {
    const { tokens } = await fetchAuthSession();
    return tokens?.accessToken?.toString() ?? null;
  } catch (err) {
    console.error('Failed to fetch auth session:', err);
    return null;
  }
}

// Helper to call the backend with Authorization: Bearer <token>
export async function apiFetch(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not set (NEXT_PUBLIC_API_BASE_URL)');
  }

  const accessToken = await getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${text || res.statusText}`);
  }

  return res.json();
}
