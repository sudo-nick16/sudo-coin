import { ReactElement, useEffect, useState } from "react";
import Container from "../components/Container";
import axios from "axios";
import { SERVER_URL } from "../constants";
import { ScrapedCoin } from "../types";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { PiDotFill } from "react-icons/pi";
import { HiOutlineHome } from "react-icons/hi";
import Button from "../components/Button";
import useAxios from "../hooks/useAxios";

const classes: { [key: string]: { color: string; icon: ReactElement } } = {
  "loss": { color: "text-red-500", icon: <FaArrowDown /> },
  "profit": { color: "text-green-500", icon: <FaArrowUp /> },
  "neutral": { color: "text-gray-500", icon: <PiDotFill /> }
}

const PriceDelta = ({ price }: { price: number }) => {
  let net = "loss";
  if (price > 0) {
    net = "profit"
  } else if (price === 0) {
    net = "neutral"
  }
  return (
    <span className={`flex gap-1 font-semibold items-center ${classes[net].color}`}>
      {classes[net].icon}
      {price.toPrecision(2)}%
    </span>
  )
}

const Dashboard = () => {
  const [coins, setCoins] = useState<ScrapedCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const api = useAxios();

  const trackCoinHandler = async (coidId: string) => {
    const res = await api.post(`/trackers/${coidId}`);
    console.log(res.data);
    if (!res.data.error) {
      console.log(res.data);
    }
  }

  useEffect(() => {
    const fetchCoins = async () => {
      const res = await axios.get(SERVER_URL + "/coins");
      if (res.data.coins) {
        setCoins(res.data.coins);
      }
      setLoading(false);
    }
    let gTimer: NodeJS.Timeout;
    const tm = () => {
      console.log("polling")
      fetchCoins();
      gTimer = setTimeout(() => {
        tm();
      }, 30 * 1000);
    }
    tm();
    return () => {
      clearTimeout(gTimer);
    }
  }, [])

  return (
    <Container lg={false} className="w-full !ml-6 p-3 text-light-1 bg-dark-2 border border-dark-1 rounded-xl">
      <span className="font-bold text-xl flex items-center gap-x-2">
        <HiOutlineHome className="w-6 h-6 inline-block mr-2" />
        Dashboard
      </span>
      <div className="grid grid-cols-5 font-semibold my-5 gap-y-2">
        <div>Name</div>
        <div>Current price</div>
        <div>Market Cap</div>
      </div>
      {
        loading ? (
        <span className="w-full p-10 flex items-center justify-center font-bold">Loading...</span>
        ) : (
          <div className="flex flex-col mt-8 gap-y-2 h-[calc(100%-6rem)] overflow-auto">
            {
              coins.map((coin, index) => {
                return (
                  <div key={index} className="grid grid-cols-5 shadow-sm shadow-dark-1 hover:bg-dark-1 p-3 rounded-xl gap-4">
                    <div className="flex items-center gap-4">
                      <img src={coin.image} alt={coin.name} className="w-10 h-10" />
                      <div className="font-bold">
                        <h2 className="">{coin.name}</h2>
                        <span className="">{coin.symbol}</span>
                      </div>
                    </div>
                    <div>
                      <span className="font-bold">${coin.price}</span>
                      <PriceDelta price={parseFloat(coin.change24h)} />
                    </div>
                    <div className="font-bold">
                      {coin.marketCap}
                    </div>
                    <Button className="hover:bg-white hover:text-dark-2 w-16 h-10" onClick={() => trackCoinHandler(coin.id)}>
                      Track
                    </Button>
                  </div>
                )
              })
            }
          </div>
        )
      }
    </Container>
  )
}

export default Dashboard;
