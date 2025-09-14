import axios from "axios";

const API_KEY = import.meta.env.VITE_TRADING_ECONOMICS_API_KEY;

// Input sanitization function
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[^a-zA-Z0-9:,\s-]/g, "");
};

// Validate API key
if (!API_KEY) {
  throw new Error("VITE_TRADING_ECONOMICS_API_KEY is not defined");
}

// Rate limiter utility
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Track API calls to implement rate limiting
let lastApiCall = 0;
const MIN_DELAY_MS = 1000;
const makeRateLimitedRequest = async (url: string, config: any = {}) => {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCall;

  if (timeSinceLastCall < MIN_DELAY_MS) {
    const delayTime = MIN_DELAY_MS - timeSinceLastCall;
    await delay(delayTime);
  }

  lastApiCall = Date.now();
  return axios.get(url, config);
};

export const getCountryData = async (countries: string | string[]) => {
  try {
    const countryArray = Array.isArray(countries) ? countries : [countries];

    // Sanitize country names
    const sanitizedCountries = countryArray.map((country) =>
      sanitizeInput(country)
    );

    // Make sequential API calls with delays to avoid rate limiting
    const allData = [];

    for (let i = 0; i < sanitizedCountries.length; i++) {
      const country = sanitizedCountries[i];

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
      } catch (error) {
        // Continue with other countries even if one fails
      }
    }

    return allData;
  } catch (error) {
    // Log error for debugging but don't expose details to client
    console.error("Error fetching country data");
    throw new Error("Failed to fetch country data");
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
    return response.data;
  } catch (error) {
    console.error("Error fetching search categories");
    throw new Error("Failed to fetch search categories");
  }
};

export const getStockDescriptions = async (symbols: string) => {
  try {
    // Sanitize symbols input
    const sanitizedSymbols = sanitizeInput(symbols);

    const response = await makeRateLimitedRequest(
      `https://api.tradingeconomics.com/markets/stockdescriptions/symbol/${sanitizedSymbols}?c=guest:guest&f=json`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching stock descriptions");
    throw new Error("Failed to fetch stock descriptions");
  }
};

// Extract inflation rate, CPI, corruption index, and corruption rank data from country data
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
      cpi: null,
      corruptionIndex: null,
      corruptionRank: null,
    };

    // Find inflation rate
    const inflationItem = data.find(
      (item: any) => item.Category === "Inflation Rate"
    );

    if (inflationItem) {
      countryMetrics.inflationRate = {
        value: inflationItem.LatestValue,
        unit: inflationItem.Unit,
        date: inflationItem.LatestValueDate,
        category: inflationItem.Category,
      };
    }

    // Find CPI
    const cpiItem = data.find(
      (item: any) => item.Category === "Consumer Price Index CPI"
    );

    if (cpiItem) {
      countryMetrics.cpi = {
        value: cpiItem.LatestValue,
        unit: cpiItem.Unit,
        date: cpiItem.LatestValueDate,
        category: cpiItem.Category,
      };
    }

    // Find corruption index
    const corruptionIndexItem = data.find(
      (item: any) => item.Category === "Corruption Index"
    );

    if (corruptionIndexItem) {
      countryMetrics.corruptionIndex = {
        value: corruptionIndexItem.LatestValue,
        unit: corruptionIndexItem.Unit,
        date: corruptionIndexItem.LatestValueDate,
        category: corruptionIndexItem.Category,
      };
    }

    // Find corruption rank
    const corruptionRankItem = data.find(
      (item: any) => item.Category === "Corruption Rank"
    );

    if (corruptionRankItem) {
      countryMetrics.corruptionRank = {
        value: corruptionRankItem.LatestValue,
        unit: corruptionRankItem.Unit,
        date: corruptionRankItem.LatestValueDate,
        category: corruptionRankItem.Category,
      };
    }

    metrics.push(countryMetrics);
  });

  return metrics;
};
