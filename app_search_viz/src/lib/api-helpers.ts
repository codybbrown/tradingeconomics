import axios from "axios";
const API_KEY = import.meta.env.VITE_TRADING_ECONOMICS_API_KEY;

export const getCountryData = async (country: string) => {
  try {
    console.log("API Key:", API_KEY);

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
