import AppEnv from '@/AppEnv';
import ArticleDto from '@/dto/article/ArticleDto';
import HttpException from '@/utils/FetchBackend/HttpException';

export default class FetchArticles {
  static async get() {
    const URL = `${AppEnv.NEXT_PUBLIC__BACKEND_URL}/api/v1/articles`;
    const response = await fetch(URL);
    if (response.status === 200) {
      const json: ArticleDto[] = await response.json();
      return json;
    }
    throw new HttpException('GET', response);
  }

  static async filterOneByUrl(url: string) {
    const URL = `${AppEnv.NEXT_PUBLIC__BACKEND_URL}/api/v1/articles/filter-one/url/${url}`;
    const response = await fetch(URL);
    if (response.status === 200) {
      const json: ArticleDto = await response.json();
      return json;
    }
    throw new HttpException('GET', response);
  }
}
