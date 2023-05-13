import { useRouter } from 'next/router';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

import AppMap from '@/components/AppMap/AppMap';
import HelperDto from '@/dto/helpers/HelperDto';
import AppHead from '@/components/AppHead/AppHead';
import AppTitle from '@/components/AppTitle/AppTitle';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import AppKeywords from '@/components/AppKeywords/AppKeywords';
import ContactTypeDto from '@/dto/contact-types/ContactTypeDto';
import FetchHelpers from '@/utils/FetchBackend/rest/api/helpers';
import ContactPosts from '@/components/ContactPosts/ContactPosts';
import ArticlePosts from '@/components/ArticlePosts/ArticlePosts';
import FetchArticles from '@/utils/FetchBackend/rest/api/article';
import BlogContainer from '@/components/BlogContainer/BlogContainer';
import AppDescription from '@/components/AppDescription/AppDescription';
import FetchContactTypes from '@/utils/FetchBackend/rest/api/contact-types';
import GetArticleDto from '@/utils/FetchBackend/rest/api/article/dto/get-article.dto';

interface IProps {
  article: GetArticleDto;
  helpers: HelperDto[];
  contactTypes: ContactTypeDto[];
}

interface IServerSideProps {
  params: {
    page: string;
  };
}

export default function BrandPage(props: IProps) {
  const route = useRouter();
  const { page } = route.query;

  return (
    <AppWrapper>
      <AppTitle title={props.article.dp_name} />
      <AppDescription description={props.article.dp_seoDescription} />
      <AppKeywords keywords={props.article.dp_seoKeywords} />
      <AppHead />
      <Breadcrumbs />
      {page !== 'contacts' ? null : <AppMap />}
      <h1>{props.article.dp_name}</h1>
      {page !== 'contacts' ? null : (
        <ContactPosts
          helpers={props.helpers}
          contactTypes={props.contactTypes}
        />
      )}
      <ArticlePosts article={props.article} />
      <BlogContainer>
        {props.article?.dp_text.split(/\\n+/).map((element, index) => {
          return <ReactMarkdown key={index}>{element}</ReactMarkdown>;
        })}
      </BlogContainer>
    </AppWrapper>
  );
}

export async function getStaticProps(context: IServerSideProps) {
  const { page } = context.params;

  const article = await FetchArticles.filterOneByUrl(page);
  let helpers: HelperDto[] = [];
  let contactTypes: ContactTypeDto[] = [];

  if (page === 'contacts') {
    helpers = await FetchHelpers.get();
    contactTypes = await FetchContactTypes.get();
  }

  const props: IProps = { article, helpers, contactTypes };
  return { props };
}

export async function getStaticPaths() {
  const articles = await FetchArticles.get();

  let paths: IServerSideProps[] = [];

  articles.forEach(element => {
    if (element.dp_urlSegment !== 'index') {
      paths.push({
        params: {
          page: element.dp_urlSegment,
        },
      });
    }
  });

  return {
    paths,
    fallback: false,
  };
}
