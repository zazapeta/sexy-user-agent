export function getQueryParams(href, transform) {
  let queryParams = {};
  href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
    queryParams[key] = transform(value);
  });
  return queryParams;
}
