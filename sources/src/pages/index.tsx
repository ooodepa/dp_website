import ReactMarkdown from 'react-markdown';

import ArticleDto from '@/dto/article/ArticleDto';
import AppHead from '@/components/AppHead/AppHead';
import AppTitle from '@/components/AppTitle/AppTitle';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import FetchArticles from '@/utils/FetchBackend/rest/api/article';
import BlogContainer from '@/components/BlogContainer/BlogContainer';
import AppDescription from '@/components/AppDescription/AppDescription';

interface IProps {
  article: ArticleDto;
}

export default function HomePage(props: IProps) {
  return (
    <AppWrapper>
      <AppTitle title="Главная" />
      <AppDescription description="Главная" />
      <AppHead />
      <BlogContainer>
        {props.article?.dp_text.split(/\\n+/).map((element, index) => {
          return <ReactMarkdown key={index}>{element}</ReactMarkdown>;
        })}
      </BlogContainer>
    </AppWrapper>
  );
}

export async function getStaticProps() {
  const article = await FetchArticles.filterOneByUrl('index');

  const props: IProps = { article };
  return { props };
}
