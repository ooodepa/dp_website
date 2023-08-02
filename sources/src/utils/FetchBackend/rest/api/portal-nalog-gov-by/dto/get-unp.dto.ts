interface UnpDataDto {
  vunp: string;
  vnaimp: string;
  vnaimk: string;
  vpadres: string | null;
  dreg: string;
  nmns: string;
  vmns: string;
  ckodsost: string;
  vkods: string;
  dlikv: string | null;
  vlikv: string | null;
}

export default interface GetUnpDto {
  row: UnpDataDto;
}
