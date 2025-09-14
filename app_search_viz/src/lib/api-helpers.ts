import axios from "axios";
const API_KEY = import.meta.env.VITE_TRADING_ECONOMICS_API_KEY;

// Rate limiter utility
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Track API calls to implement rate limiting
let lastApiCall = 0;
const MIN_DELAY_MS = 1000; // Minimum 1 second between API calls

// Rate-limited API call function
const makeRateLimitedRequest = async (url: string, config: any = {}) => {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCall;

  if (timeSinceLastCall < MIN_DELAY_MS) {
    const delayTime = MIN_DELAY_MS - timeSinceLastCall;
    console.log(`Rate limiting: waiting ${delayTime}ms before next API call`);
    await delay(delayTime);
  }

  lastApiCall = Date.now();
  return axios.get(url, config);
};

export const getCountryData = async (countries: string | string[]) => {
  try {
    // console.log("API Key:", API_KEY);

    // Convert single country to array for consistent handling
    const countryArray = Array.isArray(countries) ? countries : [countries];

    // Make sequential API calls with delays to avoid rate limiting
    const allData = [];

    for (let i = 0; i < countryArray.length; i++) {
      const country = countryArray[i];

      try {
        const response = await makeRateLimitedRequest(
          `https://api.tradingeconomics.com/country/${country}`,
          {
            headers: {
              Authorization: API_KEY,
            },
          }
        );

        allData.push(...response.data);
        console.log(`Fetched data for ${country}:`, response.data);
      } catch (error) {
        console.error(`Error fetching data for ${country}:`, error);
        // Continue with other countries even if one fails
      }
    }

    console.log("API Data for countries:", countryArray, allData);
    return allData;
  } catch (error) {
    console.error("Error fetching country data:", error);
    throw error;
  }
};

export const listSearchTerms = async () => {
  try {
    const response = await makeRateLimitedRequest(
      `https://api.tradingeconomics.com/search/categories?c=${API_KEY}`,
      {
        headers: {
          Authorization: API_KEY,
        },
      }
    );
    console.log("API Search Categories:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching search categories:", error);
    throw error;
  }
};

export const getStockDescriptions = async (symbols: string) => {
  try {
    const response = await makeRateLimitedRequest(
      `https://api.tradingeconomics.com/markets/stockdescriptions/symbol/${symbols}?c=guest:guest&f=json`
    );
    console.log("API Stock Descriptions:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching stock descriptions:", error);
    throw error;
  }
};
