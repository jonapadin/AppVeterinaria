import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { publicRoutes } from "./routes/publicRoutes";

const router = createBrowserRouter(publicRoutes);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
