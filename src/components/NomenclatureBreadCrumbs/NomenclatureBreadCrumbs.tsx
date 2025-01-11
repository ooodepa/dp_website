import { useEffect, useState } from 'react';
import Link from 'next/link';
import GetItemBreadcrumbs from '@/utils/FetchBackend/rest/api/items/dto/get-item-breadcrumbs.dto';
import AppContainer from '../AppContainer/AppContainer';
import styles from './NomenclatureBreadCrumbs.module.css';
import FetchItems from '@/utils/FetchBackend/rest/api/items';

interface IProps {
  model: string;
}

export default function NomenclatureBreadCrumbs(props: IProps) {
  const [breadcrumbs, setBreadcrumbs] = useState<GetItemBreadcrumbs[]>([]);

  useEffect(() => {
    if (props.model.length === 0) {
      return;
    }

    (async function () {
      try {
        const jBreadcrumbs = await FetchItems.getBreadcrumbs(props.model);
        setBreadcrumbs(jBreadcrumbs);
      } catch (exception) {}
    })();
  }, [props.model]);

  return (
    <div className={styles.breadcrumbs__wrapper}>
      <AppContainer>
        <ul className={styles.breadcrumbs__ul}>
          <li className={styles.breadcrumbs__li}>
            <Link href={`/`} className={styles.breadcrumbs__a}>
              home
            </Link>
          </li>
          {breadcrumbs.map((e, index) => {
            if (index === 0) {
              return (
                <li key={e.dp_id} className={styles.breadcrumbs__li}>
                  <Link
                    href={`/nomenclature`}
                    className={styles.breadcrumbs__a}>
                    nomenclature
                  </Link>
                </li>
              );
            }
            return (
              <li key={e.dp_id} className={styles.breadcrumbs__li}>
                <Link
                  href={`/nomenclature/${e.dp_seoUrlSegment}`}
                  className={styles.breadcrumbs__a}>
                  {e.dp_seoUrlSegment}
                </Link>
              </li>
            );
          })}
        </ul>
      </AppContainer>
    </div>
  );
}
