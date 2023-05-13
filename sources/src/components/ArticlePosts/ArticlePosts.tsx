import Link from 'next/link';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './ArticlePosts.module.css';
import AppContainer from '@/components/AppContainer/AppContainer';
import GetArticleDto from '@/utils/FetchBackend/rest/api/article/dto/get-article.dto';

interface IProps {
  article: GetArticleDto;
}

export default function ArticlePosts(props: IProps) {
  return (
    <AppContainer>
      <ul className={styles.posts}>
        {props.article.dp_articleAttachedLinks.map(element => {
          return (
            <li key={element.dp_id}>
              <Link href={element.dp_url}>
                <div className={styles.post__image_block}>
                  <FontAwesomeIcon icon={faFile} />
                </div>
                <div className={styles.post__title}>{element.dp_name}</div>
              </Link>
            </li>
          );
        })}
      </ul>
    </AppContainer>
  );
}
