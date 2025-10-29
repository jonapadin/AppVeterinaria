import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { publicRoutes } from "./routes/publicRoutes";
import { privateRoutes } from "./routes/privateRoutes";

const router = createBrowserRouter([...publicRoutes, ...privateRoutes]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
