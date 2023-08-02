import { Dispatch, SetStateAction } from 'react';

import HttpException from './HttpException';
import AppModal from '@/components/AppModal/AppModal';
import HttpResponseDto from './dto/http-response.dto';

export default async function toModalHttpException(
  exception: any,
  setModal: Dispatch<SetStateAction<JSX.Element>>,
) {
  if (!(exception instanceof HttpException)) {
    return false;
  }

  if (exception.HTTP_STATUS === 400 || exception.HTTP_STATUS === 409) {
    const json: HttpResponseDto = await exception.RESPONSE.json();
    setModal(
      <AppModal
        title="Запрос на сервер"
        message={
          `${json.message}\n` +
          `- - - \n` +
          'Дополнительная информация: \n' +
          `Метод: ${exception.HTTP_METHOD} \n` +
          `URL: ${exception.HTTP_URL} \n` +
          `HTTP код: ${exception.HTTP_STATUS} \n`
        }>
        <button onClick={() => setModal(<></>)}>Закрыть</button>
      </AppModal>,
    );
    return true;
  }

  setModal(
    <AppModal
      title="Запрос на сервер"
      message={
        `Method: ${exception.HTTP_METHOD} \n` +
        `URL: ${exception.HTTP_URL} \n` +
        `HTTP status: ${exception.HTTP_STATUS} \n`
      }>
      <button onClick={() => setModal(<></>)}>Закрыть</button>
    </AppModal>,
  );

  return true;
}
