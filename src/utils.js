import UAParser from 'ua-parser-js';

export function getQueryParams(href, transform) {
  let queryParams = {};
  href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
    queryParams[key] = transform(value);
  });
  return queryParams;
}

/**
 * @return {Object} {
    device: parser.getDevice(),
    browser: parser.getBrowser(),
    os: parser.getOS(),
  }
 */
export function getUserInfosFromUserAgent(userAgent) {
  const parser = new UAParser();
  parser.setUA(userAgent);
  return {
    device: parser.getDevice(),
    browser: parser.getBrowser(),
    os: parser.getOS(),
  };
}
