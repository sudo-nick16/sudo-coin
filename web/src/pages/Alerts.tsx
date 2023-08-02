import { useSelector } from "react-redux";
import { RootState, clearAlerts, useAppDispatch } from "../store/store";
import Container from "../components/Container";
import { MdOutlineNotificationsActive } from "react-icons/md";
import Button from "../components/Button";

const Alerts = () => {
  const alerts = useSelector<RootState, RootState["alert"]>((state) => state.alert);
  const appDispatch = useAppDispatch();

  const handleClearAlerts = async () => {
    appDispatch(clearAlerts());
  }

  return (
    <Container lg={false} className="w-full !ml-6 p-3 text-light-1 bg-dark-2 border border-dark-1 rounded-xl">
      <div className="flex gap-6">
        <span className="font-bold text-xl flex items-center gap-x-2">
          <MdOutlineNotificationsActive className="w-6 h-6 inline-block mr-2" />
          Price Alerts
        </span>
        <Button onClick={handleClearAlerts} className="w-16 h-10 hover:bg-white hover:text-dark-2 ring-0 border">Clear</Button>
      </div>
      <div className="flex flex-col mt-4 w-full">
        {
          alerts.map((a, i) => {
            console.log(a)
            if (!a) {
              return null;
            }
            return (
              <div key={i} className="grid grid-cols-6 w-full">
                <div className="border border-dark-1 flex items-center p-3 font-semibold">
                  <img className="w-8 h-8" src={a.coin.image} />
                  <span className="mx-2">{a.coin.name}</span>
                  (<span className="">{a.coin.symbol}</span>)
                </div>
                <div className="border border-dark-1 p-3 font-semibold col-span-4">
                  {a.message}
                </div>
              </div>
            )
          })
        }
      </div>
    </Container>
  )
}

export default Alerts;
