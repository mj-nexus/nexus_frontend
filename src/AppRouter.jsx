import { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Login } from "./pages/loginPage/Login";
import { Header } from "./components/Hedaer/Header";
import { Sidebar } from "./components/SideBar/Side";
import { Home } from "./pages/Home/Home";
import { AuthContext } from "./context/AuthContext";
import SignUpStep1 from "./pages/signupPage/Signup";
import SignupStepTwo from "./pages/signupPage/SignupStepTwo";
import SignupStepThree from "./pages/signupPage/SignuupStepThree";

export const AppRouter = () => {
  const { user } = useContext(AuthContext);

  return (
      <Router>
        <div className="App">
          <Routes>
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/" />
                ) : (
                  <Login/>
                )
              }
            />
            <Route path="/signup" element={<SignUpStep1/>}>
            </Route>
            <Route path="/signup/step2" Component={SignupStepTwo} />
            <Route path="/signup/step3" Component={SignupStepThree} />
            <Route
              path="/"
              element={
                user ? (
                  <>
                    <Header />
                    <Sidebar />
                    <Home />
                  </>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </div>
      </Router>
  );
}
