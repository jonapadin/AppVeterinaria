import ReactDOM from "react-dom/client";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import "./index.css";
import { CarritoProvider } from "./components/carrito/CarritoContext";  

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <CarritoProvider>
        <App />
      </CarritoProvider>
    </Provider>
  </React.StrictMode>
);
