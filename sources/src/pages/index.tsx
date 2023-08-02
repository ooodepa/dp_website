import ReactMarkdown from 'react-markdown';

import Search from '@/components/Search/Search';
import AppHead from '@/components/AppHead/AppHead';
import AppTitle from '@/components/AppTitle/AppTitle';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import FetchArticles from '@/utils/FetchBackend/rest/api/article';
import BlogContainer from '@/components/BlogContainer/BlogContainer';
import AppDescription from '@/components/AppDescription/AppDescription';
import GetArticleDto from '@/utils/FetchBackend/rest/api/article/dto/get-article.dto';

interface IProps {
  article: GetArticleDto;
}

export default function HomePage(props: IProps) {
  return (
    <AppWrapper>
      <AppTitle title="Главная" />
      <AppDescription description="Главная" />
      <AppHead />
      <Search />
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
