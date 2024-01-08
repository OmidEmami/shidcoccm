import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/Login/Login";
function App() {
  return (
    <div>
      <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Login/>
        </Route>
        </Switch>
        </BrowserRouter>
    </div>
  );
}

export default App;
