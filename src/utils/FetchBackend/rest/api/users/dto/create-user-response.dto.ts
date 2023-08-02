export default interface CreateUserReponseDto {
  statusCode: number;
  message: string;
  dp_accessToken: string;
  dp_refreshToken: string;
}
