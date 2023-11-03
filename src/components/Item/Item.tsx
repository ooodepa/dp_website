import ItemGalery from './ItemGalery/ItemGalery';
import ItemBarcode from './ItemBarcode/ItemBarcode';
import AppContainer from '@/components/AppContainer/AppContainer';
import ItemBasketButtons from './ItemBasketButtons/ItemBasketButtons';
import ItemYouTubeVideos from './ItemYouTubeVideos/ItemYouTubeVideos';
import ItemCharacteristics from './ItemCharacteristics/ItemCharacteristics';
import ItemDto from '@/utils/FetchBackend/rest/api/items/dto/item-with-id.dto';
import GetItemBrandDto from '@/utils/FetchBackend/rest/api/item-brands/dto/get-item-brand.dto';
import GetItemCategoryDto from '@/utils/FetchBackend/rest/api/item-categories/dto/get-item-category.dto';
import GetItemCharacteristicDto from '@/utils/FetchBackend/rest/api/item-characteristics/dto/get-item-characteristic.dto';

interface IProps {
  item: ItemDto;
  itemCharacteristics: GetItemCharacteristicDto[];
  itemBrand: GetItemBrandDto;
  itemCategory: GetItemCategoryDto;
  brand: string;
  category: string;
}

export default function Item(props: IProps) {
  return (
    <AppContainer>
      <h1>{props.item.dp_name}</h1>
      <ItemGalery item={props.item} />
      <ItemYouTubeVideos item={props.item} />
      <ItemBasketButtons item={props.item} />
      <ItemBarcode item={props.item} />
      <ItemCharacteristics
        item={props.item}
        itemBrand={props.itemBrand}
        itemCategory={props.itemCategory}
        itemCharacteristics={props.itemCharacteristics}
      />
    </AppContainer>
  );
}
