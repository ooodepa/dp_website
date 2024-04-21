import GetItemDto from './dto/get-item.dto';
import FetchBackend from '@/utils/FetchBackend';
import UpdateItemDto from './dto/update-item.dto';
import CreateItemDto from './dto/create-item.dto';
import SearchItemDto from './dto/search-item.dto';
import FilterItemsByModelsDto from './dto/filter-models.dto';
import HttpException from '@/utils/FetchBackend/HttpException';
import GetItemPagination from './dto/get-item-pagination.dto';
import GetItemBreadcrumbs from './dto/get-item-breadcrumbs.dto';
import FindAllItemsByVendors from './dto/find-all-items-by-vendors.dto';

interface QueryItemPagination {
  dp_1cParentId?: string;
  page?: number;
  limit?: number;
}

export default class FetchItems {
  static async get() {
    const result = await FetchBackend('none', 'GET', 'items');
    const response = result.response;

    if (response.status === 200) {
      const json: GetItemDto[] = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }

  static async getFolders(dp_1cParentId: string) {
    const result = await FetchBackend(
      'none',
      'GET',
      `items?dp_1cParentId=${dp_1cParentId}`,
    );
    const response = result.response;

    if (response.status === 200) {
      const json: GetItemDto[] = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }

  static async getPagination(query: QueryItemPagination) {
    let uri = `items/pagination?`;
    if (query.limit) {
      uri += `limit=${query.limit}&`;
    }

    if (query.page) {
      uri += `page=${query.page}&`;
    }

    if (query.dp_1cParentId) {
      uri += `dp_1cParentId=${query.dp_1cParentId}&`;
    }

    const result = await FetchBackend('none', 'GET', uri);
    const response = result.response;

    if (response.status === 200) {
      const json: GetItemPagination = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }

  static async getByBrand(brand: string) {
    const result = await FetchBackend('none', 'GET', `items?brand=${brand}`);
    const response = result.response;

    if (response.status === 200) {
      const json: GetItemDto[] = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }

  static async getById(id: string) {
    const result = await FetchBackend('none', 'GET', `items/${id}`);
    const response = result.response;

    if (response.status === 200) {
      const json: GetItemDto = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }

  static async filterByCategory(category: string) {
    const result = await FetchBackend(
      'none',
      'GET',
      `items?category=${category}`,
    );
    const response = result.response;

    if (response.status === 200) {
      const json: GetItemDto[] = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }

  static async filterByBrand(brand: string) {
    const result = await FetchBackend('none', 'GET', `items?brand=${brand}`);
    const response = result.response;

    if (response.status === 200) {
      const json: GetItemDto[] = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }

  static async filterOneByModel(model: string) {
    const result = await FetchBackend(
      'none',
      'GET',
      `items/filter-one/model/${model}`,
    );
    const response = result.response;

    if (response.status === 200) {
      const json: GetItemDto = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }

  static async filterByModels(dto: FilterItemsByModelsDto) {
    const result = await FetchBackend(
      'none',
      'POST',
      'items/filter/models',
      dto,
    );
    const response = result.response;

    if (response.status === 200) {
      const json: GetItemDto[] = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }

  static async filterByVendors(dto: FindAllItemsByVendors) {
    const result = await FetchBackend(
      'none',
      'POST',
      'items/filter/vendor',
      dto,
    );
    const response = result.response;

    if (response.status === 200) {
      const json: GetItemDto[] = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }

  static async getBreadcrumbs(model: string) {
    const result = await FetchBackend(
      'none',
      'GET',
      `items/filter/breadcrumbs/model/${model}`,
    );
    const response = result.response;

    if (response.status === 200) {
      const json: GetItemBreadcrumbs[] = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }

  static async create(dto: CreateItemDto) {
    const result = await FetchBackend('access', 'POST', 'items', dto);
    const response = result.response;

    if (response.status === 201) {
      return true;
    }

    throw new HttpException(result.method, response);
  }

  static async update(id: string, dto: UpdateItemDto) {
    const result = await FetchBackend('access', 'PATCH', `items/${id}`, dto);
    const response = result.response;

    if (response.status === 200) {
      return true;
    }

    throw new HttpException(result.method, response);
  }

  static async remove(id: string) {
    const result = await FetchBackend('access', 'DELETE', `items/${id}`);
    const response = result.response;

    if (response.status === 200) {
      return true;
    }

    throw new HttpException(result.method, response);
  }

  static async search(dto: SearchItemDto) {
    const result = await FetchBackend('none', 'POST', `items/search`, dto);
    const response = result.response;

    if (response.status === 200) {
      const json: GetItemDto[] = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }
}
