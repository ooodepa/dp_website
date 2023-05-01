import Link from 'next/link';
import { useRouter } from 'next/router';

import ItemEntity from '@/dto/item/ItemEntity';
import ItemBrandEntity from '@/dto/item-brand/ItemBrandDto';
import ItemCategory from '@/dto/item-category/ItemCategoryDto';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Image from 'next/image';

interface IProps {
  items: ItemEntity[];
}

export default function BrandPage(props: IProps) {
  const route = useRouter();
  const { brand, category } = route.query;

  return (
    <>
      <Breadcrumbs />
      <ul>
        {props.items.map(item => {
          return (
            <li key={item.dp_id}>
              <Link href={`/products/${brand}/${category}/${item.dp_model}`}>
                <Image
                  src={item.dp_photoUrl}
                  alt=""
                  height={100}
                  width={100}
                  style={{
                    height: 'auto',
                    objectFit: 'contain',
                    position: 'relative',
                  }}
                />
                {item.dp_name}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export async function getStaticProps(context: any) {
  const { category } = context.params;

  const items: ItemEntity[] = await (
    await fetch(
      `${process.env.NEXT_JS__BACKEND_URL}/api/v1/items?category=${category}`,
    )
  ).json();

  const props: IProps = { items };
  return { props };
}

interface IServerSideProps {
  params: {
    category: string;
    brand: string;
  };
}

export async function getStaticPaths() {
  const itemsCategories: ItemCategory[] = await (
    await fetch(`${process.env.NEXT_JS__BACKEND_URL}/api/v1/item-categories`)
  ).json();

  const itemBrand: ItemBrandEntity[] = await (
    await fetch(`${process.env.NEXT_JS__BACKEND_URL}/api/v1/item-brands`)
  ).json();

  let paths: IServerSideProps[] = [];

  itemsCategories.forEach(element => {
    let brand = 'undefined';
    for (let i = 0; i < itemBrand.length; ++i) {
      if (itemBrand[i].dp_id === element.dp_itemBrandId) {
        brand = itemBrand[i].dp_urlSegment;
        break;
      }
    }

    paths.push({
      params: {
        category: element.dp_urlSegment,
        brand: brand,
      },
    });
  });

  return {
    paths,
    fallback: false,
  };
}
