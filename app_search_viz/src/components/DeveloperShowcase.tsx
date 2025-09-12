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

import {
  getCountryData,
  getSearchTermData,
  listSearchTerms,
} from "@/lib/api-helpers";

const mockTableData = [
  {
    id: 1,
    endpoint: "/api/users",
    method: "GET",
    status: 200,
    responseTime: "45ms",
    records: 1247,
  },
  {
    id: 2,
    endpoint: "/api/products",
    method: "POST",
    status: 201,
    responseTime: "89ms",
    records: 892,
  },
  {
    id: 3,
    endpoint: "/api/orders",
    method: "GET",
    status: 200,
    responseTime: "32ms",
    records: 2156,
  },
  {
    id: 4,
    endpoint: "/api/analytics",
    method: "GET",
    status: 200,
    responseTime: "156ms",
    records: 445,
  },
  {
    id: 5,
    endpoint: "/api/auth/login",
    method: "POST",
    status: 200,
    responseTime: "78ms",
    records: 3421,
  },
];

const mockCardData = [
  {
    id: 1,
    title: "Database Performance",
    metric: "99.9% Uptime",
    description:
      "Optimized queries with proper indexing and connection pooling for maximum efficiency.",
    tech: ["PostgreSQL", "Redis", "Prisma"],
    value: "2.3s avg response",
  },
  {
    id: 2,
    title: "API Security",
    metric: "Zero Breaches",
    description:
      "JWT authentication, rate limiting, and input validation across all endpoints.",
    tech: ["JWT", "bcrypt", "Helmet.js"],
    value: "100% secure",
  },
  {
    id: 3,
    title: "Code Quality",
    metric: "95% Coverage",
    description:
      "Comprehensive testing suite with unit, integration, and end-to-end tests.",
    tech: ["Jest", "Cypress", "ESLint"],
    value: "A+ Grade",
  },
  {
    id: 4,
    title: "Deployment Pipeline",
    metric: "5min Deploy",
    description:
      "Automated CI/CD with Docker containers and zero-downtime deployments.",
    tech: ["Docker", "GitHub Actions", "Vercel"],
    value: "Fully Automated",
  },
];

