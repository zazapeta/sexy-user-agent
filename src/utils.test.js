import { getQueryParams } from './utils';

it('Should return the query parameters', () => {
  expect(
    getQueryParams('https://just.at/?a=11&b=222', (str) => str.concat('1')),
  ).toMatchObject({
    a: '111',
    b: '2221',
  });
});

it('Should return the query parameters complex', () => {
  const ua =
    '%22Mozilla/5.0%20(X11;%20Linux%20x86_64)%20AppleWebKit/537.36%20(KHTML,%20like%20Gecko)%20Chrome/69.0.3497.100%20Safari/537.36%22';
  const cw = '1920';
  const ch = '800';
  const lang = 'FR';
  expect(
    getQueryParams(
      `https://sexy-user-agent.netlify.com?ua=${ua}&cw=${cw}&ch=${ch}&lg=${lang}`,
      decodeURI,
    ),
  ).toMatchObject({
    ua: decodeURI(ua),
    cw: decodeURI(cw),
    ch: decodeURI(ch),
    lg: decodeURI(lang),
  });
});
