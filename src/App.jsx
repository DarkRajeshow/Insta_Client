import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './components/pages/Home';
import Signup from './components/pages/Signup';
import Login from './components/pages/Login';
import Profile from './components/pages/Profile';
import Edit from './components/pages/Edit';
import Search from './components/pages/Search';
import Messages from './components/pages/Messages';
import Notification from './components/pages/Notification';
import Upload from './components/pages/Upload';
import Post from './components/pages/Post';
import Username from './components/pages/Username';
import Explore from './components/pages/Explore';
import Page404 from './components/special/Page404';
import Protected from './components/special/Protected';
import { Toaster, toast } from 'sonner';
import Navbar from './components/layout/Navbar';
import Liked from './components/pages/Liked';
import UploadStory from './components/pages/uploadstory';
import Saved from './components/pages/Saved';
import Footer from './components/layout/Footer';
import { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Context } from './context/Store';
import { getUserId, specialUserAPI } from './utility/apiUtils';
import { ShadCnToaster } from "@/components/ui/toaster"
import getTimePassed from './utility/findTimePassed';
import filePath from './assets/filePath';


function App() {

  const location = useLocation();

  const [currentlyLoggedUser, setCurrentlyLoggedUser] = useState(false);
  const [isUserInMessageView, setIsUserInMessageView] = useState(false);

  const findUserId = async () => {
    const currentlyLoggedUserStatus = await getUserId();
    setCurrentlyLoggedUser(currentlyLoggedUserStatus)
  }

  useEffect(() => {
    findUserId();
  }, [])


  const showFooterPaths = [
    '/',
    '/edit',
    '/Messages',
    '/upload',
  ];
  // Check if the current location matches any of the paths in showFooterPaths
  const showFooter = showFooterPaths.includes(location.pathname);

  const notShowNavPaths = [
    '/post',
  ];

  useEffect(() => {
    const isUserInMessageView = location.pathname.includes('/messages');
    setIsUserInMessageView(isUserInMessageView)
  }, [location.pathname])

  const notShowNav = notShowNavPaths.some(path => location.pathname.includes(path));

  const { setSocket, socket, fetchRecentChats, selectedUserForChat, fetchMessagesFromDB } = useContext(Context);

  const notifyMessage = async (userId, message) => {
    try {
      const { data } = await specialUserAPI(userId, `name dp`);
      if (data.success) {
        toast.message((
          // <div className='flex gap-1 items-center justify-between w-full h-full'  >
          //   <div className='flex flex-col gap-1'>
          //     <h3 className='text-zinc-400 text-sm'>Message form <span className='font-semibold text-green-300'>{data.user.name.split(" ")[0]}</span></h3>
          //     <p className='text-orange-200 font-semibold text-base'>{message.length > 10 ? message.slice(0, 18) + "..." : message}</p>
          //   </div>
          //   <Link to={'/messages'} className='bg-zinc-700 scale-90 hover:scale-100 hover:bg-blue-700 text-light py-1.5 px-3 rounded-full font-sm font-semibold'>View</Link>
          // </div>
          <div to={`/messages`} className='flex items-center hover:bg-zinc-800 bg-zinc-800/20 rounded-lg my-1 justify-between w-full py-3 px-2 relative  cursor-pointer'>
            <div className="follow bottom-0 flex items-center gap-2 transition-all">
              <img src={`${filePath}/${message.relatedUser.dp}`} className="h-12 w-12 rounded-full border border-zinc-700" alt={message.relatedUser.name} />
              <div className="flex flex-col text-light">

                <p className="capitalize text-sm font-semibold">{message.message.length > 20 ? message.message.slice(0, 20) + "..." : message.message}</p>
                <p className="text-xs text-zinc-400">Message from {message.relatedUser.name}</p>
              </div>
            </div>

            <div className='flex flex-col h-full gap-3 justify-between'>
              <p className={`text-xs font-medium ${"text-blue-400"}`}>{'New'}</p>
              < p className="text-xs font-medium text-zinc-400">{getTimePassed(new Date())}</p>
            </div>
          </div>
        ))
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const memoizedSocket = io(import.meta.env.VITE_REACT_APP_SERVER_URL);
    setSocket(memoizedSocket);

    return () => memoizedSocket.close();
  }, [setSocket]);


  useEffect(() => {
    if (socket) {
      if (currentlyLoggedUser) {
        const handleConnect = async () => {
          await socket.emit("join_room", currentlyLoggedUser);
          await socket.emit("online", currentlyLoggedUser);
        };

        const handleDisconnect = async () => {
          await socket.emit("offline", currentlyLoggedUser);
          socket.disconnect();
        };

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);

        return () => {
          socket.off('connect', handleConnect);
          socket.off('disconnect', handleDisconnect);
        };
      }
    }
  }, [socket, currentlyLoggedUser]);


  useEffect(() => {
    if (socket) {
      socket.on('receive_message', async (messageContent) => {
        if (!isUserInMessageView) {
          const notifcation = {
            recipient: messageContent.receiver,
            relatedUser: messageContent.sender,
            message: messageContent.content,
            type: "message"
          }
          notifyMessage(notifcation.relatedUser, notifcation.message);
          return;
        }
        else {
          if (selectedUserForChat && (selectedUserForChat._id === messageContent.sender)) {
            await fetchMessagesFromDB();
          }
          await fetchRecentChats();
        }
      });
    }
  }, [socket, selectedUserForChat, currentlyLoggedUser, fetchRecentChats, isUserInMessageView, fetchMessagesFromDB]);

  return (
    <main>
      <Toaster richColors position="top-center" theme='dark' />
      <Navbar notShowNav={notShowNav} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/liked" element={<Protected Component={Liked} />} />
        <Route path="/profile/saved" element={<Protected Component={Saved} />} />
        <Route path="/profile" element={<Protected Component={Profile} />} />
        <Route path="/edit" element={<Protected Component={Edit} />} />
        <Route path="/messages/:userId?" element={<Protected Component={Messages} />} />
        <Route path="/notifications" element={<Protected Component={Notification} />} />
        <Route path="/upload" element={<Protected Component={Upload} />} />
        <Route path="/search" element={<Search />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/user/:username" element={<Username />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/uploadstory" element={<Protected Component={UploadStory} />} />
        <Route path="*" element={<Page404 />} />
      </Routes>

      <Footer showFooter={showFooter} />
      <ShadCnToaster />
    </main >
  );
}

export default App;
