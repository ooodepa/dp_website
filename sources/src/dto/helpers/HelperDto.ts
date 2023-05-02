interface HelperContactTypes {
  dp_id: number;
  dp_helperId: string;
  dp_contactTypeId: number;
  dp_value: string;
  dp_isHidden: boolean;
}

export default interface HelperDto {
  dp_id: string;
  dp_sortingIndex: number;
  dp_name: string;
  dp_description: string;
  dp_isHidden: boolean;
  dp_helperContactTypes: HelperContactTypes[];
}
