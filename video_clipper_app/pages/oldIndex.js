import { useEffect, useState } from 'react';           //components?
import { useRouter } from 'next/router';    //nav
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";


const ffmpeg = createFFmpeg({
  log: true,
  corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js"
});  //creates ffmpeg instance

(async function () {
  await ffmpeg.load();  //loads ffmpeg
})();

function App() {
  const [selectedFile, setSelectedFile] = useState(null); //creates variable and leaves it empty (null)
  const [clipUrlsList, setClipUrls] = useState([]);
  const router = useRouter();                   //allows navigation?

  const handleFileChange = (e) => {             //function that stores the file
    setSelectedFile(e.target.files[0]);         //stores first file
  };
  // const handleArrayChange = (e) => {
  //   const newUrl= e; 
  //   setClipUrls([...prevUrls, newUrl]);
  // };

  const clipVideo = async () => {
    try {
      if (!ffmpeg.isLoaded()) await ffmpeg.load();  //if not loaded, loads ffmpeg

      const inputFile = await fetchFile(selectedFile);
      ffmpeg.FS('writeFile', 'input.mp4', inputFile);  //fetches video file as binary data 
      await ffmpeg.run(
        '-i', 'input.mp4', '-c', 'copy', '-map', '0', '-segment_time', '00:00:30', '-f', 'segment', '-reset_timestamps', '1', 'output%03d.mp4'
      );
      const clipUrlsArray = [];
      let i = 0;
      while(true) {
        try {
          const outputFileName = `output${String(i).padStart(3, '0')}.mp4`;
          const outputFile = ffmpeg.FS('readFile', outputFileName); //reads output file

          if (outputFile instanceof Uint8Array) {
            const blob = new Blob([outputFile], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            clipUrlsArray.push(url); // collects URLs for playback
            // handleArrayChange(url); //adds to main clips array
            setClipUrls([...prevUrls, url]);
            console.log(`Segment ${i} URL:`, url);
          }
          i++;
        } catch (e) {
          break; 
        }
      }
      if (clipUrlsArray.length==0) {
        console.log('No segments generated.');
      }
      // return clipUrlsArray;
    } catch (error) {
      console.error('Error clipping video:', error);
    }
  };


  const handleUpload = () => { //what to do with file
    if (selectedFile) {
      clipVideo();
      const fileUrl = URL.createObjectURL(selectedFile); //creates a url for the video
      // let clipUrlsList=clipVideo();
      if(clipUrlsList)
      {
      router.push({                                      //navigation
        pathname: 'clipsDisplay',                        //goes to clipsDisplay.js
        query: { uploadedVid : fileUrl,
                clipUrls : clipUrlsList
        },            //url is passed 
      });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
    {/* <link rel="stylesheet" href="../styles/style2.css"></link> */}

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">
          Video Clipper
        </h2>

        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-xl mb-6">Generate clips with a push of a button!</p>

          <div className="flex justify-center items-center">
            <div className="max-w-md w-full">
              <input 
                type="file" 
                id="file-1" 
                className="hidden" 
                accept="video/*"
                onChange={handleFileChange}
              />
              <label 
                htmlFor="file-1" 
                className="
                  cursor-pointer 
                  flex 
                  flex-col 
                  items-center 
                  justify-center 
                  border-2 
                  border-dashed 
                  border-gray-300 
                  p-6 
                  hover:border-blue-500 
                  transition
                "
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="160" 
                  height="160" 
                  fill="currentColor" 
                  className="bi bi-folder-plus text-gray-400"
                  viewBox="0 0 16 16"
                >
                  <path d="m.5 3 .04.87a2 2 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14H9v-1H2.826a1 1 0 0 1-.995-.91l-.637-7A1 1 0 0 1 2.19 4h11.62a1 1 0 0 1 .996 1.09L14.54 8h1.005l.256-2.819A2 2 0 0 0 13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2m5.672-1a1 1 0 0 1 .707.293L7.586 3H2.19q-.362.002-.683.12L1.5 2.98a1 1 0 0 1 1-.98z"/>
                  <path d="M13.5 9a.5.5 0 0 1 .5.5V11h1.5a.5.5 0 1 1 0 1H14v1.5a.5.5 0 1 1-1 0V12h-1.5a.5.5 0 0 1 0-1H13V9.5a.5.5 0 0 1 .5-.5"/>
                </svg>
              </label>

            </div>
          </div>
        </div>
        <br></br>
        <button onClick={handleUpload}>Upload and Clip Video</button>

      </div>

      <footer className="text-center py-4 bg-gray-200">
        <p className="text-sm text-gray-600">
          Created by the Sprintern Team 2025
        </p>
      </footer>


    </div>
  );
}

export default App;


//this helps with backend i think
export async function getServerSideProps(context) {
  context.res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  context.res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");

  return {
    props: {},
  };
}