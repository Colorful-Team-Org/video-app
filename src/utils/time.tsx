export const timeSince = (date: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    if (Math.floor(interval) === 1) {
      return Math.floor(interval) + ' year';
    }
    return Math.floor(interval) + ' years';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    if (Math.floor(interval) === 1) {
      return Math.floor(interval) + ' month';
    }
    return Math.floor(interval) + ' months';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    if (Math.floor(interval) === 1) {
      return Math.floor(interval) + ' day';
    }
    return Math.floor(interval) + ' days';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    if (Math.floor(interval) === 1) {
      return Math.floor(interval) + ' hour';
    }
    return Math.floor(interval) + ' hours';
  }
  interval = seconds / 60;
  if (interval > 1) {
    if (Math.floor(interval) === 1) {
      return Math.floor(interval) + ' minute';
    }
    return Math.floor(interval) + ' minutes';
  }
  return Math.floor(seconds) + ' seconds';
};

export const timeDuration = (duration: number) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration - hours * 3600) / 60);
  const seconds = Math.floor(duration - hours * 3600 - minutes * 60);

  let result = minutes < 10 ? '0' + minutes : minutes;
  result += ':' + (seconds < 10 ? '0' + seconds : seconds);
  return result;
};
