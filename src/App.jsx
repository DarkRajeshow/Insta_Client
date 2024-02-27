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
import { Toaster } from 'sonner';
import Navbar from './components/layout/Navbar';
import Liked from './components/pages/Liked';
import UploadStory from './components/pages/uploadstory';
import Saved from './components/pages/Saved';
import Footer from './components/layout/Footer';
import { useContext, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Context } from './context/Store';


function App() {

  const location = useLocation();
  // Define an array of paths where you want to show the footer

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

  const notShowNav = notShowNavPaths.some(path => location.pathname.includes(path));

  const { setSocket } = useContext(Context);

  useEffect(() => {
    const memoizedSocket = io(import.meta.env.VITE_REACT_APP_SERVER_URL);
    setSocket(memoizedSocket);

    return () => memoizedSocket.close();
  }, [setSocket]);



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
        <Route path="/Messages" element={<Protected Component={Messages} />} />
        <Route path="/notification" element={<Protected Component={Notification} />} />
        <Route path="/upload" element={<Protected Component={Upload} />} />
        <Route path="/search" element={<Search />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/user/:username" element={<Username />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/uploadstory" element={<Protected Component={UploadStory} />} />
        <Route path="*" element={<Page404 />} />
      </Routes>

      <Footer showFooter={showFooter} />

    </main >
  );
}

export default App;
