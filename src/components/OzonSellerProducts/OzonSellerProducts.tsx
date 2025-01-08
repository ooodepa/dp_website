import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './OzonSellerProducts.module.css';
import OzonProductDto from '@/types/api/OzonProduct.dto';
import AppContainer from '@/components/AppContainer/AppContainer';
import ImageWithPlaceholder from '@/components/ImageWithPlaceholder/ImageWithPlaceholder';

interface IProps {
  ozonProducts: OzonProductDto[];
}

export default function OzonSellerProductsPage(props: IProps) {
  if (props.ozonProducts.length == 0) {
    return null;
  }

  return (
    <AppContainer>
      <h2>Продукция на OZON</h2>
      <ul className={styles.ul}>
        {props.ozonProducts.map(e => {
          const HREF = `https://ozon.ru/products/${e.sku}`;
          const PRIMARY_IMAGE = e.primary_image;
          return (
            <li className={styles.li} key={e.id}>
              <div className={styles.wrapper}>
                <div className={styles.content}>
                  <div className={styles.post__image_b}>
                    <ImageWithPlaceholder
                      src={PRIMARY_IMAGE}
                      iconHtml={
                        <FontAwesomeIcon
                          icon={faImage}
                          width={100}
                          color="var(--site-color)"
                        />
                      }
                      width={120}
                      height={120}
                      css_width="auto"
                      css_height="auto"
                      css_maxWidth="120px"
                      css_maxHeight="120px"
                      alt="x"
                    />
                  </div>
                  <div className={styles.post__name}>{e.name}</div>
                  <div className={styles.post__count}>
                    Остатки: {e.stocks__present}
                  </div>
                </div>
                <div className={styles.footer}>
                  {e.sku == 0 ? null : (
                    <a href={HREF} className={styles.a}>
                      Заказать на OZON
                    </a>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </AppContainer>
  );
}
