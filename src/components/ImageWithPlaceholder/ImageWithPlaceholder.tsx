import Image from 'next/image';
import { ReactNode, useState } from 'react';

interface IImageWithPlaceholder {
  src: string;
  alt?: string;
  width: number;
  height: number;
  iconHtml?: ReactNode;
  css_width?: string;
  css_height?: string;
  css_maxWidth?: string;
  css_maxHeight?: string;
}

export default function ImageWithPlaceholder(props: IImageWithPlaceholder) {
  const [loading, setLoading] = useState<boolean>(true);

  const IMAGE = (
    <Image
      src={props.src}
      alt={props.alt || 'x'}
      onLoad={() => {
        setLoading(false);
      }}
      width={props.width}
      height={props.height}
      style={{
        width: loading ? '0px' : props.css_width,
        height: loading ? '0px' : props.css_height,
        maxWidth: props.css_maxWidth,
        maxHeight: props.css_maxHeight,
      }}
    />
  );

  if (props.src == '') {
    return props.iconHtml ? <>{props.iconHtml}</> : <div>x</div>;
  }

  if (loading && props.iconHtml) {
    return (
      <>
        {props.iconHtml}
        {IMAGE}
      </>
    );
  }

  if (loading) {
    return (
      <>
        <div>IMG</div>
        {IMAGE}
      </>
    );
  }

  return IMAGE;
}
