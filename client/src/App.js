import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/Login/Login";
import SignUpUser from "./components/SignUpUserCustomer/SignUpUser";
import styles from "./App.module.css"
import MainDashboardStaff from "./components/Dashboard/MainDashboardStaff";
import MainDashboardCustomer from "./components/Dashboard/MainDashboardCustomer";
import SignUpStaff from './components/SignUpUserCustomer/SignUpStaff'

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
        <Route exact path="/cdash">
          <MainDashboardCustomer/>
        </Route>
        <Route exact path="/staffsignup">
          <SignUpStaff/>
        </Route>
        
        </Switch>
        </BrowserRouter>
    </div>
  );
}

export default App;
