import { Dispatch, SetStateAction } from 'react';

import FetchBackend from '@/utils/FetchBackend';
import CreateUserDto from './dto/create-user.dto';
import GetOneUserDto from './dto/get-one-user.dto';
import AppModal from '@/components/AppModal/AppModal';
import ChangePasswordDto from './dto/change-password.dto';
import ForgetPasswordDto from './dto/forget-password.dto';
import HttpException from '@/utils/FetchBackend/HttpException';
import CreateUserReponseDto from './dto/create-user-response.dto';
import HttpResponseDto from '@/utils/FetchBackend/dto/http-response.dto';

export default class FetchUsers {
  static async isAdmin() {
    const result = await FetchBackend('access', 'POST', 'users/is-admin');
    const response = result.response;

    if (response.status === 200) {
      return true;
    }

    throw new HttpException(result.method, response);
  }

  static async forgetPassword(
    setModal: Dispatch<SetStateAction<JSX.Element>>,
    data: ForgetPasswordDto,
  ) {
    const result = await FetchBackend(
      'access',
      'POST',
      'users/forget-password',
      data,
    );
    const response = result.response;

    const json: HttpResponseDto = await response.json();

    if (response.status === 200) {
      alert(json.message);
      return true;
    }

    setModal(
      <AppModal title="Забыли пароль" message={json.message}>
        <button onClick={() => setModal(<></>)}>Закрыть</button>
      </AppModal>,
    );

    return false;

    // throw new HttpException(result.method, response);
  }

  static async changePassword(
    setModal: Dispatch<SetStateAction<JSX.Element>>,
    data: ChangePasswordDto,
  ) {
    const result = await FetchBackend(
      'access',
      'PATCH',
      'users/change-password',
      data,
    );
    const response = result.response;

    const json: HttpResponseDto = await response.json();

    if (response.status === 200) {
      alert(json.message);
      return true;
    }

    if (response.status === 401) {
      throw new HttpException(result.method, response);
    }

    setModal(
      <AppModal title="Смена пароля" message={json.message}>
        <button onClick={() => setModal(<></>)}>Закрыть</button>
      </AppModal>,
    );

    return false;
  }

  static async getOne(): Promise<GetOneUserDto> {
    const result = await FetchBackend('access', 'GET', 'users');
    const response = result.response;

    if (response.status === 200) {
      const json: GetOneUserDto = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }

  static async create(dto: CreateUserDto) {
    const result = await FetchBackend('none', 'POST', 'users', dto);
    const response = result.response;

    if (response.status === 201) {
      const json: CreateUserReponseDto = await response.json();
      const accessToken = json.dp_accessToken;
      const refreshToken = json.dp_refreshToken;
      localStorage.setItem('access', accessToken);
      localStorage.setItem('refresh', refreshToken);
      return true;
    }

    throw new HttpException(result.method, response);
  }

  static async isLogin() {
    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      return false;
    }

    const result = await FetchBackend('access', 'POST', 'users/is-login');
    const response = result.response;
    return response.status === 200;
  }
}
