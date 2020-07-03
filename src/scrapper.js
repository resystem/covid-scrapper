import chromium from 'chrome-aws-lambda';

// default browser viewport size
const defaultViewport = {
  width: 1440,
  height: 1080,
};

// google covid-19 uri
const uri = 'https://news.google.com/covid19/map?hl=pt-BR&gl=BR&ceid=BR:pt-419';

// response headers
const headers = {
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

/**
 * function that to scrapper google covid-19 page get Brazil informations
 * @returns {object} containt status, covid-19 success data or error
 */
export default async () => {
  // launch a headless browser
  const browser = await chromium.puppeteer.launch({
    args: [...chromium.args, 'no-sandbox'],
    defaultViewport,
    executablePath: await chromium.executablePath,
    headless: false,
  });

  // open a new tab
  const page = await browser.newPage();
  let data;
  try {
    // navigate to the page
    await page.goto(uri);
    data = await page.evaluate(() => {
      // eslint-disable-next-line no-undef
      const elements = document.querySelectorAll('div > div > div > table > tbody > tr')[0];
      console.log(elements);
      return { text: 'foi' };
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
