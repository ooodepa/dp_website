let apiCache: { [key: string]: any } = {}; // Кэш в памяти

// Функция для кэшированного запроса
export default async function fetchWithCache(
  url: string,
  cacheDuration = 60,
): Promise<any> {
  const now = Date.now();

  // Если данные в кэше и не устарели
  if (apiCache[url] && now - apiCache[url].timestamp < cacheDuration * 1000) {
    return apiCache[url].data;
  }

  // Запрашиваем новые данные
  const response = await fetch(url);

  if (response.status !== 200) {
    throw new Error(`HTTP status ${response.status}`);
  }

  const data = await response.json();

  // Сохраняем данные в кэш
  apiCache[url] = {
    data,
    timestamp: now,
  };

  return data;
}
