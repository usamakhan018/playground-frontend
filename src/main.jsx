import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { ContextProvider } from "./contexts/AuthContext.jsx";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./contexts/ThemeProvider.tsx";
import './utils/i18n.js';
import "./index.css";
import router from "./router/index.jsx";
import store from "./stores/store.jsx";
import { LanguageProvider } from "./contexts/LanguageProvider.jsx";

function MainLayout() {
  return (
    <React.StrictMode>
      <ContextProvider>
        <Provider store={store}>
          <LanguageProvider>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
              <RouterProvider router={router} />
            </ThemeProvider>
          </LanguageProvider>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              className: '',
              duration: 5000,
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                fontSize: '1rem',
                boxShadow: 'var(--shadow)',
              },
            }}
          />
        </Provider>
      </ContextProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<MainLayout />);
