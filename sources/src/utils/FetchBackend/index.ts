import AppEnv from '@/AppEnv';
import FetchSessions from './rest/api/sessions';

interface FetchBackendResult {
  response: Response;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}

export default async function FetchBackend(
  type: 'none' | 'access' | 'refresh',
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  uri: string,
  body: any | undefined = {},
): Promise<FetchBackendResult> {
  const token: string | undefined =
    type === 'access'
      ? `Bearer ${localStorage.getItem('access')}`
      : type === 'refresh'
      ? `Bearer ${localStorage.getItem('refresh')}`
      : undefined;

  if (method === 'GET') {
    const URL = `${AppEnv.NEXT_PUBLIC__BACKEND_URL}/api/v1/${uri}`;
    const response = await fetch(URL, {
      headers: token ? { Authorization: token } : {},
    });

    if (response.status === 401) {
      FetchSessions.update();
      const token: string | undefined =
        type === 'access'
          ? `Bearer ${localStorage.getItem('access')}`
          : undefined;
      const response2 = await fetch(URL, {
        headers: token ? { Authorization: token } : {},
      });
      return { response: response2, method };
    }

    return { response, method };
  }

  if (method === 'POST') {
    const URL = `${AppEnv.NEXT_PUBLIC__BACKEND_URL}/api/v1/${uri}`;
    const BODY = JSON.stringify(body);
    const HEADERS = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await fetch(URL, {
      method: 'POST',
      body: BODY,
      headers: token ? { ...HEADERS, Authorization: token } : HEADERS,
    });

    if (response.status === 401) {
      FetchSessions.update();
      const token: string | undefined =
        type === 'access'
          ? `Bearer ${localStorage.getItem('access')}`
          : undefined;
      const response2 = await fetch(URL, {
        method: 'POST',
        body: BODY,
        headers: token ? { ...HEADERS, Authorization: token } : HEADERS,
      });
      return { response: response2, method };
    }

    return { response, method };
  }

  if (method === 'PUT') {
    const URL = `${AppEnv.NEXT_PUBLIC__BACKEND_URL}/api/v1/${uri}`;
    const BODY = JSON.stringify(body);
    const HEADERS = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await fetch(URL, {
      method: 'PUT',
      body: BODY,
      headers: token ? { ...HEADERS, Authorization: token } : HEADERS,
    });

    if (response.status === 401) {
      FetchSessions.update();
      const token: string | undefined =
        type === 'access'
          ? `Bearer ${localStorage.getItem('access')}`
          : undefined;
      const response2 = await fetch(URL, {
        method: 'PUT',
        body: BODY,
        headers: token ? { ...HEADERS, Authorization: token } : HEADERS,
      });
      return { response: response2, method };
    }

    return { response, method };
  }

  if (method === 'PATCH') {
    const URL = `${AppEnv.NEXT_PUBLIC__BACKEND_URL}/api/v1/${uri}`;
    const BODY = JSON.stringify(body);
    const HEADERS = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await fetch(URL, {
      method: 'PATCH',
      body: BODY,
      headers: token ? { ...HEADERS, Authorization: token } : HEADERS,
    });

    if (response.status === 401) {
      FetchSessions.update();
      const token: string | undefined =
        type === 'access'
          ? `Bearer ${localStorage.getItem('access')}`
          : undefined;
      const response2 = await fetch(URL, {
        method: 'PATCH',
        body: BODY,
        headers: token ? { ...HEADERS, Authorization: token } : HEADERS,
      });
      return { response: response2, method };
    }

    return { response, method };
  }

  const URL = `${AppEnv.NEXT_PUBLIC__BACKEND_URL}/api/v1/${uri}`;
  const HEADERS = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const response = await fetch(URL, {
    method: 'DELETE',
    headers: token ? { ...HEADERS, Authorization: token } : HEADERS,
  });

  if (response.status === 401) {
    FetchSessions.update();
    const token: string | undefined =
      type === 'access'
        ? `Bearer ${localStorage.getItem('access')}`
        : undefined;
    const response2 = await fetch(URL, {
      method: 'DELETE',
      headers: token ? { ...HEADERS, Authorization: token } : HEADERS,
    });
    return { response: response2, method };
  }

  return { response, method };
}
