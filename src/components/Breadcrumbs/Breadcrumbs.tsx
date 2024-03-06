import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import styles from './Breadcrumbs.module.css';
import AppContainer from '@/components/AppContainer/AppContainer';

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
        const decodePath = decodeURIComponent(path);
        return {
          breadcrumb: decodePath,
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
          {breadcrumbs.map(breadcrumb => {
            return breadcrumb.breadcrumb ? (
              <li key={breadcrumb.href}>
                <Link href={breadcrumb.href}>{breadcrumb.breadcrumb}</Link>
              </li>
            ) : null;
          })}
        </ol>
      </AppContainer>
    </nav>
  );
};

export default Breadcrumbs;
