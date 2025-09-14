"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
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
import { MultiCombobox } from "@/components/ui/multi-combobox";

import {
  getCountryData,
  getStockDescriptions,
  extractCountryMetrics,
} from "@/lib/api-helpers";

export default function DeveloperShowcase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [persistentStockCards, setPersistentStockCards] = useState<any[]>([]);
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [multiSelectedTickers, setMultiSelectedTickers] = useState<string[]>(
    []
  );
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
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
  const [countryMetrics, setCountryMetrics] = useState<any[]>([]);

  const loadCountryData = async () => {
    try {
      // You can now pass an array of countries
      const data = await getCountryData(["mexico", "sweden", "thailand"]);

      // Extract inflation rate, CPI, and corruption metrics
      const metrics = extractCountryMetrics(data);
      setCountryMetrics(metrics);
    } catch (error) {
      // Handle error silently or show user-friendly message
    }
  };

  const handleSearch = async (tickerSymbols: string) => {
    if (!tickerSymbols.trim()) {
      return;
    }

    // Parse and validate the input tickers
    const newTickers = tickerSymbols
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t && /^[a-zA-Z0-9:]+$/.test(t)); // Only allow alphanumeric and colon characters

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

          // Expand only the new cards, collapse all others
          if (newStocks.length > 0) {
            setExpandedCards(() => {
              const newSet = new Set<string>();
              newStocks.forEach((stock) => {
                if (stock.Symbol) {
                  newSet.add(stock.Symbol.toLowerCase());
                }
              });
              return newSet;
            });
          }

          return [...prev, ...newStocks];
        });
      }
    } catch (error) {
      // Handle error silently or show user-friendly message
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

    // Remove from expanded cards
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      newSet.delete(symbolToRemove.toLowerCase());
      return newSet;
    });
  };

  const toggleCardExpansion = (symbol: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      const symbolLower = symbol.toLowerCase();
      if (newSet.has(symbolLower)) {
        newSet.delete(symbolLower);
      } else {
        newSet.add(symbolLower);
      }
      return newSet;
    });
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
            TE STOCK & COUNTRY DATA
          </h1>
          <p className="text-xl text-muted-foreground font-bold uppercase tracking-wide mb-2">
            LIVE{" "}
            <span className="px-2 py-1 bg-secondary text-secondary-foreground">
              TRADING ECONOMICS
            </span>{" "}
            API DATA
          </p>
          <h3 className="text-sm text-muted-foreground text-stone-00 italic tracking-wide mt-4">
            Built by Cody Brown with React, Tailwind CSS, Shadcn UI, and Trading
            Economics API.
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
                  persistentStockCards.map((stock: any, index: number) => {
                    const isExpanded = expandedCards.has(
                      stock.Symbol?.toLowerCase() || ""
                    );
                    return (
                      <Card
                        key={`${stock.Symbol}-${index}`}
                        className="border-4 border-border shadow-none hover:shadow-none bg-card"
                      >
                        <CardHeader
                          className="pb-4 cursor-pointer"
                          onClick={() =>
                            toggleCardExpansion(stock.Symbol || "")
                          }
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                              <CardTitle className="font-mono text-xl font-black text-card-foreground uppercase tracking-tight">
                                {stock.Name || "N/A"}
                              </CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-primary text-primary-foreground font-mono font-black text-sm">
                                {stock.Symbol || "N/A"}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveStockCard(stock.Symbol);
                                }}
                                className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                              >
                                <span className="sr-only">
                                  Remove {stock.Name}
                                </span>
                                ×
                              </Button>
                            </div>
                          </div>
                          {isExpanded && (
                            <div className="text-muted-foreground font-bold leading-relaxed mt-2">
                              {stock.Description || "No description available"}
                            </div>
                          )}
                        </CardHeader>
                        {isExpanded && (
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
                        )}
                      </Card>
                    );
                  })
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

        {/* Country Data Section */}
        <div className="mt-12">
          <div className="bg-card border-4 border-border shadow-none p-8">
            <div className="mb-12">
              <h2 className="font-mono text-3xl font-black text-foreground uppercase tracking-tight mb-4">
                COUNTRY DATA
              </h2>
            </div>

            {/* Load Button and Metrics Info Row */}
            <div className="flex gap-6 items-start mb-8">
              {/* Load Button */}
              <div className="flex-shrink-0">
                <Button
                  onClick={loadCountryData}
                  className="bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-600 font-mono font-black uppercase tracking-wide h-20 px-12 text-xl"
                >
                  LOAD
                </Button>
              </div>

              {/* Country Metrics Info Box */}
              <div className="flex-1 p-4 bg-muted border-2 border-border">
                <p className="font-mono text-sm text-muted-foreground">
                  <strong>Country Metrics:</strong> This section displays
                  inflation rate, CPI, corruption index, and corruption rank for
                  three of the countries available from the Trading Economics
                  API using the free developer account.
                </p>
              </div>
            </div>

            {/* Country Metrics Cards */}
            {countryMetrics.length > 0 && (
              <div className="space-y-6">
                {countryMetrics.map((metric, index) => (
                  <div
                    key={index}
                    className="border-2 border-border p-6 bg-card"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-mono text-lg font-black text-foreground uppercase">
                        {metric.country}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Inflation Rate */}
                      <div className="space-y-2">
                        <h5 className="font-mono text-sm font-bold text-foreground uppercase">
                          Inflation Rate
                        </h5>
                        {metric.inflationRate ? (
                          <div className="space-y-1">
                            <div className="font-mono text-2xl font-black text-primary">
                              {metric.inflationRate.value}{" "}
                              {metric.inflationRate.unit}
                            </div>
                            <div className="font-mono text-xs text-muted-foreground">
                              {metric.inflationRate.category}
                            </div>
                            <div className="font-mono text-xs text-muted-foreground">
                              {new Date(
                                metric.inflationRate.date
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        ) : (
                          <div className="font-mono text-sm text-muted-foreground">
                            No inflation data available
                          </div>
                        )}
                      </div>

                      {/* CPI */}
                      <div className="space-y-2">
                        <h5 className="font-mono text-sm font-bold text-foreground uppercase">
                          CPI
                        </h5>
                        {metric.cpi ? (
                          <div className="space-y-1">
                            <div className="font-mono text-2xl font-black text-primary">
                              {metric.cpi.value} {metric.cpi.unit}
                            </div>
                            <div className="font-mono text-xs text-muted-foreground">
                              {metric.cpi.category}
                            </div>
                            <div className="font-mono text-xs text-muted-foreground">
                              {new Date(metric.cpi.date).toLocaleDateString()}
                            </div>
                          </div>
                        ) : (
                          <div className="font-mono text-sm text-muted-foreground">
                            No CPI data available
                          </div>
                        )}
                      </div>

                      {/* Corruption Index */}
                      <div className="space-y-2">
                        <h5 className="font-mono text-sm font-bold text-foreground uppercase">
                          Corruption Index
                        </h5>
                        {metric.corruptionIndex ? (
                          <div className="space-y-1">
                            <div className="font-mono text-2xl font-black text-primary">
                              {metric.corruptionIndex.value}{" "}
                              {metric.corruptionIndex.unit}
                            </div>
                            <div className="font-mono text-xs text-muted-foreground">
                              {metric.corruptionIndex.category}
                            </div>
                            <div className="font-mono text-xs text-muted-foreground">
                              {new Date(
                                metric.corruptionIndex.date
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        ) : (
                          <div className="font-mono text-sm text-muted-foreground">
                            No corruption index data available
                          </div>
                        )}
                      </div>

                      {/* Corruption Rank */}
                      <div className="space-y-2">
                        <h5 className="font-mono text-sm font-bold text-foreground uppercase">
                          Corruption Rank
                        </h5>
                        {metric.corruptionRank ? (
                          <div className="space-y-1">
                            <div className="font-mono text-2xl font-black text-primary">
                              {metric.corruptionRank.value}{" "}
                              {metric.corruptionRank.unit || "rank"}
                            </div>
                            <div className="font-mono text-xs text-muted-foreground">
                              {metric.corruptionRank.category}
                            </div>
                            <div className="font-mono text-xs text-muted-foreground">
                              {new Date(
                                metric.corruptionRank.date
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        ) : (
                          <div className="font-mono text-sm text-muted-foreground">
                            No corruption rank data available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
