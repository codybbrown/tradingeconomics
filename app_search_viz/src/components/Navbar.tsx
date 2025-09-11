import { Input } from "@/components/ui/input";

export default function Navbar() {
  return (
    <nav className="bg-white ">
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center h-16 gap-4 border-b border-gray-800 pb-4">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 ">
            <h1 className="text-2xl font-bold text-gray-900 ">
              TE Search Vizualizer
            </h1>
          </div>
          <Input
            type="text"
            placeholder="Enter a search term..."
            className="mt-4 max-w-lg ml-auto border-0 border-b-4 border-gray-300 focus-visible:ring-0"
          />
        </div>
      </div>
    </nav>
  );
}
