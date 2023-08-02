import { RiAccountCircleLine } from "react-icons/ri";
import Container from "./Container";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const user = useSelector<RootState, RootState["auth"]>((state) => state.auth);
  if (!user.user || !user.accessToken) {
    return <Navigate to="/login" />
  }
  return (
    <Container lg={false} className="w-full !ml-6 p-3 text-light-1 bg-dark-2 border border-dark-1 rounded-xl">
      <span className="font-bold text-xl flex items-center gap-x-2">
        <RiAccountCircleLine className="w-8 h-8 inline-block mr-2" />
        Profile
      </span>
      <div className="grid grid-cols-5 my-10 font-bold w-96 border-2 border-dark-1 rounded-xl">
        <span className="col-span-1 border border-dark-1 p-4">Name</span>
        <span className="col-span-4 border border-dark-1 p-4">{user.user.name}</span>
        <span className="col-span-1 border border-dark-1 p-4">Email</span>
        <span className="col-span-4 border border-dark-1 p-4">{user.user.email}</span>
      </div>

    </Container>
  )
}

export default Profile;
