import { useEffect, useState } from "react"
import Navbar from "./Navbar"
import axios from "axios"
import { SERVER_URL } from "../constants"
import { RootState, setAccessToken, setUserState, useAppDispatch } from "../store/store"
import { useSelector } from "react-redux"

type LayoutProps = {
  className?: string
  children?: React.ReactNode
}


const Layout: React.FC<LayoutProps> = ({ children }) => {
  const appDispatch = useAppDispatch();
  const [listening, setListening] = useState(false);

  const user = useSelector<RootState, RootState["auth"]>((state) => state.auth);

  useEffect(() => {
    if (!user.user || !user.accessToken || listening) {
      return;
    }
    const events = new EventSource(SERVER_URL + "/price-alert");

    events.onmessage = (e) => {
      const parsedData = JSON.parse(e.data);
      console.log(parsedData);
    }
    setListening(true);

  }, [user, listening])

  useEffect(() => {
    const refreshToken = async () => {
      const res = await axios.post(SERVER_URL + "/auth/refresh-token", {}, {
        withCredentials: true,
      })
      if (!res.data.error) {
        console.log(res.data.message);
        appDispatch(setAccessToken(res.data.accessToken))
        appDispatch(setUserState(res.data.user));
      }
    }
    refreshToken();
  }, [])
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default Layout;
