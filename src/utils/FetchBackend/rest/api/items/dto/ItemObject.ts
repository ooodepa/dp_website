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

  static getOnBox = (item: ItemDto) => ItemObject.getParam(item, 1);
  static getKg = (item: ItemDto) => ItemObject.getParam(item, 2);
  static getm3 = (item: ItemDto) => ItemObject.getParam(item, 3);
  static getNameRU = (item: ItemDto) => ItemObject.getParam(item, 20);
  static getNameEN = (item: ItemDto) => ItemObject.getParam(item, 33);
  static getNameTR = (item: ItemDto) => ItemObject.getParam(item, 18);
  static getCostBYN = (item: ItemDto) => ItemObject.getParam(item, 25);
  static getCostUSD = (item: ItemDto) => ItemObject.getParam(item, 24);
  static getCostRUB = (item: ItemDto) => ItemObject.getParam(item, 29);
  static getCostAMD = (item: ItemDto) => ItemObject.getParam(item, 45);
  static getCostGEL = (item: ItemDto) => ItemObject.getParam(item, 44);
}
