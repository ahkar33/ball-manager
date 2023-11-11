import { IPlayer } from "@/interfaces";
import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const Players = () => {
  const [players, setPlayers] = useState<IPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const getPlayers = async (pageNum: number) => {
    try {
      setIsLoading(true);
      const response = await axios.get<{ data: IPlayer[] }>(
        `https://www.balldontlie.io/api/v1/players?page=${pageNum}`
      );
      const newData = response.data.data;
      if (newData.length === 0) {
        setHasMore(false);
      }
      setPlayers((prevPlayers) => [...prevPlayers, ...newData]);
    } catch (error) {
      message.error("Something went wrong when getting players data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPlayers(page);
  }, [page]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="items-center justify-center space-y-4 h-full p-12 w-full">
      <InfiniteScroll
        dataLength={players.length}
        next={() => console.log('')}
        hasMore={hasMore}
        loader={null}
      >
        {players.map((player, index) => (
          <div key={player.id}>
            <p>{index + 1}  {player.first_name}</p>
          </div>
        ))}
      </InfiniteScroll>

      {hasMore && (
        <div className="text-center mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Players;
