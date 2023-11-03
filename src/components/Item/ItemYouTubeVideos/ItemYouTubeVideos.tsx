import { useEffect, useState } from 'react';

import styles from './ItemYouTubeVideos.module.css';
import YouTubeIframe from '@/components/YouTubeIframe/YouTubeIframe';
import ItemDto from '@/utils/FetchBackend/rest/api/items/dto/item.dto';

interface IProps {
  item: ItemDto;
}

export default function ItemYouTubeVideos(props: IProps) {
  const [ytIds, setYtIds] = useState<string[]>([]);

  useEffect(() => {
    const arr = props.item.dp_itemGalery.map(e => e.dp_photoUrl);

    const youtubeIds = arr
      .map(extractYouTubeId)
      .filter(e => e != null)
      .map(e => `${e}`);

    setYtIds(youtubeIds);
  }, [props.item]);

  function extractYouTubeId(input: string): string | null {
    const match = input.match(/\/youtube_(\w+)\.png/);
    if (match) {
      return match[1];
    }
    return null;
  }

  if (ytIds.length === 0) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <h3>Видео</h3>
      <ul>
        {ytIds.map((e, i) => {
          return (
            <li key={`${e}-${i}`}>
              <YouTubeIframe id={e} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
