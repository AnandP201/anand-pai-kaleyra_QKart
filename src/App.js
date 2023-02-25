import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
<<<<<<< HEAD

export const config = {
  endpoint: `http://localhost:8082/api/v1`,
=======
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
>>>>>>> 18e1a7584878a339de60b412e34dfe28a89b31f9
};

function App() {
  return (
    <div className="App">
<<<<<<< HEAD
      <Register />
=======
      {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
          <Register />
>>>>>>> 18e1a7584878a339de60b412e34dfe28a89b31f9
    </div>
  );
}

export default App;
