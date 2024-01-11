import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/Login/Login";
import SignUpUser from "./components/SignUp/SignUpUser";
import styles from "./App.module.css"
function App() {
  return (
    <div className={styles.app}>
      <BrowserRouter>
      <Switch>
        <Route exact path="/login">
          <Login/>
        </Route>
        <Route exact path="/usersignup">
          <SignUpUser/>
        </Route>
        </Switch>
        </BrowserRouter>
    </div>
  );
}

export default App;
