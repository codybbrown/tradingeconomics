import axios from "axios";
const API_KEY = import.meta.env.VITE_TRADING_ECONOMICS_API_KEY;

export const getCountryData = async (country: string) => {
  try {
    // console.log("API Key:", API_KEY);

    const response = await axios.get(
      `https://api.tradingeconomics.com/country/${country}`,
      {
        headers: {
          Authorization: API_KEY,
        },
      }
    );
    console.log("API Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching country data:", error);
    throw error;
  }
};

export const listSearchTerms = async () => {
  try {
    const response = await axios.get(
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
    const response = await axios.get(
      `https://api.tradingeconomics.com/markets/stockdescriptions/symbol/${symbols}?c=guest:guest&f=json`
    );
    console.log("API Stock Descriptions:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching stock descriptions:", error);
    throw error;
  }
};

export const getStockSnapshot = async (symbols: string) => {
  try {
    const response = await axios.get(
      `https://api.tradingeconomics.com/markets/symbol/${symbols}?c=guest:guest&f=json`
    );
    console.log("API Stock Snapshot:", response.data);

    // Check if response contains the free account limitation message
    if (Array.isArray(response.data) && response.data.length > 0) {
      const firstItem = response.data[0];
      if (
        firstItem.Country &&
        firstItem.Country.includes("Free accounts have access")
      ) {
        console.warn(
          "Free account limitation detected. Using mock data instead."
        );
        return generateMockStockData(symbols);
      }
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching stock snapshot:", error);
    // Return mock data as fallback
    return generateMockStockData(symbols);
  }
};

// Generate mock stock data for demonstration purposes
const generateMockStockData = (symbols: string) => {
  const symbolList = symbols.split(",").map((s) => s.trim());
  return symbolList.map((symbol, index) => ({
    Symbol: symbol,
    Ticker: symbol.split(":")[0],
    Name: getCompanyName(symbol),
    Country: "United States",
    Last: 150 + index * 25 + Math.random() * 50,
    DailyChange: (Math.random() - 0.5) * 10,
    DailyPercentualChange: (Math.random() - 0.5) * 5,
    MarketCap: 1000000000 + index * 500000000 + Math.random() * 1000000000,
    State: Math.random() > 0.5 ? "OPEN" : "CLOSED",
    Type: "stocks",
    Unit: "USD",
  }));
};

const getCompanyName = (symbol: string) => {
  const ticker = symbol.split(":")[0].toLowerCase();
  const names: { [key: string]: string } = {
    aapl: "Apple Inc.",
    msft: "Microsoft Corporation",
    goog: "Alphabet Inc.",
    amzn: "Amazon.com Inc.",
    tsla: "Tesla Inc.",
    nvda: "NVIDIA Corporation",
    jpm: "JPMorgan Chase & Co.",
    jnj: "Johnson & Johnson",
    v: "Visa Inc.",
    pg: "Procter & Gamble Co.",
  };
  return names[ticker] || `${ticker.toUpperCase()} Corporation`;
};
