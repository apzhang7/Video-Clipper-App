"use client"
import { useState, useEffect, useRef } from 'react';           //components?
import { useRouter } from 'next/router';    //nav
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import Range from './Range'
const ffmpeg = createFFmpeg({
  // log: true,
  corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js"
});  //creates ffmpeg instance

function App() {
  // (async function () {
  //   await ffmpeg.load();  //loads ffmpeg
  // })();
  useEffect(() => {
    const loadFFmpeg = async () => {
      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
      }
    };
    loadFFmpeg();
  }, []);
  const [selectedFile, setSelectedFile] = useState(null); //creates variable and leaves it empty (null)
  const [saveFile, setSaveFile] = useState(null);
  const router = useRouter();                   //allows navigation?
  const [ clipUrls, setClipUrls ] = useState([]); //clip count
  const [clipDurations, setClipDurations ] = useState([]); //clip durations
  const clipCount = clipUrls.length;
  const [ trimUrl, setTrimUrl ] = useState(null); //for trimmed vid
  const [ startTimeMin, setStartTimeMin ] = useState(0);
  const [ startTimeSec, setStartTimeSec ] = useState(0);
  const [ endTimeMin, setEndTimeMin ] = useState(0);
  const [ endTimeSec, setEndTimeSec ] = useState(0);
  const [ trimError, setTrimError ] = useState(''); //error message when start = end
  const [videoName, setVideoName] = useState(null);
  const [videoMeta, setVideoMeta] = useState(null);
  const [duration, setDuration] = useState(null);
  const [showClips, setShowClips] = useState(false);
  const [showTrim, setShowTrim] = useState(false);
  const [trimIsProcessing, setTrimIsProcessing] = useState(false);
  const [trimStart, setTrimStart] = useState(0);
    const [trimEnd, setTrimEnd] = useState(10);
    const [thumbNails, setThumbNails] = useState([]);
    const [thumbnailIsProcessing, setThumbnailIsProcessing] = useState(false);
    const videoRef = useRef(null);
  const handleFileChange = (e) => {             //function that stores the file
    setSelectedFile(e.target.files[0]);         //stores first file
  };
  const handleStartMin = (e) => {             //function that stores the start minute
    setStartTimeMin(parseInt(e.target.value) || 0);      //the value or 0 if not there
  };
  const handleStartSec = (e) => {             //function that stores the start second
    setStartTimeSec(parseInt(e.target.value) || 0);      
  };
  const handleEndMin = (e) => {             //function that stores the end minute
    setEndTimeMin(parseInt(e.target.value) || 0);      
  };
  const handleEndSec = (e) => {             //function that stores the end second
    setEndTimeSec(parseInt(e.target.value) || 0);      
  };

  const handleShowClips = () => {             //function that stores the file
    setShowClips(true);         //stores first file
  };
  const handleShowTrim = () => {             //function that stores the file
    setShowTrim(true);         //stores first file
  };
  const handleReturn = () => {
    setShowClips(false);
    setShowTrim(false);
    setSelectedFile(null);
    setSaveFile(null);
    setClipUrls([]);
    setClipDurations([]);
    setTrimUrl(null);
    setTrimError('');
  };

  const handleUpload = () => { //what to do with file
    window.URL = window.URL || window.webkitURL;
    if (selectedFile) {
      setSaveFile(selectedFile);
      const fileUrl = URL.createObjectURL(selectedFile); //creates a url for the video
      const video = document.createElement('video');
      video.src = fileUrl;
      setSelectedFile(fileUrl);
      video.addEventListener('loadedmetadata', () => {
        console.log(`Duration: ${video.duration.toFixed(2)}s`); //tests duration
        clipVideo(video.duration);  //passes duration
      });
      handleShowClips();
    }
  };

  const handleTrimVideo = () => { //what to do with file
    window.URL = window.URL || window.webkitURL;
    if (selectedFile) {
      setSaveFile(selectedFile);
      const fileUrl = URL.createObjectURL(selectedFile); //creates a url for the video
      const vid = document.createElement('video');
      vid.src = fileUrl;
      setSelectedFile(fileUrl);
      vid.addEventListener('loadedmetadata', async () => {
        console.log(`Duration: ${vid.duration.toFixed(2)}s`); //tests duration
        // const thumbNails = await getThumbnails(meta);
        // setThumbNails(thumbNails);
      });
      // if(vid.duration<30)
      // {
      //   setTrimEnd(vid.duration);
      // }
      handleShowTrim();
    }
  };

  const handleMetaData = async (e) => {
    const video = e.target;
    const meta = {
      name: saveFile.name,
      duration: video.duration,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight
    };
    console.log({ meta })
    setDuration(meta.duration);
    setVideoName(meta.name);
    const thumbNails = await getThumbnails(meta);
    setVideoMeta(meta);
  };
  
       const getThumbnails = async ({ duration }) => {
          if (!ffmpeg.isLoaded()) await ffmpeg.load();
          setThumbnailIsProcessing(true);
          let MAX_NUMBER_OF_IMAGES = 15;
          let NUMBER_OF_IMAGES = duration < MAX_NUMBER_OF_IMAGES ? duration : 15;
          let offset =
          duration === MAX_NUMBER_OF_IMAGES ? 1 : duration / NUMBER_OF_IMAGES;
      // console.log(duration);
          const arrayOfImageURIs = [];
          // console.log("FILE: ", selectedFile);
          const inputFile = await fetchFile(selectedFile);
          ffmpeg.FS('writeFile', 'input.mp4', inputFile);  //fetches video file as binary data 
      
          for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
            let startTimeInSecs = convertToString(Math.round(i * offset));
      
            try {
              await ffmpeg.run(
                "-ss",
                startTimeInSecs,
                "-i",
               "input.mp4",
                "-t",
                "00:00:1.000",
                "-vf",
                `scale=150:-1`,
                `img${i}.png`
              );
              const data = ffmpeg.FS("readFile", `img${i}.png`);
      
              let blob = new Blob([data.buffer], { type: "image/png" });
              const url = URL.createObjectURL(blob);
              // console.log("hi", dataURI);
              ffmpeg.FS("unlink", `img${i}.png`);
              arrayOfImageURIs.push(url);
              setThumbNails((prevUrls) => [...prevUrls, url]);
            } catch (error) {
              console.log({ message: error });
            }
          }
          setThumbnailIsProcessing(false);
      
          return arrayOfImageURIs;
        };
             const newTrimVideo = async () => {
                setTrimIsProcessing(true);
                if (!ffmpeg.isLoaded()) await ffmpeg.load();
                let startTime = ((trimStart / 100) * videoMeta.duration).toFixed(2);
                let offset = ((trimEnd / 100) * videoMeta.duration - startTime).toFixed(2);
                console.log("ENDTRIM:", trimEnd);
                console.log(
                  startTime,
                  offset,
                  convertToString(startTime),
                convertToString(offset)
                );
            
                try {
                  // ffmpeg.FS("writeFile", 'input.mp4', await fetchFile(selectedFile));
                  const inputFile = await fetchFile(selectedFile);
                  ffmpeg.FS('writeFile', 'input.mp4', inputFile);  //fetches video file as binary data 
                  await ffmpeg.run(
                    "-ss",
                  convertToString(startTime),
                    "-i",
                   'input.mp4',
                    "-t",
                  convertToString(offset),
                    "-c",
                    "copy",
                    "output.mp4"
                  );
            
                  const outputFile = ffmpeg.FS("readFile", "output.mp4");
                  if (outputFile instanceof Uint8Array) {
                    const blob = new Blob([outputFile], { type: 'video/mp4' });
                    ffmpeg.FS("unlink", `output.mp4`);
                    const url = URL.createObjectURL(blob);
                  
                  setTrimUrl(url);
               } } catch (error) {
                  console.log(error);
                } finally {
                  setTrimIsProcessing(false);
                }
              };
            
              const handleUpdateRange = (func) => {
                return ({ target: { value } }) => {
                  func(value);
                };
              };
                useEffect(() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime =  ((trimStart / 100) * videoMeta.duration).toFixed(2);; // get start time for video 
                  }
                }, [trimStart]); 
                const handleTimeUpdate = () => {
                  let offset = ((trimEnd / 100) * videoMeta.duration - trimStart).toFixed(2);
                  if (videoRef.current.currentTime >= offset) {
                    console.log("END:", offset);
                    videoRef.current.pause(); // pause vid when reach trimEnd
                  }
                };
                const handleRangeChange = (start, end) => {
                  setTrimStart(start);
                  setTrimEnd(end);

                  if (videoRef.current) {
                    videoRef.current.currentTime = start; // update pos of video immediately
                  }
                };
  function convertToString(startTime)
  {
    const hours = Math.floor(startTime / 3600);
    const minutes = Math.floor((startTime % 3600) / 60);
    const remainingSeconds = startTime % 60;
  
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  const clipVideo = async (videoDuration) => {
    console.log("I RESET THE ARRAY")
    try {
      if (!ffmpeg.isLoaded()) await ffmpeg.load();  //if not loaded, loads ffmpeg

      const inputFile = await fetchFile(selectedFile);
      console.log(selectedFile);
      ffmpeg.FS('writeFile', 'input.mp4', inputFile);  //fetches video file as binary data 
      //if the floor(duration-starttime)= 30 then instead of duration = 30 s
      // should be the duration-startime or just the remainder of the clip
  
      let loopCount = Math.ceil(videoDuration/30); //div by 30 for total # of loops
      const clipUrlsArray = [];
      const clipDurations = []; //storing clip durations
      let startTime = 0;

      for(let i = 0; i<loopCount;i++)
      {
        let diff = Math.floor(videoDuration-startTime); //if diff is within 30 sec
        if (diff!=30){
        let startTimeInString = convertToString(startTime);
       await ffmpeg.run(  //run ffmpeg
          '-ss', startTimeInString, //start time 
          '-i', 'input.mp4', //input file
          '-t', '00:00:30',  //duration for 30 s
          '-c', 'copy',  //prevents reencoding
          `output${String(i).padStart(3, '0')}.mp4`  //output file
        );
        startTime=startTime+30; //increment by 30 seconds
        clipDurations.push(30); //stores duration of clip
        }
        else if(diff == 30){ //just get the remainder of the clip if within 30 sec
          let startTimeInString = convertToString(startTime);
          await ffmpeg.run(  //run ffmpeg
             '-ss', startTimeInString, //start time
             '-i', 'input.mp4', //input file
             '-c', 'copy',  //prevents reencoding
             `output${String(i).padStart(3, '0')}.mp4`  //output file
           );
           clipDurations.push(diff); //stores last clips duration
           break; //this was the last clip, break from for loop
        }
      }
      let i = 0;
        while(true) {
          try {
            const outputFileName = `output${String(i).padStart(3, '0')}.mp4`;
            const outputFile = ffmpeg.FS('readFile', outputFileName); //reads output file
  
            if (outputFile instanceof Uint8Array) {
              const blob = new Blob([outputFile], { type: 'video/mp4' });
              ffmpeg.FS("unlink", `output${String(i).padStart(3, '0')}.mp4`);
              const url = URL.createObjectURL(blob);
              clipUrlsArray.push(url); // collects URLs for playback
              setClipUrls((prevUrls) => [...prevUrls, url]); //so it updates the clipUrls in real time
              // console.log(`Segment ${i} URL:`, url);
            }
            i++;
          } catch (e) {
            break; 
          }
        }
        if (clipUrlsArray.length==0) {
          console.log('No segments generated.');
        }

        setClipDurations(clipDurations);
        console.log('Clip Durations:', clipDurations);
     
    } catch (error) {
      console.error('Error clipping video:', error);
    }
  };

  const trimVideo = async () => {
    try {
      const startTimeTotal = startTimeMin * 60 + startTimeSec;
      const endTimeTotal = endTimeMin * 60 + endTimeSec;
      const lengthOfVid = endTimeTotal - startTimeTotal;
      
      if (startTimeTotal === endTimeTotal) { //if they are equal or start is bigger
        setTrimError('Cannot clip. Start Time and End Time are the same, please change.');
        setTrimUrl('');
        return; //leaves before rest of the code is used
      }
      else if (endTimeTotal < startTimeTotal){
        setTrimError('Cannot clip. End Time is before Start Time, please change.');
        setTrimUrl('');
        return; //leaves before rest of the code is used
      }
      else if (endTimeTotal > duration || startTimeTotal > duration){
        setTrimError('Cannot clip. Start Time or End Time is too large for the video, please change.');
        setTrimUrl('');
        return; //leaves before rest of the code is used
      }
      else if (lengthOfVid < 4){
        setTrimError('Cannot clip. Clip length is too small, please change.');
        setTrimUrl('');
        return; //leaves before rest of the code is used
      }
      setTrimError('');
      
      if (!ffmpeg.isLoaded()) await ffmpeg.load();  //if not loaded, loads ffmpeg

      const inputFile = await fetchFile(selectedFile);
      ffmpeg.FS('writeFile', 'input.mp4', inputFile);

      await ffmpeg.run('-i', 'input.mp4', '-ss', `${startTimeTotal}`, '-to', `${endTimeTotal}`, '-c:v','copy','-c:a','copy','output.mp4')

      const outputFile = ffmpeg.FS('readFile', 'output.mp4');  //reads output file

      if (outputFile instanceof Uint8Array) {
        const blob = new Blob([outputFile], { type: 'video/mp4' }); //make blob
        const url = URL.createObjectURL(blob);  //make url for blob
        setTrimUrl(url);
        console.log('Trimmed video URL:', url);
      } else {
        throw new Error('is not a Uint8Array');
      }
    } catch (error) {
      console.error('Error trimming the video:', error);
      setTrimError('something happened while trimming the video');
    }
  }

  if(!showClips && !showTrim) //UPLOAD VIDEO PAGE
  {
    return (    <div className="min-h-screen bg-gray-100">
  
        <div className="container mx-auto px-4 py-8">
          <div id="logo">
          <h1>Live </h1>
          <h2 className="text-2xl font-bold text-blue-600 mb-6">
            Video Clipper
          </h2>
          </div>
  
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <br/>
            <p className="text-xl mb-6">Please upload a video. <br/> To generate 30 second clips, press the "Clip Video" button. <br/> To trim the video, press the "Trim Video" button.</p>
  
            <div className="flex justify-center items-center">
              <div className="max-w-md w-full" id="upload">
                <br/>
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
                  <br/>
                  <input 
                  type="file" 
                  id="file-1" 
                  className="hidden" 
                  accept="video/*"
                  display="block"
                  onChange={handleFileChange}
                />
                <br/>
                <br/>
                </label>
  
              </div>
            </div>
          </div>
          <br></br>
          <button onClick={handleUpload}>Clip Video</button>
          <button onClick={handleTrimVideo}>Trim Video</button>
        </div>
  
        <footer className="text-center py-4 bg-gray-200">
          <p className="text-sm text-gray-600">
            Created by the Sprintern Team 2025
          </p>
        </footer>

      </div>);
  }
  else if(showClips){ //CLIPS DISPLAY PAGE
    return(
      <main className="App">
      <button onClick={handleReturn} className="return-button">Return to Upload Page</button>
      <div className="main">
        <div id="section">
          <h4>Welcome to Your Clips Library</h4>
        </div>
        <br></br>
        <video id="myVideo" preload="metadata" className="uploaded-video"controls src={selectedFile} onLoadedMetadata={handleMetaData}></video>
        <h3> Duration: {duration} </h3>
      </div>
    
    <div className='video-list'>
      <h3 className='total-clips'> Total Clips: {clipCount}</h3>
      {clipUrls.length > 0 ? (    //if not empty array
        clipUrls.map((url, i) => ( //using map, output each video from array
          <div key={i} className='clip-card'>
            <div className='clip-thumbnail'>
              <video controls src={url} />
            </div>
            <div className='clip-info'>
              <h4>Clip {i + 1}</h4>
              <p>Duration: {clipDurations[i]} seconds</p>
            </div>
            <button
              className="open-video-button"
              onClick={() => window.open(url, '_blank')}>
              Open Clip {i +1}
            </button>
          </div>
        ))
      ) : (
        <>
        {/* <div className='video-grid'>
        <div className='centerSpinner'>
        <div className="loader">
        <div className='centerSpinner'>
          <p>Loading Clips...</p></div>
          </div>
        </div>
        </div> */}
        <div className="loader"></div>
        </>
      )}
      {/* </ul> */}
    </div>
    <footer>Created By: Amaya, Angela, Fiona, Tesneem, Yeni</footer>
  </main>
    );
  }
  else if(showTrim){ //TRIMMING PAGE
    return (
      <div className="App">
        <button onClick={handleReturn} className="return-button">Return to Upload Page</button>
        <div className="main">
          <div id="section">
            <h4>Welcome to Your Trimming Library</h4>
          </div>
          <br></br>
          <h3> Original Video: {videoName}</h3>
          {/* <video className="uploaded-video"controls src={selectedFile} onLoadedMetadata={handleMetaData} ></video> */}
          <video
          className='uploaded-video' ref={videoRef} src={selectedFile} controls onLoadedMetadata={handleMetaData} onTimeUpdate={handleTimeUpdate}/>
          <h3> Duration: {duration} </h3>
        </div>
              <Range
                rEnd={trimEnd}
                rStart={trimStart}
                handleUpdaterStart={handleUpdateRange(setTrimStart)}
                handleUpdaterEnd={handleUpdateRange(setTrimEnd)}
                loading={thumbnailIsProcessing}
                videoMeta={videoMeta}
                control={
                  <div className="u-center">
                    <button
                      onClick={newTrimVideo}
                      className="btn btn_b"
                      disabled={trimIsProcessing}
                    >
                      {trimIsProcessing ? "trimming..." : "trim selected"}
                    </button>
                  </div>
                }
                thumbNails={thumbNails}
                onChange={handleRangeChange}  //updating video pos immediately
              />
              {trimUrl ? (<video className="uploaded-video"controls src={trimUrl} ></video>): (<p></p>)
              }
           

      </div>
    );
  }
}

export default App;

// /this helps with backend i think for the SharedArrayBuffer
export async function getServerSideProps(context) {
  context.res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  context.res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");

  return {
    props: {},
  };
}