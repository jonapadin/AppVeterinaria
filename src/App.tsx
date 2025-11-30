import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { publicRoutes } from "./routes/publicRoutes";
import { privateRoutes } from "./routes/privateRoutes";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter([...publicRoutes, ...privateRoutes]);

function App() {
  return (
    <>
      {/* Toaster global */}
      <Toaster position="top-right" />

      {/* Rutas */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
