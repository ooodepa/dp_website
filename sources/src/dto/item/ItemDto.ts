interface ItemCharacteristics {
  dp_id: number;
  dp_itemId: string;
  dp_characteristicId: number;
  dp_value: string;
}

interface ItemGalery {
  dp_id: number;
  dp_itemId: string;
  dp_photoUrl: string;
}

export default interface ItemDto {
  dp_id: string;
  dp_name: string;
  dp_model: string;
  dp_cost: number;
  dp_photoUrl: string;
  dp_seoKeywords: string;
  dp_seoDescription: string;
  dp_itemCategoryId: number;
  dp_isHidden: string;
  dp_itemCharacteristics: ItemCharacteristics[];
  dp_itemGalery: ItemGalery[];
}
