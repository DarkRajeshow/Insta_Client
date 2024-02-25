import { memo, useCallback, useContext, useEffect, useState } from "react";
import { Context } from "../../context/Store";
import PropTypes from 'prop-types';
import filePath from "../../assets/filePath";
import convertToAMPM from "../../utility/covertToAMPM";

let RecentChats = ({ setCollapse }) => {

  const { recentChatUsers, setSelectedUserForChat, selectedUserForChat } = useContext(Context);

  const [users, setUsers] = useState(recentChatUsers);
  const [query, setQuery] = useState("");

  const SearchUsers = useCallback(
    () => {
      const searchResult = recentChatUsers.filter((user) => {
        const reqEx = new RegExp(query, "i");
        return reqEx.test(user.name) || reqEx.test(user.username);
      });
      setUsers(searchResult);
    }, [recentChatUsers, query]);


  useEffect(() => {
    console.log(recentChatUsers);
    SearchUsers();
  }, [SearchUsers, recentChatUsers]);

  return (
    <div className="px-1 relative select-none animate-in">
      <div className={`w-full  rounded-t-lg h-10 sm:h-14 text-lg sm:text-xl bg-zinc-800/30 hover:bg-zinc-700/50 px-2 sm:p-4 font-bold text-light flex items-center`}>
        <h1>Chats</h1>
      </div>
      <div className="px-2 sm:px-4 py-2 sm:py-3">
        <div className="search flex text-xs sm:text-sm text-light items-center gap-2 px-2 border border-light/10 rounded-sm focus-within:border-light/30 focus-within:border-b-green-400">
          <i className="ri-search-line py-2"></i>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            type="text"
            className="py-2 bg-transparent w-[90%] focus:outline-none outline-none"
            placeholder="Search user"
          />
        </div>
        <div className="users flex flex-col gap-1 my-2">
          {users.map((user) => {
            return (
              <div onClick={async () => {
                if (user) {
                  await setSelectedUserForChat(user);
                  await setCollapse(true);
                }
              }} className={`cursor-pointer follow bottom-0 py-3 px-2 flex items-center gap-2 hover:bg-zinc-700/50 rounded-lg transition-all ${selectedUserForChat && selectedUserForChat._id === user._id ? "bg-zinc-700/60" : "bg-zinc-700/10"} "`} key={user._id}>
                <img src={`${filePath}/${user.dp}`} className="h-10 w-10 rounded-full" alt={user.name} />
                <div className="flex flex-col text-light/90 w-full">
                  <h3 className="text-sm text-zinc-300 capitalize">{user.name.toLocaleLowerCase()}</h3>
                  <div className="text-xs text-zinc-400/60">
                    {user.lastMessage ?
                      <div className="flex items-center justify-between">
                        <p className="capitalize">{`${user.lastMessage.sender !== user._id ? "You" : user.name.split(" ")[0].toLocaleLowerCase()}: ${user.lastMessage.content.length > 15 ? user.lastMessage.content.slice(0, 15) + "..." : user.lastMessage.content}`}</p>
                        <p>{convertToAMPM(user.lastMessage.timestamp)}</p>
                      </div>
                      :
                      <p>No recent chats</p>
                    }

                  </div>
                </div>
              </div>
            )
          })}

          {
            recentChatUsers.length > 0 && users.length === 0 && (
              <div className="flex animate-in fade-in-5 bg-zinc-700/10 rounded-lg text-xs sm:text-sm items-center justify-center h-[70vh] sm:h-[65vh] mt-1 sm:mt-2">
                <h1 className="text-light w-[100px] sm:w-[150px] text-center text-muted-foreground ">No user found.</h1>
              </div>
            )
          }
          {
            recentChatUsers.length === 0 && (
              <div className="flex bg-zinc-700/10 rounded-lg items-center justify-center h-[70vh] sm:h-[65vh] mt-1 sm:mt-2">
                <h1 className="text-light text-xs sm:text-sm w-[100px] sm:w-[150px] text-center text-muted-foreground">Follow someone to start.</h1>
              </div>
            )
          }
        </div>
      </div>
    </div >
  );
};

RecentChats.propTypes = {
  setCollapse: PropTypes.func.isRequired,
};

RecentChats = memo(RecentChats, (prevProps, nextProps) => {
  // Only re-render when setCollapse prop changes
  return prevProps.setCollapse === nextProps.setCollapse;
});

export default RecentChats;