export default function DeveloperShowcase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTableData, setFilteredTableData] = useState(mockTableData);
  const [filteredCardData, setFilteredCardData] = useState(mockCardData);
  const [countryData, setCountryData] = useState<any>(null);
  const [searchCategoriesData, setSearchCategoriesData] = useState<any>(null);
  const [searchTermData, setSearchTermData] = useState<any>(null);

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

  const loadSearchTermData = async () => {
    try {
      const data = await getSearchTermData();
      setSearchTermData(data);
      console.log("Search Term Data:", data);
    } catch (error) {
      console.error("Failed to load search term data:", error);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredTableData(mockTableData);
      setFilteredCardData(mockCardData);
      return;
    }

    const tableFiltered = mockTableData.filter(
      (item) =>
        item.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.method.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const cardFiltered = mockCardData.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tech.some((tech) =>
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    setFilteredTableData(tableFiltered);
    setFilteredCardData(cardFiltered);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) {
      return "bg-primary text-primary-foreground";
    } else if (status >= 400) {
      return "bg-destructive text-destructive-foreground";
    }
    return "bg-secondary text-secondary-foreground";
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-primary text-primary-foreground";
      case "POST":
        return "bg-secondary text-secondary-foreground";
      case "PUT":
        return "bg-accent text-accent-foreground";
      case "DELETE":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
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
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="SEARCH ENDPOINTS OR METHODS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-12 bg-input border-2 border-border border-r-0 focus:ring-0 focus:border-primary font-mono uppercase placeholder:text-muted-foreground/60 h-14 text-lg"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-primary font-mono font-black uppercase tracking-wide h-14 px-8"
              >
                SEARCH
              </Button>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Side - Data Table */}
            <div className="space-y-6">
              <h2 className="font-mono text-3xl font-black text-foreground uppercase tracking-tight">
                API ENDPOINTS
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
                        className="font-mono font-black uppercase border-r-2 border-border"
                      >
                        Endpoint
                      </TableHead>
                      <TableHead
                        style={headerStyle}
                        className="font-mono font-black uppercase border-r-2 border-border"
                      >
                        Method
                      </TableHead>
                      <TableHead
                        style={headerStyle}
                        className="font-mono font-black uppercase border-r-2 border-border"
                      >
                        Status
                      </TableHead>
                      <TableHead
                        style={headerStyle}
                        className="font-mono font-black uppercase"
                      >
                        Response
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTableData.map((item) => (
                      <TableRow
                        key={item.id}
                        className="hover:bg-muted/50 border-b-2 border-border"
                      >
                        <TableCell className="font-mono font-bold text-foreground border-r-2 border-border">
                          {item.endpoint}
                        </TableCell>
                        <TableCell className="border-r-2 border-border">
                          <Badge
                            className={`${getMethodColor(
                              item.method
                            )} font-mono font-black`}
                          >
                            {item.method}
                          </Badge>
                        </TableCell>
                        <TableCell className="border-r-2 border-border">
                          <Badge
                            className={`${getStatusColor(
                              item.status
                            )} font-mono font-black`}
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-muted-foreground font-bold">
                          {item.responseTime}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Right Side - Performance Metrics */}
            <div className="space-y-6">
              <h2 className="font-mono text-3xl font-black text-foreground uppercase tracking-tight">
                PERFORMANCE METRICS
              </h2>
              <div className="space-y-6">
                {filteredCardData.map((metric) => (
                  <Card
                    key={metric.id}
                    className="border-4 border-border shadow-none hover:shadow-none bg-card"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <CardTitle className="font-mono text-xl font-black text-card-foreground uppercase tracking-tight">
                          {metric.title}
                        </CardTitle>
                        <Badge className="bg-primary text-primary-foreground font-mono font-black text-sm">
                          {metric.metric}
                        </Badge>
                      </div>
                      <CardDescription className="text-muted-foreground font-bold leading-relaxed">
                        {metric.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {metric.tech.map((tech, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="font-mono font-bold border-2 border-border"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="font-mono font-black text-primary text-lg uppercase tracking-wide">
                        {metric.value}
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
            <div className="flex gap-2">
              <Button onClick={loadCountryData}>Load Mexico Data</Button>
              <Button onClick={loadSearchTermCategories}>
                List Search Terms
              </Button>
              <Button onClick={loadSearchTermData}>
                Load Search Term Data
              </Button>
            </div>
          </div>
          {/* Country Data Table */}
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
                          ? new Date(item.LatestValueDate).toLocaleDateString()
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
          {/* Search Term Categories Table */}
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-mono text-3xl font-black text-foreground uppercase tracking-tight">
                SEARCH TERM CATEGORIES
              </h2>
            </div>
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
          </div>
          {/* Search Term Data Table */}
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-mono text-3xl font-black text-foreground uppercase tracking-tight">
                SEARCH TERM DATA
              </h2>
            </div>
            <div className="border-4 border-border overflow-hidden">
              {searchTermData &&
              Array.isArray(searchTermData) &&
              searchTermData.length > 0 ? (
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
                        Country
                      </TableHead>
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
                        Unit
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
                    {searchTermData.map((item: any, index: number) => (
                      <TableRow
                        key={index}
                        className="hover:bg-muted/50 border-b-2 border-border"
                      >
                        <TableCell className="font-mono font-bold text-foreground border-r-2 border-border">
                          {item.Country || "N/A"}
                        </TableCell>
                        <TableCell className="font-mono text-foreground border-r-2 border-border">
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
                          {item.Unit || "N/A"}
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
                    {searchTermData
                      ? "No data available"
                      : 'Click "Load Search Term Data" to fetch data'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
