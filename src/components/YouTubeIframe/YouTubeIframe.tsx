interface IProps {
  id: string;
}

export default function YouTubeIframe(props: IProps) {
  return (
    <iframe
      width="320"
      height="180"
      src={`https://www.youtube.com/embed/${props.id}`}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    />
  );
}
