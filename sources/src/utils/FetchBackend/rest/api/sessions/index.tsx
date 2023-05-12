import AppEnv from '@/AppEnv';
import FetchBackend from '@/utils/FetchBackend';
import HttpException from '@/utils/FetchBackend/HttpException';
import { Dispatch, SetStateAction } from 'react';

import HttpResponseDto from '@/utils/FetchBackend/dto/http-response.dto';
import AppModal from '@/components/AppModal/AppModal';

export default class FetchSessions {
  static async create(
    setModal: Dispatch<SetStateAction<JSX.Element>>,
    login: string,
    password: string,
  ) {
    const result = await FetchBackend('none', 'POST', 'sessions', {
      emailOrLogin: login,
      dp_password: password,
    });
    const response = result.response;

    if (response.status === 201) {
      const json: CreateSessionResponseDto = await response.json();
      const accessToken = json.dp_accessToken;
      const refreshToken = json.dp_refreshToken;
      localStorage.setItem('access', accessToken);
      localStorage.setItem('refresh', refreshToken);
      return true;
    }

    if (response.status === 409) {
      const json: HttpResponseDto = await response.json();
      setModal(
        <AppModal title="Вход в админ панель" message={json.message}>
          <button onClick={() => setModal(<></>)}>Закрыть</button>
        </AppModal>,
      );
      return false;
    }

    throw new HttpException(result.method, response);
  }
}
