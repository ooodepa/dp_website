import ToastController from '@/packages/ToastController';
import HttpException from '../FetchBackend/HttpException';
import HttpResponseDto from '../FetchBackend/dto/http-response.dto';

export default function AlertExceptionHelper(exception: any) {
  try {
    if (
      exception instanceof TypeError &&
      exception.message === 'Network request failed'
    ) {
      const message = `${exception}`;
      const title = `Нет интернета (TypeError, message = 'Network request failed')`;
      ToastController.warning(message, title);
      return;
    }

    if (exception instanceof HttpException) {
      const title = 'Исключение при запросе на сервер (HttpException)';
      const message =
        `<pre style="overflow-x: scroll;">` +
        `Method: ${exception.HTTP_METHOD} \n` +
        `URL: ${exception.HTTP_URL} \n` +
        `HTTP status: ${exception.HTTP_STATUS} \n` +
        `</pre>`;

      ToastController.warning(message, title);
      return;
    }

    ToastController.warning(`${exception}`, 'Вызвано исключение');
  } catch (err) {
    alert(err);
  }
}

export async function AsyncAlertExceptionHelper(exception: any) {
  try {
    if (
      exception instanceof Error &&
      exception.message === 'Войдите в аккаунт'
    ) {
      ToastController.warning('Войдите в аккаунт', 'Войдите в аккаунт');
      return;
    }

    if (exception instanceof HttpException) {
      const json: HttpResponseDto = await exception.RESPONSE.json();

      const title = 'Исключение при запросе на сервер (HttpException)';
      const message =
        `<pre style="overflow-x: scroll;">` +
        `${json.message} \n` +
        `Method: ${exception.HTTP_METHOD} \n` +
        `URL: ${exception.HTTP_URL} \n` +
        `HTTP status: ${exception.HTTP_STATUS} \n` +
        `</pre>`;

      ToastController.warning(message, title);
      return;
    }

    AlertExceptionHelper(exception);
  } catch (err) {
    AlertExceptionHelper(exception);
  }
}
