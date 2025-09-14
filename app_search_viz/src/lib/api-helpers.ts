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

// Extract inflation rate and auto exports data from country data
export const extractCountryMetrics = (countryData: any[]): any[] => {
  const metrics: any[] = [];

  // Group data by country
  const countryGroups = countryData.reduce((acc: any, item: any) => {
    const country = item.Country || "Unknown";
    if (!acc[country]) {
      acc[country] = [];
    }
    acc[country].push(item);
    return acc;
  }, {});

  // Extract metrics for each country
  Object.entries(countryGroups).forEach(([country, data]: [string, any]) => {
    const countryMetrics: any = {
      country: country,
      inflationRate: null,
      autoExports: null,
    };

    // Find inflation rate (look for items with Category containing "inflation" or "prices")
    const inflationItem = data.find(
      (item: any) =>
        item.Category &&
        (item.Category.toLowerCase().includes("inflation") ||
          item.Category.toLowerCase().includes("consumer price") ||
          item.Category.toLowerCase().includes("cpi"))
    );

    if (inflationItem) {
      countryMetrics.inflationRate = {
        value: inflationItem.Latest,
        unit: inflationItem.Unit,
        date: inflationItem.DateTime,
        category: inflationItem.Category,
      };
    }

    // Find auto exports (look for items with Category containing "auto" or "vehicle" and "export")
    const autoExportsItem = data.find(
      (item: any) =>
        item.Category &&
        (item.Category.toLowerCase().includes("auto") ||
          item.Category.toLowerCase().includes("vehicle") ||
          item.Category.toLowerCase().includes("motor vehicle")) &&
        item.Category.toLowerCase().includes("export")
    );

    if (autoExportsItem) {
      countryMetrics.autoExports = {
        value: autoExportsItem.Latest,
        unit: autoExportsItem.Unit,
        date: autoExportsItem.DateTime,
        category: autoExportsItem.Category,
      };
    }

    metrics.push(countryMetrics);
  });

  return metrics;
};
