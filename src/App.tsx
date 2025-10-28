import { useRoutes } from "react-router-dom";
import { publicRoutes } from "./routes/publicRoutes";
import { Suspense } from "react";

function App() {
  const element = useRoutes(publicRoutes);
  return <Suspense fallback={<div>Cargando...</div>}>{element}</Suspense>;
}

export default App;
