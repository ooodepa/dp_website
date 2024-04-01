import { useEffect } from 'react';
import FetchItems from '@/utils/FetchBackend/rest/api/items';
import FetchItemBrand from '@/utils/FetchBackend/rest/api/item-brands';
import FetchItemCategories from '@/utils/FetchBackend/rest/api/item-categories';

interface IProps {
  params: {
    id: string;
  };
}

export default function RedirectByItemId(props: IProps) {
  useEffect(() => {
    (async function () {
      const itemId = `${props.params.id}`;
      const jItem = await FetchItems.getById(itemId);

      const categoryId = jItem.dp_itemCategoryId;
      const jCategory = await FetchItemCategories.getById(categoryId);

      const brandId = jCategory.dp_itemBrandId;
      const jBrand = await FetchItemBrand.getById(brandId);

      const model = jItem.dp_seoUrlSegment;
      const category = jCategory.dp_seoUrlSegment;
      const brand = jBrand.dp_seoUrlSegment;

      window.location.replace(`/products/${brand}/${category}/${model}`);
    })();
  }, [props.params.id]);

  return <div>Поиск номенклатуры по id=({props.params.id})</div>;
}

interface IServerSideProps {
  params: {
    id: string;
  };
}

export function getServerSideProps(context: IServerSideProps) {
  const { id } = context.params;
  const props: IProps = {
    params: { id },
  };

  return {
    props,
  };
}
