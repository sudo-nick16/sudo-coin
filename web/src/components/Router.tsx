import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Layout from "./Layout";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import TrackedCoins from "../pages/TrackedCoins";
import { Provider } from "react-redux";
import Store from "../store/store";


const Router = () => {

  return (
    <>
      <Provider store={Store}>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/tracked-coins" element={<TrackedCoins />} />
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default Router;
