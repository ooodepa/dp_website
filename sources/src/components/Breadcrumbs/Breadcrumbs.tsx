import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import styles from './Breadcrumbs.module.css';
import AppContainer from '@/components/AppContainer/AppContainer';

const convertBreadcrumb = (string: string) => {
  return string;
};

const Breadcrumbs = () => {
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState([
    {
      breadcrumb: '',
      href: '',
    },
  ]);

  useEffect(() => {
    if (router) {
      const linkPath = router.asPath.split('/');
      linkPath.shift();

      const pathArray = linkPath.map((path, i) => {
        return {
          breadcrumb: path,
          href: '/' + linkPath.slice(0, i + 1).join('/'),
        };
      });

      setBreadcrumbs(pathArray);
    }
  }, [router]);

  if (!breadcrumbs) {
    return null;
  }

  return (
    <nav className={styles.breadcrumbs}>
      <AppContainer>
        <ol>
          <li>
            <Link href="/">home</Link>
          </li>
          {breadcrumbs.map((breadcrumb, i) => {
            return (
              <li key={breadcrumb.href}>
                <Link href={breadcrumb.href}>
                  {convertBreadcrumb(breadcrumb.breadcrumb)}
                </Link>
              </li>
            );
          })}
        </ol>
      </AppContainer>
    </nav>
  );
};

export default Breadcrumbs;
