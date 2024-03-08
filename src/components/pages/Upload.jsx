import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';
import { Context } from '../../context/Store'
import api from '../../assets/api';
import { uploadPostAPI } from '../../utility/apiUtils';


const Upload = () => {

  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const [hoverVideo, setHoverVideo] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');

  const { loggedUserData, setLoggedUserData } = useContext(Context);

  // Function to handle adding a tag to the list
  const addTag = () => {
    if (tags.length >= 6) {
      toast.warning("You can have atmost 6 tags per post.")
      return;
    }
    if (selectedTag && !tags.includes(selectedTag)) {
      setTags([...tags, selectedTag]);
      setSelectedTag('');
    }
  };

  // Function to handle removing a tag from the list
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const navigate = useNavigate();

  const previewImage = (e) => {
    const input = e.target;
    if (input.files) {
      const currentFile = input.files[0];

      if (currentFile.type.startsWith('image/')) {
        setIsImage(true);
        setSrc(URL.createObjectURL(currentFile));
      }

      else if (currentFile.type.startsWith('video/')) {

        setIsImage(false);

        setSrc(URL.createObjectURL(currentFile));

        const videoElement = document.createElement('video');

        videoElement.src = URL.createObjectURL(currentFile);

        videoElement.addEventListener('loadedmetadata', () => {
          const durationInSeconds = videoElement.duration;
          if (durationInSeconds > 60) {
            toast.error('Video duration should be less than 1 minute.');
            setSrc(null);
          }
        });

      } else {
        setIsImage(false);
        setSrc(null);
        toast.error('Invalid file type. Please select an image or video.');
      }
    }
  };


  const submitPost = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    if (!formData.get("file")) {
      toast.warning("A post must have a media file.");
      return;
    }

    if (tags.length === 0) {
      toast.warning("Please include tags to reach wider audience.");
      return;
    }

    if (!loggedUserData) {
      return;
    }

    setLoading(true);

    const type = isImage ? "image" : "video";

    //setting extra attributes;
    formData.set("type", type);

    //for searching purpose
    formData.set("username", loggedUserData.username)
    formData.set("name", loggedUserData.name)
    formData.set("tags", tags)

    try {
      if (formData.get("file")) {
        const { data } = await uploadPostAPI(formData);

        if (data.success) {
          toast.success(data.status)
          navigate("/profile")
        }
        else {
          toast.warning(data.status)
        }
      }
      else {
        toast.error("File is not selected.")
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }

  const fetchUserIfItsNOtExists = async () => {
    if (loggedUserData) {
      return;
    }
    else {
      try {
        const { data } = await api.get("/api/user");
        console.log(data);
        if (data.success) {
          setLoggedUserData(data.user);
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    fetchUserIfItsNOtExists();
  }, [])

  return (
    <div className="w-full min-h-screen bg-zinc-900 text-white py-5">
      <div className="flex justify-between items-center px-4">
        <Link to="/profile" className="text-sm text-blue-500">
          <i className="ri-arrow-left-s-line"></i> profile
        </Link>
        <h2 className="leading-none text-sm">Upload Post</h2>
        <Link to="/" className="text-sm">
          <i className="ri-home-line"></i> home
        </Link>
      </div>
      <div className='m-auto sm:w-[440px] '>
        <div className="flex flex-col items-center gap-2 mt-20">
          <div className="image w-full sm:w-[440px] rounded-3xl aspect-square border-2 border-zinc-800 flex items-center justify-center">
            {!src && <div onClick={() => document.querySelector('#uploadForm input').click()} className='cursor-pointer h-full w-full border-dotted rounded-3xl flex items-center justify-center'>
              <h1 className='text-4xl text-gray-400 font-bold'>Open file</h1>
            </div>
            }

            {(src && isImage) &&
              <div className='relative h-full'>
                <img
                  id="postPreview"
                  className="h-full w-full rounded-lg object-cover"
                  src={src}
                  alt="Post"
                />
                <i onClick={() => { setSrc(null) }} className="cursor-pointer bg-gray-200 border-gray-300 border-2 text-black p-1 rounded-md absolute top-3 right-3 ri-delete-bin-6-line text-2xl"></i>
              </div>
            }

            {(src && !isImage) &&
              <div className='relative h-full'>
                <video
                  onMouseEnter={(e) => {
                    e.target.play()
                    setHoverVideo(true);
                  }}
                  onMouseLeave={(e) => {
                    e.target.pause()
                    setHoverVideo(false);
                  }}
                  id="video"
                  className="h-full w-full rounded-lg object-cover"
                  alt="Post"
                  controls={hoverVideo}
                  muted
                  playsInline
                >
                  <source src={src} type="video/mp4" />
                </video>
                <i onClick={() => { setSrc(null) }} className="cursor-pointer bg-gray-200 border-gray-300 border-2 text-black p-1 rounded-md absolute top-3 right-3 ri-delete-bin-6-line text-2xl"></i>
              </div>
            }
          </div>
          <button
            id="selectPic"
            className="text-blue-500 capitalize my-2 font-semibold"
            onClick={() => document.querySelector('#uploadForm input').click()}
          >
            Select Picture
          </button>
        </div>
        <form
          id="uploadForm"
          className="w-full mt-4 py-4"
          onSubmit={submitPost}
          encType="multipart/form-data"
        >
          <input accept="image/*, video/*" hidden type="file" name="file" onChange={previewImage} />


          {src && (

            <>
              <label htmlFor="caption" className='text-zinc-400'>Title / Caption <span className='text-red-400'>*</span></label>
              <textarea
                required
                className="px-3 py-2 w-full bg-zinc-900 border-2 h-40 border-zinc-800 resize-none rounded-md outline-none mb-10 mt-2 placeholder:text-zinc-600"
                placeholder="Write a caption..."
                name="caption"
              ></textarea>
              <label htmlFor="text" className='text-zinc-400'>Tags</label>
              <input
                type="text"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                placeholder="Eg. meme, learning"
                className='text-light bg-transparent outline-none rounded-sm border-2 border-zinc-800 py-2 px-3 w-full mt-3 placeholder:text-zinc-600'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (selectedTag !== "") {
                      addTag(selectedTag);
                    }
                  }
                }}
              />
              <p onClick={addTag} className='rounded-full cursor-pointer px-3 py-1.5 bg-light text-dark my-3 font-semibold items-center gap-2 inline-flex'><Plus className='' /> Add Tag</p>

              <div className="tags flex flex-wrap gap-2 mb-8">
                {tags.map((tag, i) => (
                  <p key={i} className='px-3 py-1 rounded-full bg-zinc-700/30 gap-1 items-center flex'>{tag}<X onClick={removeTag.bind(this, tag)} className='w-5 h-5 hover:text-red-400 cursor-pointer fade-in-5 animate-in' /></p>
                ))}
              </div>
            </>
          )}


          <button disabled={loading || !src} className={`w-full px-2 py-2 bg-blue-500 hover:bg-blue-600 rounded-md flex items-center justify-center gap-4 ${loading || !src ? "cursor-default bg-gray-700" : ""}`} type="submit">
            {
              loading && <span className='h-6 w-6 rounded-full border-[3px] border-white border-b-transparent animate-spin' />
            }
            <span>Post</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
