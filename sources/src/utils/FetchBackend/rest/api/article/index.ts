import FetchBackend from '@/utils/FetchBackend';
import GetArticleDto from './dto/get-article.dto';
import HttpException from '@/utils/FetchBackend/HttpException';

export default class FetchArticles {
  static async get() {
    const result = await FetchBackend('none', 'GET', 'articles');
    const response = result.response;

    if (response.status === 200) {
      const json: GetArticleDto[] = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }

  static async filterOneByUrl(url: string) {
    const result = await FetchBackend(
      'none',
      'GET',
      `articles/filter-one/url/${url}`,
    );
    const response = result.response;

    if (response.status === 200) {
      const json: GetArticleDto = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }
}
