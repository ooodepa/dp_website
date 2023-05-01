import Link from 'next/link';
import { useRouter } from 'next/router';

import ItemBrandDto from '@/dto/item-brand/ItemBrandDto';
import ItemCategoryDto from '@/dto/item-category/ItemCategoryDto';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Image from 'next/image';
import Head from 'next/head';

interface IProps {
  itemCategories: ItemCategoryDto[];
}

export default function BrandPage(props: IProps) {
  const route = useRouter();
  const { brand } = route.query;

  return (
    <>
      <Head>
        <title>Производители номенклатуры</title>
        <meta name="description" content="Производители номенклатуры" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Breadcrumbs />
      <ul>
        {props.itemCategories.map(itemCategory => {
          if (itemCategory.dp_isHidden) {
            return null;
          }

          return (
            <li key={itemCategory.dp_id}>
              <Link href={`/products/${brand}/${itemCategory.dp_urlSegment}`}>
                <Image
                  src={itemCategory.dp_photoUrl}
                  alt=""
                  height={100}
                  width={100}
                  style={{
                    height: 'auto',
                    objectFit: 'contain',
                    position: 'relative',
                  }}
                />
                {itemCategory.dp_name}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

interface IServerSideProps {
  params: {
    brand: string;
  };
}

export async function getStaticProps(context: IServerSideProps) {
  const { brand } = context.params;

  const URL = `${process.env.NEXT_JS__BACKEND_URL}/api/v1/item-categories?brand=${brand}`;
  const response = await fetch(URL);
  const itemCategories: ItemCategoryDto[] = await response.json();

  const props: IProps = { itemCategories };
  return { props };
}

export async function getStaticPaths() {
  const brands: ItemBrandDto[] = await (
    await fetch(`${process.env.NEXT_JS__BACKEND_URL}/api/v1/item-brands`)
  ).json();

  let paths: IServerSideProps[] = [];

  brands.forEach(element => {
    if (!element.dp_isHidden) {
      paths.push({
        params: {
          brand: element.dp_urlSegment,
        },
      });
    }
  });

  return {
    paths,
    fallback: false,
  };
}
