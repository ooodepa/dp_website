import HttpException from '../FetchBackend/HttpException';
import HttpResponseDto from '../FetchBackend/dto/http-response.dto';
import RefreshTokenNotFoundException from '../FetchBackend/RefreshTokenNotFoundException';

export default function AlertExceptionHelper(exception: any) {
  try {
    if (exception instanceof RefreshTokenNotFoundException) {
      window.location.replace('/manager');
      return;
    }

    if (
      exception instanceof TypeError &&
      exception.message === 'Network request failed'
    ) {
      const message = `
Нет интернета (TypeError, message = 'Network request failed')

${exception}
        `;

      alert(message);
      return;
    }

    alert(exception);
  } catch (err) {
    alert(err);
  }
}

export async function AsyncAlertExceptionHelper(exception: any) {
  try {
    if (exception instanceof HttpException) {
      const json: HttpResponseDto = await exception.RESPONSE.json();

      const message = `
Запрос на сервер (HttpException)

${json.message}

Дополнительная информация:
- Method: ${exception.HTTP_METHOD}
- URL: ${exception.HTTP_URL}
- HTTP status: ${exception.HTTP_STATUS}
        `;

      alert(message);
      return;
    }

    AlertExceptionHelper(exception);
  } catch (err) {
    if (exception instanceof HttpException) {
      const message = `
Запрос на сервер (HttpException)

Дополнительная информация:
- Method: ${exception.HTTP_METHOD}
- URL: ${exception.HTTP_URL}
- HTTP status: ${exception.HTTP_STATUS}
        `;

      alert(message);
      return;
    }

    alert(err);
  }
}
