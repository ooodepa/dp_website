interface UnpDataDto {
  VUNP: string;
  VNAIMP: string;
  VNAIMK: string;
  VPADRES: string;
  DREG: string;
  NMNS: string;
  VMNS: string;
  CKODSOST: string;
  VKODS: string;
  DLIKV: string | null;
  VLIKV: string | null;
}

export default interface GetUnpDto {
  ROW: UnpDataDto;
}
