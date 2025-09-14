"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MultiCombobox } from "@/components/ui/multi-combobox";

import {
  getCountryData,
  listSearchTerms,
  getStockDescriptions,
} from "@/lib/api-helpers";

export default function DeveloperShowcase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [persistentStockCards, setPersistentStockCards] = useState<any[]>([]);
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [multiSelectedTickers, setMultiSelectedTickers] = useState<string[]>(
    []
  );
  const [tickerOptions, setTickerOptions] = useState<string[]>([
    "aapl:us",
    "msft:us",
    "goog:us",
    "amzn:us",
    "tsla:us",
    "nvda:us",
    "jpm:us",
    "jnj:us",
    "v:us",
    "pg:us",
  ]);
  const [countryData, setCountryData] = useState<any>(null);
  const [searchCategoriesData, setSearchCategoriesData] = useState<any>(null);
  const [stockDescriptionsData, setStockDescriptionsData] = useState<any>(null);
  const [tickerSymbols, setTickerSymbols] = useState<string>(
    "aapl:us,msft:us,googl:us"
  );

  const loadCountryData = async () => {
    try {
      const data = await getCountryData("mexico");
      setCountryData(data);
      console.log("Country Data:", data);
    } catch (error) {
      console.error("Failed to load country data:", error);
    }
  };

  const loadSearchTermCategories = async () => {
    try {
      const data = await listSearchTerms();
      setSearchCategoriesData(data);
      console.log("Search Categories Data:", data);
    } catch (error) {
      console.error("Failed to load search categories:", error);
    }
  };

  const loadStockDescriptions = async () => {
    try {
      if (!tickerSymbols.trim()) {
        console.error("Please enter at least one ticker symbol");
        return;
      }
      const data = await getStockDescriptions(tickerSymbols.trim());
      setStockDescriptionsData(data);
      console.log("Stock Descriptions Data:", data);
    } catch (error) {
      console.error("Failed to load stock descriptions:", error);
    }
  };

  const handleSearch = async (tickerSymbols: string) => {
    if (!tickerSymbols.trim()) {
      return;
    }

    // Parse the input tickers
    const newTickers = tickerSymbols
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);

    // Add new tickers to the selected list (avoid duplicates)
    setSelectedTickers((prev) => {
      const existingTickers = new Set(prev);
      const uniqueNewTickers = newTickers.filter(
        (ticker) => !existingTickers.has(ticker)
      );
      return [...prev, ...uniqueNewTickers];
    });

    // Load stock descriptions and add to persistent cards
    try {
      const data = await getStockDescriptions(tickerSymbols.trim());

      // Add new stocks to persistent cards (avoid duplicates)
      if (Array.isArray(data)) {
        setPersistentStockCards((prev) => {
          const existingSymbols = new Set(
            prev.map((card) => card.Symbol?.toLowerCase())
          );
          const newStocks = data.filter(
            (stock) => !existingSymbols.has(stock.Symbol?.toLowerCase())
          );
          return [...prev, ...newStocks];
        });
      }

      console.log("Stock Data:", data);
    } catch (error) {
      console.error("Failed to load stock descriptions:", error);
    }
  };

  const handleTickerSelect = (values: string[]) => {
    setMultiSelectedTickers(values);
    if (values.length > 0) {
      const tickerString = values.join(",");
      setSearchTerm(tickerString);
      handleSearch(tickerString);
    } else {
      setSearchTerm("");
      setPersistentStockCards([]);
      setSelectedTickers([]);
    }
  };

  const handleAddNewTicker = (newTicker: string) => {
    if (!tickerOptions.includes(newTicker)) {
      setTickerOptions((prev) => [...prev, newTicker]);
    }
  };

  const handleRemoveStockCard = (symbolToRemove: string) => {
    // Remove from persistent cards (case-insensitive)
    setPersistentStockCards((prev) =>
      prev.filter(
        (card) =>
          card.Symbol &&
          card.Symbol.toLowerCase() !== symbolToRemove.toLowerCase()
      )
    );

    // Remove from selected tickers
    setSelectedTickers((prev) =>
      prev.filter(
        (ticker) => ticker.toLowerCase() !== symbolToRemove.toLowerCase()
      )
    );

    // Remove from multi-selected tickers
    setMultiSelectedTickers((prev) =>
      prev.filter(
        (ticker) => ticker.toLowerCase() !== symbolToRemove.toLowerCase()
      )
    );
  };

  const headerStyle = {
    backgroundColor: "#000000 !important",
    color: "#ffffff !important",
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b-4 border-border bg-card">
        <div className="container mx-auto px-6 py-12">
          <h1 className="font-mono text-5xl font-black text-foreground mb-4 uppercase tracking-tight">
            TE Stock information
          </h1>
          <p className="text-xl text-muted-foreground font-bold uppercase tracking-wide mb-2">
            LIVE{" "}
            <span className="px-2 py-1 bg-secondary text-secondary-foreground">
              TRADING ECONOMICS
            </span>{" "}
            SYMBOL SEARCH & VISUALIZATION
          </p>
          <h3 className="text-sm text-muted-foreground text-stone-00 italic tracking-wide mt-4">
            Built with React, Tailwind CSS, Shadcn UI, and Trading Economics
            API.
          </h3>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="container mx-auto px-6 py-12">
        <div className="bg-card border-4 border-border shadow-none p-8">
          <div className="mb-12">
            <div className="flex gap-0 max-w-lg">
              <div className="relative flex-1">
                <MultiCombobox
                  options={tickerOptions}
                  values={multiSelectedTickers}
                  onValuesChange={handleTickerSelect}
                  onAddNew={handleAddNewTicker}
                  placeholder="SELECT OR SEARCH SYMBOLS..."
                  className="bg-input border-2 border-border border-r-0 focus:ring-0 focus:border-primary font-mono uppercase placeholder:text-muted-foreground/60 h-14 text-lg rounded-none hover:bg-input"
                />
              </div>
              <Button
                onClick={() => handleSearch(searchTerm)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-primary font-mono font-black uppercase tracking-wide h-14 px-8"
              >
                SEARCH
              </Button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Side - Description Cards */}
            <div className="space-y-6">
              <h2 className="font-mono text-3xl font-black text-foreground uppercase tracking-tight">
                SYMBOL DESCRIPTION
              </h2>
              <div className="space-y-6">
                {persistentStockCards.length > 0 ? (
                  persistentStockCards.map((stock: any, index: number) => (
                    <Card
                      key={`${stock.Symbol}-${index}`}
                      className="border-4 border-border shadow-none hover:shadow-none bg-card"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <CardTitle className="font-mono text-xl font-black text-card-foreground uppercase tracking-tight">
                            {stock.Name || "N/A"}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-primary text-primary-foreground font-mono font-black text-sm">
                              {stock.Symbol || "N/A"}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemoveStockCard(stock.Symbol)
                              }
                              className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <span className="sr-only">
                                Remove {stock.Name}
                              </span>
                              ×
                            </Button>
                          </div>
                        </div>
                        <div className="text-muted-foreground font-bold leading-relaxed mt-2">
                          {stock.Description || "No description available"}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="font-mono font-bold border-2 border-border"
                          >
                            {stock.Country || "N/A"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    {selectedTickers.length > 0 ? (
                      <div className="space-y-2">
                        <p className="font-mono text-muted-foreground text-lg font-bold">
                          No stock cards available
                        </p>
                        <p className="font-mono text-muted-foreground text-sm">
                          The selected tickers may not have description data
                          available
                        </p>
                      </div>
                    ) : (
                      <p className="font-mono text-muted-foreground text-lg">
                        Enter ticker symbols above to load stock cards
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Stock Comparison Table */}
            <div className="space-y-6">
              <h2 className="font-mono text-3xl font-black text-foreground uppercase tracking-tight">
                SYMBOL DATA
              </h2>
              <div className="border-4 border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow
                      style={{ backgroundColor: "#000000" }}
                      className="hover:bg-black"
                    >
                      <TableHead
                        style={headerStyle}
                        className="font-mono font-black uppercase border-r-2 border-border text-white"
                      >
                        Name
                      </TableHead>
                      <TableHead
                        style={headerStyle}
                        className="font-mono font-black uppercase border-r-2 border-border text-white"
                      >
                        Sector
                      </TableHead>
                      <TableHead
                        style={headerStyle}
                        className="font-mono font-black uppercase border-r-2 border-border text-white"
                      >
                        Industry
                      </TableHead>
                      <TableHead
                        style={headerStyle}
                        className="font-mono font-black uppercase border-r-2 border-border text-white"
                      >
                        Sub-industry
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {persistentStockCards.length > 0 ? (
                      persistentStockCards.map((stock: any, index: number) => (
                        <TableRow
                          key={index}
                          className="hover:bg-muted/50 border-b-2 border-border"
                        >
                          <TableCell className="font-mono font-bold text-foreground border-r-2 border-border">
                            {stock.Name || "N/A"}
                          </TableCell>
                          <TableCell className="font-mono text-muted-foreground border-r-2 border-border">
                            {stock.Sector || "N/A"}
                          </TableCell>
                          <TableCell className="font-mono text-muted-foreground border-r-2 border-border">
                            {stock.Industry || "N/A"}
                          </TableCell>
                          <TableCell className="font-mono text-muted-foreground">
                            {stock.Subindustry || "N/A"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow className="hover:bg-muted/50 border-b-2 border-border">
                        <TableCell
                          colSpan={4}
                          className="font-mono text-muted-foreground text-center py-8"
                        >
                          {selectedTickers.length > 0 ? (
                            <div className="space-y-2">
                              <div className="text-lg font-bold">
                                No stock descriptions available for selected
                                tickers
                              </div>
                              <div className="text-sm">
                                The selected tickers may not have description
                                data available
                              </div>
                            </div>
                          ) : (
                            "Select ticker symbols to view stock descriptions"
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>

        {/* API Data Table */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-mono text-3xl font-black text-foreground uppercase tracking-tight">
              API DATA
            </h2>
          </div>
          <Tabs defaultValue="country-data" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted">
              <TabsTrigger
                value="country-data"
                className="font-mono font-black uppercase tracking-wide data-[state=active]:px-2 data-[state=active]:py-1 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
                onClick={loadCountryData}
              >
                Load Mexico Data
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="font-mono font-black uppercase tracking-wide data-[state=active]:px-2 data-[state=active]:py-1 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
                onClick={loadSearchTermCategories}
              >
                List Available Search Terms
              </TabsTrigger>
              <TabsTrigger
                value="stock-descriptions"
                className="font-mono font-black uppercase tracking-wide data-[state=active]:px-2 data-[state=active]:py-1 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
                onClick={loadStockDescriptions}
              >
                Stock Descriptions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="country-data">
              <div className="border-4 border-border overflow-hidden">
                {countryData &&
                Array.isArray(countryData) &&
                countryData.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow
                        style={{ backgroundColor: "#000000" }}
                        className="hover:bg-black"
                      >
                        <TableHead
                          style={headerStyle}
                          className="font-mono font-black uppercase border-r-2 border-border"
                        >
                          Category
                        </TableHead>
                        <TableHead
                          style={headerStyle}
                          className="font-mono font-black uppercase border-r-2 border-border"
                        >
                          Latest Value
                        </TableHead>
                        <TableHead
                          style={headerStyle}
                          className="font-mono font-black uppercase border-r-2 border-border"
                        >
                          Previous Value
                        </TableHead>
                        <TableHead
                          style={headerStyle}
                          className="font-mono font-black uppercase border-r-2 border-border"
                        >
                          Unit
                        </TableHead>
                        <TableHead
                          style={headerStyle}
                          className="font-mono font-black uppercase border-r-2 border-border"
                        >
                          Group
                        </TableHead>
                        <TableHead
                          style={headerStyle}
                          className="font-mono font-black uppercase"
                        >
                          Date
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {countryData.map((item: any, index: number) => (
                        <TableRow
                          key={index}
                          className="hover:bg-muted/50 border-b-2 border-border"
                        >
                          <TableCell className="font-mono font-bold text-foreground border-r-2 border-border">
                            {item.Category || "N/A"}
                          </TableCell>
                          <TableCell className="font-mono text-foreground border-r-2 border-border">
                            <Badge className="bg-primary text-primary-foreground font-mono font-black">
                              {item.LatestValue !== null &&
                              item.LatestValue !== undefined
                                ? typeof item.LatestValue === "number"
                                  ? item.LatestValue.toLocaleString()
                                  : item.LatestValue
                                : "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-muted-foreground border-r-2 border-border">
                            {item.PreviousValue !== null &&
                            item.PreviousValue !== undefined
                              ? typeof item.PreviousValue === "number"
                                ? item.PreviousValue.toLocaleString()
                                : item.PreviousValue
                              : "N/A"}
                          </TableCell>
                          <TableCell className="font-mono text-muted-foreground border-r-2 border-border">
                            {item.Unit || "N/A"}
                          </TableCell>
                          <TableCell className="font-mono text-muted-foreground border-r-2 border-border">
                            <Badge
                              variant="outline"
                              className="font-mono font-bold border-2 border-border"
                            >
                              {item.CategoryGroup || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-muted-foreground">
                            {item.LatestValueDate
                              ? new Date(
                                  item.LatestValueDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="p-8 text-center">
                    <p className="font-mono text-muted-foreground text-lg">
                      {countryData
                        ? "No data available"
                        : 'Click "Load Mexico Data" to fetch API data'}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="categories">
              <div className="border-4 border-border overflow-hidden">
                {searchCategoriesData &&
                Array.isArray(searchCategoriesData) &&
                searchCategoriesData.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow
                        style={{ backgroundColor: "#000000" }}
                        className="hover:bg-black"
                      >
                        <TableHead
                          style={headerStyle}
                          className="font-mono font-black uppercase border-r-2 border-border"
                        >
                          #
                        </TableHead>
                        <TableHead
                          style={headerStyle}
                          className="font-mono font-black uppercase"
                        >
                          Category
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchCategoriesData.map((item: any, index: number) => (
                        <TableRow
                          key={index}
                          className="hover:bg-muted/50 border-b-2 border-border"
                        >
                          <TableCell className="font-mono font-bold text-foreground border-r-2 border-border">
                            <Badge className="bg-primary text-primary-foreground font-mono font-black">
                              {index + 1}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-foreground">
                            {item.Categories || "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="p-8 text-center">
                    <p className="font-mono text-muted-foreground text-lg">
                      {searchCategoriesData
                        ? "No data available"
                        : 'Click "List Search Terms" to fetch categories'}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="stock-descriptions">
              <div className="mb-6">
                <div className="flex gap-0 max-w-lg">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Enter ticker symbols (e.g., aapl:us,msft:us,googl:us)"
                      value={tickerSymbols}
                      onChange={(e) => setTickerSymbols(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && loadStockDescriptions()
                      }
                      className="pl-12 bg-input border-2 border-border border-r-0 focus:ring-0 focus:border-primary font-mono uppercase placeholder:text-muted-foreground/60 h-14 text-lg"
                    />
                  </div>
                  <Button
                    onClick={loadStockDescriptions}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-primary font-mono font-black uppercase tracking-wide h-14 px-8"
                  >
                    LOAD
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2 font-mono">
                  Enter ticker symbols separated by commas. Use format:
                  SYMBOL:COUNTRY (e.g., aapl:us, msft:us)
                </p>
              </div>
              <div className="border-4 border-border overflow-hidden">
                {stockDescriptionsData &&
                Array.isArray(stockDescriptionsData) &&
                stockDescriptionsData.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow
                        style={{ backgroundColor: "#000000" }}
                        className="hover:bg-black"
                      >
                        <TableHead
                          style={headerStyle}
                          className="font-mono font-black uppercase border-r-2 border-border"
                        >
                          Symbol
                        </TableHead>
                        <TableHead
                          style={headerStyle}
                          className="font-mono font-black uppercase border-r-2 border-border"
                        >
                          Name
                        </TableHead>
                        <TableHead
                          style={headerStyle}
                          className="font-mono font-black uppercase border-r-2 border-border"
                        >
                          Country
                        </TableHead>
                        <TableHead
                          style={headerStyle}
                          className="font-mono font-black uppercase border-r-2 border-border"
                        >
                          Sector
                        </TableHead>
                        <TableHead
                          style={headerStyle}
                          className="font-mono font-black uppercase border-r-2 border-border"
                        >
                          Industry
                        </TableHead>
                        <TableHead
                          style={headerStyle}
                          className="font-mono font-black uppercase"
                        >
                          Subindustry
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stockDescriptionsData.map((item: any, index: number) => (
                        <TableRow
                          key={index}
                          className="hover:bg-muted/50 border-b-2 border-border"
                        >
                          <TableCell className="font-mono font-bold text-foreground border-r-2 border-border">
                            <Badge className="bg-primary text-primary-foreground font-mono font-black">
                              {item.Symbol || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-foreground border-r-2 border-border">
                            {item.Name || "N/A"}
                          </TableCell>
                          <TableCell className="font-mono text-muted-foreground border-r-2 border-border">
                            <Badge
                              variant="outline"
                              className="font-mono font-bold border-2 border-border"
                            >
                              {item.Country || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-muted-foreground border-r-2 border-border">
                            {item.Sector || "N/A"}
                          </TableCell>
                          <TableCell className="font-mono text-muted-foreground border-r-2 border-border">
                            {item.Industry || "N/A"}
                          </TableCell>
                          <TableCell className="font-mono text-muted-foreground">
                            {item.Subindustry || "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="p-8 text-center">
                    <p className="font-mono text-muted-foreground text-lg">
                      {stockDescriptionsData
                        ? "No data available"
                        : 'Click "Stock Descriptions" to fetch API data'}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
