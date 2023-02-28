import Register from "./components/Register";
import Login from "./components/Login"
import Products from './components/Products'
import Checkout from './components/Checkout'
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import Thanks from "./components/Thanks";

export const config = {
  endpoint: `http://localhost:8082/api/v1`,
};

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Products />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/checkout">
            <Checkout />
          </Route>
          <Route path="/thanks">
            <Thanks />
          </Route>
        </Switch>
      </Router>

    </div>
  );
}

export default App;
