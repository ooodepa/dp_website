import Markdown from 'react-markdown';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import AppHead from '@/components/AppHead/AppHead';
import AppTitle from '@/components/AppTitle/AppTitle';
import YandexMap from '@/components/YandexMap/YandexMap';
import AppWrapper from '@/components/AppWrapper/AppWrapper';
import HttpException from '@/utils/FetchBackend/HttpException';
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
  const [dataArticle, setDataArticle] = useState<GetArticleDto>(props.article);

  useEffect(() => {
    (async function () {
      try {
        const jArticle = await FetchArticles.filterOneByUrl(`${page}`);
        setDataArticle(jArticle);
      } catch (exception) {
        await AsyncAlertExceptionHelper(exception);
        setDataArticle(props.article);
      }
    })();
  }, [page, props.article]);

  return (
    <AppWrapper>
      <AppTitle title={dataArticle.dp_name} />
      <AppDescription description={dataArticle.dp_seoDescription} />
      <AppKeywords keywords={dataArticle.dp_seoKeywords} />
      <AppHead />
      <Breadcrumbs />
      {page !== 'contacts' ? null : <YandexMap />}
      <h1>{dataArticle.dp_name}</h1>
      {page !== 'contacts' ? null : (
        <ContactPosts
          helpers={props.helpers}
          contactTypes={props.contactTypes}
        />
      )}
      <ArticlePosts article={dataArticle} />
      <BlogContainer>
        <Markdown>{dataArticle?.dp_text || ''}</Markdown>
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

  try {
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
  } catch (exception) {
    if (exception instanceof HttpException && exception.HTTP_STATUS === 404) {
      return {
        notFound: true, // Возвращаем статус 404
      };
    }

    throw exception;
  }
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
