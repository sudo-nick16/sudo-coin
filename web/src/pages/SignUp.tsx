import { Link, Navigate } from "react-router-dom";
import Button from "../components/Button";
import Container from "../components/Container";
import Input from "../components/Input";
import { useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../constants";
import { RootState, setAccessToken, setUserState, useAppDispatch } from "../store/store";
import { useSelector } from "react-redux";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const appDispatch = useAppDispatch();
  const user = useSelector<RootState, RootState["auth"]>((state) => state.auth);

  if (user.user && user.accessToken) {
    return <Navigate to="/" replace={true} />
  }

  const handleSignup = async () => {
    if (!email || !password || !name) return;
    const data = {
      name,
      email,
      password,
    }
    const res = await axios.post(SERVER_URL + "/auth/sign-up", data, {
      withCredentials: true,
    });
    if (!res.data.error) {
      console.log(res.data.message, res.data.user);
      appDispatch(setAccessToken(res.data.accessToken));
      appDispatch(setUserState(res.data.user));
    }
  }

  return (
    <Container className="flex flex-col my-auto ring ring-dark-1 p-6 shadow shadow-lg gap-5 items-center rounded-xl">
      <h1 className="text-xl font-bold mb-4">SignUp</h1>
      <Input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="Name" className="w-72" />
      <Input onChange={(e) => setEmail(e.target.value)} value={email} type="text" placeholder="Email" className="w-72" />
      <Input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Password" className="w-72" />
      <Button onClick={handleSignup}>Sign up</Button>
      <Link to="/login">
        <span className="hover:underline text-light-1">
          or log in
        </span>
      </Link>
    </Container>
  )
}

export default SignUp;
