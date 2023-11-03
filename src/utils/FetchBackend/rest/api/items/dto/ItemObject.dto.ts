import GetItemDto from './get-item.dto';
import ItemDto from './item.dto';

export default class ItemOperations {
  static getParam(item: ItemDto, id: number) {
    const charactetistics = item.dp_itemCharacteristics;
    for (let i = 0; i < charactetistics.length; ++i) {
      if (charactetistics[i].dp_characteristicId === id) {
        return charactetistics[i].dp_value;
      }
    }
    return '';
  }
}
