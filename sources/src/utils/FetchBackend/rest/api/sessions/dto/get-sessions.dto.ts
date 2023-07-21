interface SessionDto {
  dp_id: number;
  dp_date: string;
  dp_ip: string;
  dp_agent: string;
}

interface GetSessionsDto {
  statusCode: number;
  message: string;
  dp_current: SessionDto;
  dp_other: SessionDto[];
}
