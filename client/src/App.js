import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/Login/Login";
import SignUpUser from "./components/Signup/SignUpUser";
import styles from "./App.module.css"
import MainDashboardStaff from "./components/Dashboard/MainDashboardStaff";
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
        <Route exact path="/sdash">
          <MainDashboardStaff/>
        </Route>
        </Switch>
        </BrowserRouter>
    </div>
  );
}

export default App;
