import { ReactElement, useEffect, useState } from "react";
import Container from "../components/Container";
import { chartDays } from "../constants";
import { Coin, Tracker } from "../types";
import { FaArrowDown, FaArrowUp, FaChevronDown } from "react-icons/fa";
import { PiDotFill } from "react-icons/pi";
import { HiOutlineHome } from "react-icons/hi";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import Button from "../components/Button";
import useAxios from "../hooks/useAxios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

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
  console.log({ price })
  return (
    <span className={`flex gap-1 font-semibold items-center ${classes[net].color}`}>
      {classes[net].icon}
      {price.toPrecision(2)}%
    </span>
  )
}

const TrackCard = ({ coin }: { coin: Coin }) => {
  const [showPriceHistory, setShowPriceHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [priceHistory, setPriceHistory] = useState<number[][]>([[]]);
  const [days, setDays] = useState(1);
  const api = useAxios();

  const handleShowPriceHistory = async () => {
    setLoading(true);
    const res = await api.get(`/coins/${coin.id}/history/${days}`)
    if (!res.data.error) {
      console.log(res.data.prices.prices);
      setPriceHistory(res.data.prices.prices);
    }
    setShowPriceHistory(true);
    setLoading(false);
  }

  useEffect(() => {
    handleShowPriceHistory();
  }, [days])

  return (
    <div className="">
      <div className="grid grid-cols-5 shadow-sm shadow-dark-1 hover:bg-dark-1 p-3 rounded-xl gap-4">
        <div className="flex gap-3">
          <img src={coin.image} alt={coin.name} className="w-10 h-10" />
          <div className="font-bold">
            <h2 className="">{coin.name}</h2>
            <span className="">{coin.symbol}</span>
          </div>
        </div>
        <div>
          <span className="font-bold">${coin.current_price}</span>
          <PriceDelta price={coin.price_change_percentage_24h_in_currency} />
        </div>
        <div className="font-bold">
          ${coin.market_cap}
        </div>
        <div></div>
        <div className="flex items-center justify-end">
          <FaChevronDown className={`w-3 h-3 cursor-pointer ${showPriceHistory? "rotate-180": ""}`} onClick={() => {
            if (showPriceHistory) {
              setShowPriceHistory(false);
              return ;
            }
            handleShowPriceHistory();
          }} />
        </div>
      </div>
      {
        showPriceHistory && (
          !loading ?
            <div className="my-6">
              <Line
                data={{
                  labels: priceHistory.map((coin) => {
                    const date = new Date(coin[0]);
                    const time =
                      date.getHours() > 12
                        ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                        : `${date.getHours()}:${date.getMinutes()} AM`;
                    return days === 1 ? time : date.toLocaleDateString();
                  }),

                  datasets: [
                    {
                      data: priceHistory.map((coin) => coin[1]),
                      label: `Price ( Past ${days} Days ) in USD`,
                      borderColor: "#EEBC1D",
                    },
                  ],
                }}
                options={{
                  elements: {
                    point: {
                      radius: 1,
                    },
                  },
                }}
              />
              <div className="flex gap-3 mx-auto w-fit my-4">
                {
                  chartDays.map((d, i) => {
                    return (
                      <Button className={`border-2 border-dark-1 ${days == d.value ? "bg-red-600" : ""} ring-0`} key={i} onClick={() => setDays(d.value)}>{d.label}</Button>
                    )
                  })
                }
              </div>
            </div> :
            <>
              Loading...
            </>

        )
      }
    </div>
  )
}

const TrackedCoins = () => {
  const [coins, setCoins] = useState<Tracker[]>([]);
  const [loading, setLoading] = useState(true);

  const api = useAxios();

  const fetchCoins = async () => {
    const res = await api.get("/trackers");
    console.log('trackers = ', res.data)
    if (!res.data.error) {
      const trackers = await Promise.all(res.data.trackers.map(async (t) => {
        const r = await api.get(`/coins/${t.coingecko_id}`);
        console.log(r.data.coin)
        return {
          ...t,
          coin: r.data.coin,
        }
      }))
      console.log({ trackers })
      setCoins(trackers);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchCoins();
  }, [])

  return (
    <Container lg={false} className="w-full !ml-6 p-3 text-light-1 bg-dark-2 border border-dark-1 rounded-xl">
      <span className="font-bold text-xl flex items-center gap-x-2">
        <HiOutlineHome className="w-6 h-6 inline-block mr-2" />
        Tracked Coins
      </span>
      <div className="grid grid-cols-5 font-bold mt-6 gap-y-2">
        <div>Name</div>
        <div>Current price</div>
        <div>Market Cap</div>
      </div>
      {
        loading ? (
          <span>Loading...</span>
        ) : (
          <div className="flex flex-col mt-4 gap-y-2 h-[calc(100%-6rem)] overflow-auto">
            {
              coins.map((coin, index) => {
                return (
                  <TrackCard coin={coin.coin} key={index} />
                )
              })
            }
          </div>
        )
      }
    </Container>
  )
}

export default TrackedCoins;
