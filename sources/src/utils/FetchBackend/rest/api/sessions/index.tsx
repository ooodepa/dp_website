import FetchBackend from '@/utils/FetchBackend';
import { Dispatch, SetStateAction } from 'react';
import AppModal from '@/components/AppModal/AppModal';
import HttpException from '@/utils/FetchBackend/HttpException';
import HttpResponseDto from '@/utils/FetchBackend/dto/http-response.dto';
import UpdateSessionResponseDto from './dto/update-session-response.dto';
import CreateSessionResponseDto from './dto/create-session-response.dto';

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

  static async update() {
    const refreshToken = localStorage.getItem('refresh');
    if (!refreshToken) {
      return false;
    }

    const result = await FetchBackend('refresh', 'PATCH', 'sessions');
    const response = result.response;

    if (response.status === 200) {
      const json: UpdateSessionResponseDto = await response.json();
      const accessToken = json.dp_accessToken;
      localStorage.setItem('access', accessToken);
      return true;
    }

    if (response.status === 401) {
      // localStorage.removeItem('access');
      // localStorage.removeItem('refresh');
      throw new HttpException(result.method, response);
    }

    throw new HttpException(result.method, response);
  }
}
