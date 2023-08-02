class DataController {
  static getStringTime(d = new Date(), secondsUse = false) {
    const ye = d.getFullYear();

    const tmo = d.getMonth() + 1;
    const mo: string = tmo < 10 ? `0${tmo}` : `${tmo}`;

    const tda = d.getDate();
    const da = tda < 10 ? `0${tda}` : `${tda}`;

    const tho = d.getHours();
    const ho = tho < 10 ? `0${tho}` : `${tho}`;

    const tmi = d.getMinutes();
    const mi = tmi < 10 ? `0${tmi}` : `${tmi}`;

    const tms = d.getSeconds();
    const ms = tms < 10 ? `0${tms}` : `${tms}`;
    const txt = secondsUse ? `:${ms}` : '';

    return `${ye}-${mo}-${da} ${ho}:${mi}${txt}`;
  }

  static getTimeAgo(date: Date) {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    const intervals = {
      год: 31536000,
      месяц: 2592000,
      день: 86400,
      час: 3600,
      минута: 60,
      секунда: 1,
    };
    for (const [intervalName, intervalSeconds] of Object.entries(intervals)) {
      const intervalCount = Math.floor(seconds / intervalSeconds);
      if (intervalCount >= 1) {
        switch (intervalName) {
          case 'год':
            return `${intervalCount} ${DataController.declOfNum(intervalCount, [
              'год',
              'года',
              'лет',
            ])} назад`;
          case 'месяц':
            return `${intervalCount} ${DataController.declOfNum(intervalCount, [
              'месяц',
              'месяца',
              'месяцев',
            ])} назад`;
          case 'день':
            return `${intervalCount} ${DataController.declOfNum(intervalCount, [
              'день',
              'дня',
              'дней',
            ])} назад`;
          case 'час':
            return `${intervalCount} ${DataController.declOfNum(intervalCount, [
              'час',
              'часа',
              'часов',
            ])} назад`;
          case 'минута':
            return `${intervalCount} ${DataController.declOfNum(intervalCount, [
              'минута',
              'минуты',
              'минут',
            ])} назад`;
          case 'секунда':
            return `${intervalCount} ${DataController.declOfNum(intervalCount, [
              'секунда',
              'секунды',
              'секунд',
            ])} назад`;
        }
      }
    }
    return 'только что';
  }

  static declOfNum(n: number, titles: [string, string, string]) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[n % 100 > 4 && n % 100 < 20 ? 2 : cases[Math.min(n % 10, 5)]];
  }
}

export default DataController;
