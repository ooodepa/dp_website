import ItemDto from './ItemDto';

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

export default interface ItemByIdDto extends ItemDto {
  dp_itemCharecteristics: ItemCharacteristics[];
  dp_itemGalery: ItemGalery[];
}
