import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import convertToAMPM from '../../utility/covertToAMPM'
import Cookies from 'js-cookie';
import { memo, useContext, useEffect, useRef } from 'react';
import { Context } from '../../context/Store';
import SmartLoader from '../reusable/SmartLoader';
import filePath from '../../assets/filePath';



const ChatComponent = ({ sendMessage }) => {
  const { messages, messageInput, messageLoading, selectedUserForChat, setMessageInput } = useContext(Context);

  const currentLyLoggedUser = Cookies.get("userId");

  const scrollDivRef = useRef(null);

  useEffect(() => {
    if (scrollDivRef.current) {
      scrollDivRef.current.scrollTop = scrollDivRef.current.scrollHeight;
    }
  }, [messages]);


  return (
    <div className="relative chat col-span-9 rounded-lg h-full overflow-hidden">
      {selectedUserForChat && <>
        <Link to={`/user/${selectedUserForChat.username}`} className='absolute top-0 w-full p-2 flex items-center group gap-2 bg-zinc-800/30 border-b border-b-zinc-700/40'>
          <img src={`${filePath}/${selectedUserForChat.dp}`} className="h-10 w-10 rounded-full" alt={selectedUserForChat.name} />
          <div className="flex flex-col text-light/90">
            <h3 className="text-sm text-zinc-300 group-hover:text-blue-300">{selectedUserForChat.name}</h3>
            <p className="text-xs text-zinc-500">{selectedUserForChat.bio}</p>
          </div>
        </Link>

        <div ref={scrollDivRef} className="messageInput-container w-full my-14 p-4 h-[68vh] overflow-y-auto">
          {!messageLoading && messages
            .map((messageInput, index) => {
              const isItYou = messageInput.sender === currentLyLoggedUser;
              return (
                <div key={index} className={`fade-in-5 animate-in my-4 cursor-pointer max-w-[250px] w-[50vw] auto flex flex-col gap-1 ${isItYou ? "ml-auto" : "mr-auto"}`}>
                  <div className={`messageInput text-sm p-2 rounded-sm ${isItYou ? "bg-[#455EFF] text-light " : "text-light/85 bg-zinc-700/40"}`}>
                    <p>{messageInput.content}</p>
                  </div>
                  <span className='pl-1 text-xs font-semibold text-zinc-500'>{convertToAMPM(messageInput.timestamp)}</span>
                </div>
              );
            })}

          {
            messageLoading && (
              <div>
                <SmartLoader className='h-[60vh]' />
              </div>
            )
          }


          {
            messages.length === 0 && !messageLoading && (
              <div className='w-[250px] text-center m-auto gap-2 flex flex-col items-center justify-center h-full'>
                <i className="ri-chat-3-line text-4xl text-light/50"></i>
                <h1 className='text-light/60 text-base md:text-2xl select-none'>No previous chat availiable.</h1>
              </div>
            )
          }
        </div>
        <form onSubmit={sendMessage} className='absolute bottom-2 w-full p-2 flex items-center justify-between gap-2'>
          <input value={messageInput} onChange={(e) => {
            setMessageInput(e.target.value)
          }} type="text" className='w-full bg-transparent border border-zinc-600/20 px-4 py-2 text-light rounded-sm placeholder:text-zinc-600 outline-none focus:border-zinc-600' placeholder='Hello....' />
          <button type='submit' className="ri-send-plane-2-line text-2xl bg-zinc-700/20 hover:bg-zinc-700 p-1.5 text-light rounded-sm"></button>
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
  sendMessage: PropTypes.func.isRequired
};

const Chat = memo(ChatComponent);

export default Chat;
