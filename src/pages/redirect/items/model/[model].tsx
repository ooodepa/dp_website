import FetchItems from '@/utils/FetchBackend/rest/api/items';
import FetchItemBrand from '@/utils/FetchBackend/rest/api/item-brands';
import FetchItemCategories from '@/utils/FetchBackend/rest/api/item-categories';

export default function RedirectItemModel() {
  return null;
}

interface IServerSideProps {
  params: {
    model: string;
  };
}

export async function getServerSideProps(context: IServerSideProps) {
  const model = `${context.params.model}`;
  const jItem = await FetchItems.filterOneByModel(model);

  const categoryId = jItem.dp_itemCategoryId;
  const jCategory = await FetchItemCategories.getById(categoryId);

  const brandId = jCategory.dp_itemBrandId;
  const jBrand = await FetchItemBrand.getById(brandId);

  const category = jCategory.dp_urlSegment;
  const brand = jBrand.dp_urlSegment;

  return {
    redirect: {
      destination: `/products/${brand}/${category}/${model}`,
      permanent: false, // Set to true for permanent redirection, false for temporary
    },
  };
}
