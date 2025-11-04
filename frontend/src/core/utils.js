import {DateTime} from "luxon";

export function getUserTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}


export function formatDate(dateString, timezone, disablePrevLabels) {
  const today = DateTime.fromISO(new Date().toISOString(), {zone: timezone});
  const taskDate = DateTime.fromISO(dateString, { zone: timezone });

  if (!disablePrevLabels) {
    if (taskDate.toISODate() === today.toISODate()) {
      return 'Сегодня';
    }

    const yesterday = today.minus({ days: 1 });
    if (taskDate.toISODate() === yesterday.toISODate()) {
      return 'Вчера';
    }

    const dayBeforeYesterday = today.minus({ days: 2 });
    if (taskDate.toISODate() === dayBeforeYesterday.toISODate()) {
      return 'Позавчера';
    }

    if (taskDate < today) {
      const daysDiff = Math.floor(today.diff(taskDate, 'days').days);
      return `${daysDiff} ${pluralize(daysDiff, ['день', 'дня', 'дней'])} назад`;
    }
  }

  const dateFormatted = taskDate.setLocale('ru').toLocaleString({
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  }).replace(' г.', '');

  return taskDate > today ? `До ${dateFormatted}` : dateFormatted;
}


export function pluralize(number, words) {
    const lastDigit = Math.abs(number) % 10;
    const lastTwoDigits = Math.abs(number) % 100;

    let wordForm;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        wordForm = words[2];
    } else if (lastDigit === 1) {
        wordForm = words[0];
    } else if (lastDigit >= 2 && lastDigit <= 4) {
        wordForm = words[1];
    } else {
        wordForm = words[2];
    }

    return wordForm;
}


export function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}


export function setDocumentTitle(title) {
  document.title = `${title} | Momentum`
}
