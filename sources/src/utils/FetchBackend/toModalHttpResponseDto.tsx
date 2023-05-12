import { Dispatch, SetStateAction } from 'react';

import HttpException from './HttpException';
import AppModal from '@/components/AppModal/AppModal';
import HttpResponseDto from './dto/http-response.dto';

export default function toModalHttpResponse(
  dto: HttpResponseDto,
  setModal: Dispatch<SetStateAction<JSX.Element>>,
) {
  setModal(
    <AppModal
      title="Ответ от сервера"
      message={
        `${dto.message} \n` + '- - - \n' + `HTTP код: ${dto.statusCode} \n`
      }>
      <button onClick={() => setModal(<></>)}>Закрыть</button>
    </AppModal>,
  );

  return true;
}
