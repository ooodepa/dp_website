import { useEffect } from 'react';
import FetchItems from '@/utils/FetchBackend/rest/api/items';
import FetchItemBrand from '@/utils/FetchBackend/rest/api/item-brands';
import FetchItemCategories from '@/utils/FetchBackend/rest/api/item-categories';

interface IProps {
  params: {
    model: string;
  };
}

export default function RedirectByItemModel(props: IProps) {
  useEffect(() => {
    (async function () {
      const model = `${props.params.model}`;
      const jItem = await FetchItems.filterOneByModel(model);

      const categoryId = jItem.dp_itemCategoryId;
      const jCategory = await FetchItemCategories.getById(categoryId);

      const brandId = jCategory.dp_itemBrandId;
      const jBrand = await FetchItemBrand.getById(brandId);

      const category = jCategory.dp_seoUrlSegment;
      const brand = jBrand.dp_seoUrlSegment;

      window.location.replace(`/products/${brand}/${category}/${model}`);
    })();
  }, [props.params.model]);

  return <div>Поиск номенклатуры ({props.params.model})</div>;
}

interface IServerSideProps {
  params: {
    model: string;
  };
}

export function getServerSideProps(context: IServerSideProps) {
  const { model } = context.params;
  const props: IProps = {
    params: { model },
  };

  return {
    props,
  };
}
