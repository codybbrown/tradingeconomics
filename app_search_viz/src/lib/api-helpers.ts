import axios from "axios";
const API_KEY = import.meta.env.VITE_TRADING_ECONOMICS_API_KEY;

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

export const getSearchTermData = async (term: string) => {
  try {
    console.log("API Key:", API_KEY ? "Present" : "Missing");
    console.log("Search term:", term);
    const url = `https://api.tradingeconomics.com/search/${term}?c=${API_KEY}`;
    console.log("API URL:", url);

    const response = await axios.get(url, {
      headers: {
        Authorization: API_KEY,
      },
    });
    console.log("API Search Term Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching search term data:", error);
    throw error;
  }
};
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
