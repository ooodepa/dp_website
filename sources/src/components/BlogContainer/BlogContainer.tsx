import { ReactNode } from 'react';

import styles from './BlogContainer.module.css';

interface IProps {
  children: ReactNode;
  style?: object;
}

export default function BlogContainer(props: IProps) {
  return (
    <div className={styles.app__container} style={props.style}>
      {props.children}
    </div>
  );
}
