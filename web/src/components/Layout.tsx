import { useEffect, useState } from "react"
import Navbar from "./Navbar"
import axios from "axios"
import { SERVER_URL } from "../constants"
import { RootState, addAlert, setAccessToken, setUserState, useAppDispatch } from "../store/store"
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
    const events = new EventSource(SERVER_URL + `/price-alert/${user.user.id}`);
    console.log("listening");

    events.onmessage = (e) => {
      console.log("received message");
      const parsedData = JSON.parse(e.data);
      console.log(parsedData);
      if (parsedData.type === "alert") {
        appDispatch(addAlert(parsedData));
      }
    }

    events.onerror = (e) => {
      console.log(e)
    }

    setListening(true);

  }, [user, listening])

  useEffect(() => {
    const refreshToken = async () => {
      const res = await axios.post(SERVER_URL + "/auth/refresh-token", {}, {
        withCredentials: true,
      })
      if (!res.data.error) {
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
