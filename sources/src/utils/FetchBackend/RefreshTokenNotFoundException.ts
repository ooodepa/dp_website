export default class RefreshTokenNotFoundException extends Error {
  constructor() {
    const message = 'refreshToken = null';
    super(message);
    this.name = this.constructor.name;
  }
}
