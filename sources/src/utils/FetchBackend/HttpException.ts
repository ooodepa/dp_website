export default class HttpException extends Error {
  constructor(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    response: Response,
  ) {
    const message = `${method} ${response.url} ${response.status}`;
    super(message);
    this.name = this.constructor.name;
    // eslint-disable-next-line no-console
    console.log(message);
  }
}
