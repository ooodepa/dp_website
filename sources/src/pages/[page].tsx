import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

import AppHead from '@/components/AppHead/AppHead';
import AppTitle from '@/components/AppTitle/AppTitle';
import YandexMap from '@/components/YandexMap/YandexMap';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import AppKeywords from '@/components/AppKeywords/AppKeywords';
import FetchHelpers from '@/utils/FetchBackend/rest/api/helpers';
import ContactPosts from '@/components/ContactPosts/ContactPosts';
import ArticlePosts from '@/components/ArticlePosts/ArticlePosts';
import FetchArticles from '@/utils/FetchBackend/rest/api/article';
import BlogContainer from '@/components/BlogContainer/BlogContainer';
import AppDescription from '@/components/AppDescription/AppDescription';
import { AsyncAlertExceptionHelper } from '@/utils/AlertExceptionHelper';
import FetchContactTypes from '@/utils/FetchBackend/rest/api/contact-types';
import GetHelperDto from '@/utils/FetchBackend/rest/api/helpers/dto/get-helper.dto';
import GetArticleDto from '@/utils/FetchBackend/rest/api/article/dto/get-article.dto';
import GetContactTypeDto from '@/utils/FetchBackend/rest/api/contact-types/dto/get-contact-type.dto';

interface IProps {
  article: GetArticleDto;
  helpers: GetHelperDto[];
  contactTypes: GetContactTypeDto[];
}

export default function BrandPage(props: IProps) {
  const route = useRouter();
  const { page } = route.query;
  const [data, setData] = useState<GetArticleDto>(props.article);

  useEffect(() => {
    (async function () {
      try {
        const jArticle = await FetchArticles.filterOneByUrl(`${page}`);
        setData(jArticle);
      } catch (exception) {
        await AsyncAlertExceptionHelper(exception);
      }
    })();
  }, [page]);

  return (
    <AppWrapper>
      <AppTitle title={data.dp_name} />
      <AppDescription description={data.dp_seoDescription} />
      <AppKeywords keywords={data.dp_seoKeywords} />
      <AppHead />
      <Breadcrumbs />
      {page !== 'contacts' ? null : <YandexMap />}
      <h1>{data.dp_name}</h1>
      {page !== 'contacts' ? null : (
        <ContactPosts
          helpers={props.helpers}
          contactTypes={props.contactTypes}
        />
      )}
      <ArticlePosts article={data} />
      <BlogContainer>
        {data?.dp_text.split(/\\n+/).map((element, index) => {
          return <ReactMarkdown key={index}>{element}</ReactMarkdown>;
        })}
      </BlogContainer>
    </AppWrapper>
  );
}

interface IServerSideProps {
  params: {
    page: string;
  };
}

export async function getStaticProps(context: IServerSideProps) {
  const { page } = context.params;

  const article = await FetchArticles.filterOneByUrl(page);
  let helpers: GetHelperDto[] = [];
  let contactTypes: GetContactTypeDto[] = [];

  if (page === 'contacts') {
    helpers = await FetchHelpers.get();
    contactTypes = await FetchContactTypes.get();
  }

  const props: IProps = { article, helpers, contactTypes };
  return {
    props,
    revalidate: 60, // Перегенерация страницы каждые 60 секунд
  };
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
    fallback: 'blocking', // Используйте обработку ошибок 404 и ISR
  };
}
