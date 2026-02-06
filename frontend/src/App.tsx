import React from "react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { store } from "./app/store";
import AppRouter from "./router/AppRouter";
import "./index.css";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="min-h-screen gradient-bg">
        <AppRouter />
        <Toaster position="top-center" expand={false} richColors closeButton />
      </div>
    </Provider>
  );
};

export default App;
