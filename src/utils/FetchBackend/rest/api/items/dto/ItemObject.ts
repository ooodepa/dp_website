import ItemDto from './item.dto';

export default class ItemObject {
  static getParam(item: ItemDto, id: number) {
    const ch = item.dp_itemCharacteristics;
    for (let i = 0; i < ch.length; ++i) {
      if (ch[i].dp_characteristicId === id) {
        return ch[i].dp_value;
      }
    }
    return '';
  }
}
