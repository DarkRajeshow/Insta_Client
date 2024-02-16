import { useContext, useEffect, useState } from "react";
import { Context } from "../../context/Store";
import PropTypes from 'prop-types';

const FollowingForMsg = ({ setCollapse }) => {

  const { userWithFollowing, setSelectedUserForChat, selectedUserForChat } = useContext(Context);
  const following = userWithFollowing.following;

  const [users, setUsers] = useState(following);
  const [query, setQuery] = useState("");

  const SearchUsers = () => {
    const searchResult = following.filter((user) => {
      const reqEx = new RegExp(query, "i");
      return reqEx.test(user.name) || reqEx.test(user.username);
    });
    setUsers(searchResult);
  };


  useEffect(() => {
    SearchUsers();
  }, [query]);

  return (
    <div className="px-1 relative select-none animate-in">
      <div className={`w-full  rounded-t-lg h-10 sm:h-14 text-lg sm:text-xl bg-zinc-800/30 hover:bg-zinc-700/50 px-2 sm:p-4 font-bold text-light flex items-center`}>
        <h1>Chats</h1>
      </div>
      <div className="px-2 sm:px-4 py-2 sm:py-3">
        <div className="search flex text-xs sm:text-sm text-light items-center gap-2 px-2 border border-light/20 rounded-sm border-b-green-500">
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
              }} className={`cursor-pointer follow bottom-0 py-3 pl-2 flex items-center gap-2 hover:bg-zinc-700/50 rounded-lg transition-all ${selectedUserForChat && selectedUserForChat.username === user.username && "bg-zinc-700/40"} "`} key={user._id}>
                <img src={`/api/uploads/${user.dp}`} className="h-10 w-10 rounded-full" alt={user.name} />
                <div className="flex flex-col text-light/90">
                  <h3 className="text-sm text-zinc-300">{user.name}</h3>
                  <p className="text-xs">{user.bio}</p>
                </div>
              </div>
            )
          })}

          {
            following.length > 0 && users.length === 0 && (
              <div className="flex animate-in fade-in-5 bg-zinc-700/10 rounded-lg text-xs sm:text-sm items-center justify-center h-[70vh] sm:h-[65vh] mt-1 sm:mt-2">
                <h1 className="text-light w-[100px] sm:w-[150px] text-center text-muted-foreground ">No user found.</h1>
              </div>
            )
          }
          {
            following.length === 0 && (
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

FollowingForMsg.propTypes = {
  setCollapse: PropTypes.func.isRequired,
};

export default FollowingForMsg;