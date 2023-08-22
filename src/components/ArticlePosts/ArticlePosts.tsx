import Link from 'next/link';
import Image from 'next/image';
import {
  faFilePdf,
  faFileDownload,
  faFileExcel,
  faFileCsv,
  faFileWord,
  faFilePowerpoint,
  faFileImage,
  faFileZipper,
  faFileText,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './ArticlePosts.module.css';
import AppContainer from '@/components/AppContainer/AppContainer';
import GetArticleDto from '@/utils/FetchBackend/rest/api/article/dto/get-article.dto';

interface IProps {
  article: GetArticleDto;
}

export default function ArticlePosts(props: IProps) {
  function getIcon(path: string) {
    if (path.endsWith('.pdf')) {
      return faFilePdf;
    }

    if (
      path.endsWith('.xlsx') ||
      path.endsWith('.xls') ||
      path.endsWith('.ods')
    ) {
      return faFileExcel;
    }

    if (path.endsWith('.csv')) {
      return faFileCsv;
    }

    if (
      path.endsWith('.doc') ||
      path.endsWith('.docx') ||
      path.endsWith('.ods')
    ) {
      return faFileWord;
    }

    if (path.endsWith('.ppt') || path.endsWith('.odp')) {
      return faFilePowerpoint;
    }

    if (
      path.endsWith('.jpg') ||
      path.endsWith('.png') ||
      path.endsWith('.webp')
    ) {
      return faFileImage;
    }

    if (
      path.endsWith('.zip') ||
      path.endsWith('.7zip') ||
      path.endsWith('.rar')
    ) {
      return faFileZipper;
    }

    if (path.endsWith('.txt')) {
      return faFileText;
    }

    return faFileDownload;
  }

  return (
    <AppContainer>
      <ul className={styles.posts}>
        {props.article.dp_articleAttachedLinks.map(element => {
          return (
            <li key={element.dp_id}>
              <Link href={element.dp_url} title="Просмотреть">
                <div className={styles.post__image_block}>
                  {element.dp_photoUrl === '' ? (
                    <FontAwesomeIcon icon={getIcon(element.dp_url)} />
                  ) : (
                    <Image
                      src={element.dp_photoUrl}
                      alt="x"
                      width={180}
                      height={200}
                      style={{
                        width: 'auto',
                        height: 'auto',
                        textAlign: 'center',
                        maxWidth: '180px',
                        maxHeight: '200px',
                      }}
                    />
                  )}
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
