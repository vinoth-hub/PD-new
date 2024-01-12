import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { Root } from "./components/Root";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "./redux/Store";
import { Provider } from "react-redux";
import { ToastMessage } from "./components/shared/ToastMessage";

function App() {
  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Root />
          <ToastMessage />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
