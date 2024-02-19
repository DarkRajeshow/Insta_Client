import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../assets/api';


const UploadStory = () => {

  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const [hoverVideo, setHoverVideo] = useState(false);

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
    setLoading(true);
    e.preventDefault();

    const formData = new FormData(e.target);

    const type = isImage ? "image" : "video";

    formData.set("type", type);

    try {
      if (formData.get("file")) {
        const { data } = await api.post("/api/uploadstory", formData);
        if (data.success) {
          setLoading(false);
          toast.success(data.status)
          navigate("/profile")
        }
        else {
          toast.error(data.status)
        }
        setLoading(false);
      }
      else {
        toast.error("File is not selected.")
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }


  return (
    <div className="w-full min-h-screen bg-zinc-900 text-white py-5">
      <div className="flex justify-between items-center px-4">
        <Link to="/profile" className="text-sm text-blue-500">
          <i className="ri-arrow-left-s-line"></i> profile
        </Link>
        <h2 className="leading-none text-sm">Upload Post</h2>
        <Link to="/feed" className="text-sm">
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
          className="w-full mt-4"
          onSubmit={submitPost}
          encType="multipart/form-data"
        >
          <input accept="image/*, video/*" hidden type="file" name="file" onChange={previewImage} />
          {src && (
            <textarea
              required
              className="px-2 py-1 w-full bg-zinc-900 border-2 h-20 border-zinc-800 resize-none rounded-md outline-none"
              placeholder="Write a caption..."
              name="caption"
            ></textarea>
          )}
          <button disabled={loading} className={`w-full px-2 py-2 bg-blue-500 rounded-md flex items-center justify-center gap-4 ${loading ? "cursor-default bg-gray-700" : ""}`} type="submit">
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

export default UploadStory;
