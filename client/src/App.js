import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CommonState from "./contexts/common/CommonState";

import Navbar from "./components/navbar/navbar";

import ActivateEmail from "./components/user_login_register/activateEmail";
import ForgetPassword from "./components/user_login_register/forgetPass";
import ResetPassword from "./components/user_login_register/resetPass";

import Profile from "./components/profile/profile";

import Add from "./components/add_post_doubt/add";

import Doubt from "./components/doubts";
import Home from "./components/home/home";
import MyCommunity from "./components/myCommunity/myComunity";
import Upcoming from "./components/upcomingContests/upcoming";

import LoginRegister from "./components/user_login_register/login_register";
import EditProfile from './components/profile/profileEdit';
import PrivateRoute from "./privateRoute/privateRoute";

import Toast from "./utilsClient/toast/Toast";

function App() {

  return (
    <CommonState>
      <Router>
        <Navbar/>
        <Switch>
          <Route exact path="/" component={Home} />
          <PrivateRoute path="/public/add" component={Add} />
          <Route path="/public/doubts" component={Doubt} />
          <PrivateRoute path="/public/myCommunity" component={MyCommunity} />
          <Route path="/public/upcoming" component={Upcoming} />

          <PrivateRoute exact path="/user" component={Profile} />
          <PrivateRoute exact path="/user/edit" component={EditProfile} />

          <Route path="/user/login" component={LoginRegister} />

          <Route
            path="/user/activate/:activationToken"
            component={ActivateEmail}
          />

          <Route path="/user/forgetPassword" component={ForgetPassword} />
          <Route
            path="/user/updatePassword/:access_token"
            component={ResetPassword}
          />
        </Switch>
        <Toast />
      </Router>
    </CommonState>
  );
}

export default App;
