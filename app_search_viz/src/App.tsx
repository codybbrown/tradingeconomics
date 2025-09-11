import { useState } from "react";

import "./App.css";

import { Button } from "@/components/ui/button";
import Navbar from "./components/Navbar";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mt-4">Cody Brown</h2>
        <h3 className="mt-4">Full Stack Developer</h3>
        <div
          className="card border rounded-md p-4"
          style={{ backgroundColor: "red" }}
        >
          <Button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </Button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="built-with">
          Built with React, Tailwind CSS, Shadcn UI, and Trading Economics API.
        </p>
      </div>
    </>
  );
}

export default App;
