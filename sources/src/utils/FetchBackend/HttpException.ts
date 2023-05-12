export default class HttpException extends Error {
  HTTP_METHOD: string;
  HTTP_STATUS: number;
  HTTP_URL: string;

  constructor(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    response: Response,
  ) {
    const message = `${method} ${response.url} ${response.status}`;
    super(message);
    this.name = this.constructor.name;

    this.HTTP_METHOD = method;
    this.HTTP_STATUS = response.status;
    this.HTTP_URL = response.url;

    // eslint-disable-next-line no-console
    console.log(message);
  }
}
