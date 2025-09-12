"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Combobox } from "@/components/ui/combobox";

import {
  getCountryData,
  listSearchTerms,
  getStockDescriptions,
  getStockSnapshot,
} from "@/lib/api-helpers";

export default function DeveloperShowcase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [persistentStockCards, setPersistentStockCards] = useState<any[]>([]);
  const [stockSnapshotData, setStockSnapshotData] = useState<any[]>([]);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
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
      setStockSnapshotData([]);
      return;
    }

    // Load stock descriptions and add to persistent cards
    try {
      const data = await getStockDescriptions(tickerSymbols.trim());

      // Add new stocks to persistent cards (avoid duplicates)
      if (Array.isArray(data)) {
        setPersistentStockCards((prev) => {
          const existingSymbols = new Set(prev.map((card) => card.Symbol));
          const newStocks = data.filter(
            (stock) => !existingSymbols.has(stock.Symbol)
          );
          return [...prev, ...newStocks];
        });
      }

      console.log("Stock Data:", data);
    } catch (error) {
      console.error("Failed to load stock descriptions:", error);
    }

    // Load stock snapshot data for table
    try {
      const snapshotData = await getStockSnapshot(tickerSymbols.trim());
      setStockSnapshotData(Array.isArray(snapshotData) ? snapshotData : []);

      // Check if we're using mock data
      const isMockData = snapshotData.some(
        (item: any) =>
          item.Name &&
          item.Name.includes("Corporation") &&
          item.Last &&
          item.Last > 100 &&
          item.Last < 300
      );
      setIsUsingMockData(isMockData);

      console.log("Stock Snapshot Data:", snapshotData);
    } catch (error) {
      console.error("Failed to load stock snapshot:", error);
      setStockSnapshotData([]);
      setIsUsingMockData(false);
    }
  };

  const handleTickerSelect = (value: string) => {
    setSearchTerm(value);
    handleSearch(value);
  };

  const handleAddNewTicker = (newTicker: string) => {
    if (!tickerOptions.includes(newTicker)) {
      setTickerOptions((prev) => [...prev, newTicker]);
    }
  };

  const handleRemoveStockCard = (symbolToRemove: string) => {
    setPersistentStockCards((prev) =>
      prev.filter((card) => card.Symbol !== symbolToRemove)
    );
    setStockSnapshotData((prev) =>
      prev.filter((stock) => stock.Symbol !== symbolToRemove)
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
            TE Search Vizualizer
          </h1>
          <p className="text-xl text-muted-foreground font-bold uppercase tracking-wide mb-2">
            LIVE{" "}
            <span className="px-2 py-1 bg-secondary text-secondary-foreground">
              TRADING ECONOMICS
            </span>{" "}
            SEARCH & VISUALIZATION
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
                <Combobox
                  options={tickerOptions}
                  value={searchTerm}
                  onValueChange={handleTickerSelect}
                  onAddNew={handleAddNewTicker}
                  placeholder="SELECT OR ADD TICKER SYMBOLS..."
                  className="bg-input border-2 border-border border-r-0 focus:ring-0 focus:border-primary font-mono uppercase placeholder:text-muted-foreground/60 h-14 text-lg rounded-none"
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

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Side - Stock Comparison Table */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-mono text-3xl font-black text-foreground uppercase tracking-tight">
                  STOCK COMPARISON
                </h2>
                {isUsingMockData && (
                  <Badge
                    variant="outline"
                    className="font-mono font-bold border-2 border-yellow-500 text-yellow-600"
                  >
                    DEMO DATA
                  </Badge>
                )}
              </div>
              <div className="border-4 border-border overflow-hidden">
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
                        Ticker
                      </TableHead>
                      <TableHead
                        style={headerStyle}
                        className="font-mono font-black uppercase border-r-2 border-border"
                      >
                        Price
                      </TableHead>
                      <TableHead
                        style={headerStyle}
                        className="font-mono font-black uppercase border-r-2 border-border"
                      >
                        Daily Change
                      </TableHead>
                      <TableHead
                        style={headerStyle}
                        className="font-mono font-black uppercase border-r-2 border-border"
                      >
                        Market Cap
                      </TableHead>
                      <TableHead
                        style={headerStyle}
                        className="font-mono font-black uppercase"
                      >
                        State
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockSnapshotData.length > 0 ? (
                      stockSnapshotData.map((stock: any, index: number) => (
                        <TableRow
                          key={index}
                          className="hover:bg-muted/50 border-b-2 border-border"
                        >
                          <TableCell className="font-mono font-bold text-foreground border-r-2 border-border">
                            <Badge className="bg-primary text-primary-foreground font-mono font-black">
                              {stock.Symbol || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-foreground border-r-2 border-border">
                            ${stock.Last ? stock.Last.toFixed(2) : "N/A"}
                          </TableCell>
                          <TableCell className="border-r-2 border-border">
                            <Badge
                              className={`font-mono font-black ${
                                stock.DailyChange >= 0
                                  ? "bg-green-500 text-white"
                                  : "bg-red-500 text-white"
                              }`}
                            >
                              {stock.DailyChange >= 0 ? "+" : ""}
                              {stock.DailyChange
                                ? stock.DailyChange.toFixed(2)
                                : "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-muted-foreground border-r-2 border-border">
                            {stock.MarketCap
                              ? `$${(stock.MarketCap / 1000000000).toFixed(1)}B`
                              : "N/A"}
                          </TableCell>
                          <TableCell className="font-mono text-muted-foreground">
                            <Badge
                              variant="outline"
                              className="font-mono font-bold border-2 border-border"
                            >
                              {stock.State || "N/A"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow className="hover:bg-muted/50 border-b-2 border-border">
                        <TableCell
                          colSpan={5}
                          className="font-mono text-muted-foreground text-center py-8"
                        >
                          Select ticker symbols to view stock comparison data
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Right Side - Stock Descriptions */}
            <div className="space-y-6">
              <h2 className="font-mono text-3xl font-black text-foreground uppercase tracking-tight">
                STOCK DESCRIPTIONS
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
                        <CardDescription className="text-muted-foreground font-bold leading-relaxed">
                          {stock.Description || "No description available"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge
                            variant="outline"
                            className="font-mono font-bold border-2 border-border"
                          >
                            {stock.Country || "N/A"}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="font-mono font-bold border-2 border-border"
                          >
                            {stock.Sector || "N/A"}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="font-mono font-bold border-2 border-border"
                          >
                            {stock.Industry || "N/A"}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="font-mono font-bold border-2 border-border"
                          >
                            {stock.Subindustry || "N/A"}
                          </Badge>
                        </div>
                        <div className="font-mono font-black text-primary text-lg uppercase tracking-wide">
                          {stock.Sector} • {stock.Industry}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="font-mono text-muted-foreground text-lg">
                      Enter ticker symbols above to load stock descriptions
                    </p>
                  </div>
                )}
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
