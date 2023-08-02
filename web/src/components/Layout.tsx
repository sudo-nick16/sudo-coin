import { useEffect } from "react"
import Navbar from "./Navbar"
import axios from "axios"
import { SERVER_URL } from "../constants"
import { setAccessToken, setUserState, useAppDispatch } from "../store/store"

type LayoutProps = {
  className?: string
  children?: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const appDispatch = useAppDispatch();

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
