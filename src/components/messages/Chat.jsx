import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { memo, useContext, useEffect, useRef, useState } from 'react';
import { Context } from '../../context/Store';
import SmartLoader from '../reusable/SmartLoader';
import filePath from '../../assets/filePath';
import { addNoficationAPI } from '../../utility/apiUtils';
import Message from '../reusable/Message';

const ChatComponent = ({ sendMessage, collapse, userId }) => {

  const { messages, socket, setIsSelectedUserOnline, messageInput, selectedUserForChat, setMessageInput, isSelectedUserOnline } = useContext(Context);


  const scrollDivRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const addNotification = async (notifcation) => {
    if (!userId) {
      return;
    }
    try {
      const { data } = await addNoficationAPI(notifcation);
      if (data.success) {
        console.log(data.success);
      }
    } catch (error) {
      console.error('Something went wrong:', error);
    }
  }


  useEffect(() => {
    if (socket) {
      if (selectedUserForChat !== null) {
        setIsSelectedUserOnline(false);
        socket.emit("is_online", selectedUserForChat._id);
      }

      socket.on('is_online_response', (response) => {
        setIsSelectedUserOnline(response.isOnline);
      });
    }
  }, [userId, selectedUserForChat, setIsSelectedUserOnline, socket]);

  const mobile = window.innerWidth < 768;

  useEffect(() => {
    if (scrollDivRef.current) {
      scrollDivRef.current.scrollTop = scrollDivRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="relative chat col-span-9 rounded-lg h-full overflow-hidden bg-[#12101A] border-2 border-b-0 border-[#12101A]">
      {selectedUserForChat && <>
        <Link to={`/user/${selectedUserForChat.username}`} className='select-none absolute w-full top-0 p-2 flex items-center group gap-2 bg-zinc-800/80 border-b-4 border-[#12101A] rounded-t-lg'>
          <img src={`${filePath}/${selectedUserForChat.dp}`} className="h-10 w-10 rounded-full" alt={selectedUserForChat.name} />
          <div className="flex flex-col text-light/90">
            <h3 className="text-sm text-zinc-300 group-hover:text-blue-300">{selectedUserForChat.name}</h3>
            <p className={`text-xs ${isSelectedUserOnline && "text-green-300"} `}>{isSelectedUserOnline ? "Online" : "Offline"}</p>
          </div>
        </Link>

        <div ref={scrollDivRef} className="message-container w-full my-14 p-4 pb-14 md:pb-4 h-[68vh] overflow-y-auto">
          <div className={`${collapse ? 'block' : "hidden md:block"}`}>
            {
              (!mobile || collapse) && messages
                .map((message, index) => {
                  const isItYou = message.sender === userId;
                  return (
                    <Message key={index} userId={userId} message={message} isItYou={isItYou} />
                  );
                })
            }
          </div>

          {
            !messages && (
              <div>
                <SmartLoader className='h-[60vh]' />
              </div>
            )
          }

          {
            messages.length === 0 && (
              <div className='w-[250px] text-center m-auto gap-2 flex flex-col items-center justify-center h-full'>
                <i className="ri-chat-3-line text-4xl text-light/50"></i>
                <h1 className='text-light/60 text-base md:text-2xl select-none'>No previous chat availiable.</h1>
              </div>
            )
          }
        </div>

        <form onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          await sendMessage();
          setLoading(false);
          if (!isSelectedUserOnline) {
            await addNotification({
              recipient: selectedUserForChat._id,
              relatedUser: userId,
              message: messageInput,
              type: "message"
            });
          }
        }} className='absolute bg-[#12101A] bottom-0 w-full p-2 flex items-center justify-between gap-2 shadow-[0_0_10px_1px] shadow-zinc-900'>
          <div className='w-full border border-zinc-600/40 focus-within:border-zinc-600 flex rounded-sm items-center justify-between pr-2'>
            <input required className="w-[90%] text-light bg-transparent px-4 py-2 rounded-sm placeholder:text-zinc-600 outline-none" value={messageInput} onChange={(e) => {
              setMessageInput(e.target.value);
            }} type="text" placeholder='Hello....' />
            {
              loading && <span className='h-4 w-4 rounded-full border-[3px] border-green-500 border-t-transparent spin' />
            }
          </div>
          <button disabled={loading} type='submit' className={`ri-send-plane-2-line text-2xl  p-1.5 text-white rounded-sm ${messageInput.length > 0 ? "bg-green-600 text-dark cursor-pointer" : "bg-zinc-700/40 cursor-default"}`}></button>
        </form>
      </>
      }

      {
        !selectedUserForChat &&
        <div className='bg-zinc-700/5 rounded-lg text-center mx-5 gap-2 flex flex-col items-center justify-center h-[94%] my-5 '>
          <div className='w-[250px]'>
            <i className="ri-instagram-fill text-4xl text-light/50"></i>
            <h1 className='text-light/60 text-xl md:text-2xl select-none'>Select user to chat.</h1>
          </div>
        </div>
      }
    </div>
  );
}


ChatComponent.propTypes = {
  sendMessage: PropTypes.func.isRequired,
  fetchRecentChats: PropTypes.func,
  collapse: PropTypes.bool,
  userId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
};

const Chat = memo(ChatComponent);

export default Chat;
