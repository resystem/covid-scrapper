import puppeteer from 'puppeteer-serverless';
import { getChrome } from './chrome-script';

const headers = {
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

const uri = 'https://news.google.com/covid19/map?hl=pt-BR&gl=BR&ceid=BR:pt-419';

/**
 * function that to scrapper google covid-19 page get Brazil informations
 * @returns {object} containt status, covid-19 success data or error
 */
export default async () => {
  const chrome = await getChrome();
  const browser = await puppeteer.connect({
    browserWSEndpoint: chrome.endpoint,
  });
  const page = await browser.newPage();
  let data;
  try {
    await page.goto(uri);
    data = await page.evaluate(() => {
      // eslint-disable-next-line no-undef
      const elements = document.querySelectorAll('div > div > div > table > tbody > tr')[0];
      console.log(elements);
      return {};
    });

    await browser.close();
  } catch (err) {
    return ({
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'scrapper/internal-server-error' }),
    });
  }

  return ({
    statusCode: 200,
    headers,
    body: JSON.stringify({ status: 'scrapper/success', data }),
  });
};
