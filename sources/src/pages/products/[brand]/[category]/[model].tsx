import { useRouter } from 'next/router';

import ItemEntity from '@/dto/item/ItemEntity';
import ItemBrandEntity from '@/dto/item-brand/ItemBrandDto';
import ItemCategory from '@/dto/item-category/ItemCategoryDto';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Image from 'next/image';

interface IProps {
  item: ItemEntity;
}

export default function ModelPage(props: IProps) {
  const route = useRouter();
  const { brand, category, model } = route.query;

  return (
    <div>
      <Breadcrumbs />

      <Image
        src={props.item.dp_photoUrl}
        alt=""
        height={100}
        width={100}
        style={{
          height: 'auto',
          objectFit: 'contain',
          position: 'relative',
        }}
      />
      {props.item.dp_name}
    </div>
  );
}

export async function getStaticProps(context: any) {
  const { model } = context.params;

  const item: ItemEntity = await (
    await fetch(
      `${process.env.NEXT_JS__BACKEND_URL}/api/v1/items/model/${model}`,
    )
  ).json();

  const props: IProps = { item };
  return { props };
}

interface IServerSideProps {
  params: {
    category: string;
    brand: string;
    model: string;
  };
}

export async function getStaticPaths() {
  const itemsCategories: ItemCategory[] = await (
    await fetch(`${process.env.NEXT_JS__BACKEND_URL}/api/v1/item-categories`)
  ).json();

  const itemBrand: ItemBrandEntity[] = await (
    await fetch(`${process.env.NEXT_JS__BACKEND_URL}/api/v1/item-brands`)
  ).json();

  const items: ItemEntity[] = await (
    await fetch(`${process.env.NEXT_JS__BACKEND_URL}/api/v1/items`)
  ).json();

  let paths: IServerSideProps[] = [];

  items.forEach(element => {
    let category = 'undefined';
    let categoryBrandId = 0;
    for (let i = 0; i < itemsCategories.length; ++i) {
      if (element.dp_itemCategoryId == itemsCategories[i].dp_id) {
        category = itemsCategories[i].dp_urlSegment;
        categoryBrandId = itemsCategories[i].dp_itemBrandId;
        break;
      }
    }

    let brand = 'undefined';

    for (let i = 0; i < itemBrand.length; ++i) {
      if (categoryBrandId == itemBrand[i].dp_id) {
        brand = itemBrand[i].dp_urlSegment;
        break;
      }
    }

    paths.push({
      params: {
        model: element.dp_model,
        category,
        brand,
      },
    });
  });

  return {
    paths,
    fallback: false,
  };
}
