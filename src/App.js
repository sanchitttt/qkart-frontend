import Register from "./components/Register";
import Login from "./components/Login";
import theme from "./theme"
import React from "react";
import { ThemeProvider } from '@mui/material/styles';
import { Switch, Route } from "react-router-dom";
import Products from "./components/Products"
import Checkout from "./components/Checkout"
import Thanks from "./components/Thanks"

export const config = {
  // endpoint: `https://qkart-backend-sanchit.vercel.app/v1`,
  endpoint: `https://qkart-backend-theta.vercel.app/v1`,
};



function App() {
  return (
    <React.StrictMode>

      <div className="App">
        <ThemeProvider theme={theme}>
          <Switch>
            <Route exact path="/" component={Products} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/thanks" component={Thanks} />
          </Switch>
        </ThemeProvider>
      </div>
    </React.StrictMode>

  );
}

export default App;
