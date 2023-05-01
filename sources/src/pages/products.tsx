import Link from 'next/link';
import Image from 'next/image';

import ItemBrandDto from '@/dto/item-brand/ItemBrandDto';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';

interface IProps {
  brands: ItemBrandDto[];
}

export default function BrandsPage(props: IProps) {
  return (
    <>
      <Breadcrumbs />
      <ul>
        {props.brands.map(element => {
          if (element.dp_isHidden) {
            return null;
          }

          return (
            <li key={element.dp_id}>
              <Link href={`/products/${element.dp_urlSegment}`}>
                <Image
                  src={element.dp_photoUrl}
                  alt=""
                  height={100}
                  width={100}
                  style={{
                    height: 'auto',
                    objectFit: 'contain',
                    position: 'relative',
                  }}
                />
                {element.dp_name}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export async function getStaticProps() {
  const URL = `${process.env.NEXT_JS__BACKEND_URL}/api/v1/item-brands`;
  const response = await fetch(URL);
  const brands: ItemBrandDto[] = await response.json();

  return {
    props: { brands },
  };
}
