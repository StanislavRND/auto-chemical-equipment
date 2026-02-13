import { store } from "@app/store/store.ts";
import "@shared/styles/all.scss";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { App } from "./app/App.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
