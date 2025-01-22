"use client"
import { useState, useEffect, useRef } from 'react';           //components?
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import Range from './Range'

const ffmpeg = createFFmpeg({
  corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js"
});  //creates ffmpeg instance

function App() {

  const ffmpeg = createFFmpeg({
    corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js"
  });  //creates ffmpeg instance

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
  const [videoName, setVideoName] = useState(null);
  const [videoMeta, setVideoMeta] = useState(null);

  const [ clipUrls, setClipUrls ] = useState([]); //for clippped vid
  const [clipDurations, setClipDurations ] = useState([]); //clip durations
  const clipCount = clipUrls.length;
  const [duration, setDuration] = useState(null);
  
  const [ trimUrl, setTrimUrl ] = useState(null); //for trimmed vid
  const [ startTimeMin, setStartTimeMin ] = useState(0);
  const [ startTimeSec, setStartTimeSec ] = useState(0);
  const [ endTimeMin, setEndTimeMin ] = useState(0);
  const [ endTimeSec, setEndTimeSec ] = useState(0);
  const [ trimError, setTrimError ] = useState(''); //error message when start = end
  
  const [trimIsProcessing, setTrimIsProcessing] = useState(false); //for slidder trimming
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(10);
  const [thumbNails, setThumbNails] = useState([]);
  const [thumbnailIsProcessing, setThumbnailIsProcessing] = useState(false);
  
  const [showClips, setShowClips] = useState(false); //for handing pages with if statements later
  const [showCut, setShowCut] = useState(false);
  const [showTrim, setShowTrim] = useState(false);
  const videoRef = useRef(null);
  

  //set file for upload
  const handleFileChange = (e) => {             //function that stores the file
    setSelectedFile(e.target.files[0]);         //stores first file
  };
  
  //trimming input
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

  //page showing handling
  const handleShowClips = () => {             //function that stores the file
    setShowClips(true);         //stores first file
  };
  const handleShowCut = () => {             //function that stores the file
    setShowCut(true);         //stores first file
  };
  const handleShowTrim = () => {             //function that stores the file
    setShowTrim(true);         //stores first file
  };
  const handleReturn = () => {
    setShowClips(false);
    setShowTrim(false);
    setThumbNails([]);
    setShowCut(false);
    setSelectedFile(null);
    setClipUrls([]);
    setClipDurations([]);
    setTrimUrl(null);
    setTrimError('');
    setStartTimeMin(0);
    setStartTimeSec(0);
    setEndTimeMin(0);
    setEndTimeSec(0);
  };

  const handleClipVideo = () => { //what to do with file when its clipped
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
      setSelectedFile(fileUrl);
      handleShowClips();
    }
  };

  const handleCutVideo = () => { //what to do with file
    if (selectedFile) {
      setSaveFile(selectedFile);
      const fileUrl = URL.createObjectURL(selectedFile); //creates a url for the video
      setSelectedFile(fileUrl);
      handleShowCut();
    }
  };

  const handleTrimVideo = () => {
    window.URL = window.URL || window.webkitURL;
    if (selectedFile) {
      setSaveFile(selectedFile);
      const fileUrl = URL.createObjectURL(selectedFile); //creates a url for the video
      const vid = document.createElement('video');
      vid.src = fileUrl;
      setSelectedFile(fileUrl);
      vid.addEventListener('loadedmetadata', async () => {
        console.log(`Duration: ${vid.duration.toFixed(2)}s`); //tests duration
      });
      handleShowTrim();
    }
  }

  const handleMetaData = async (e) => {
    const video = e.target;
    const meta = {
      name: saveFile.name,
      duration: video.duration,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight
    };
    setDuration(meta.duration);
    setVideoName(meta.name);
    setVideoMeta(meta);
  };
  const handleMetaDataTrim = async (e) => {
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
    const arrayOfImageURIs = [];
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

  const trimVideo = async () => {
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
    let offset = ((trimEnd / 100) * videoMeta.duration).toFixed(2);
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

  const cutVideo = async () => {
    try {
      const startTimeTotal = startTimeMin * 60 + startTimeSec;
      const endTimeTotal = endTimeMin * 60 + endTimeSec;
      const lengthOfVid = endTimeTotal - startTimeTotal;
      
      if (startTimeTotal === endTimeTotal) { //if they are equal or start is bigger
        setTrimError('Cannot clip. Start Time and End Time are the same, please change your input.');
        setTrimUrl('');
        return; //leaves before rest of the code is used
      }
      else if (endTimeTotal < startTimeTotal){
        setTrimError('Cannot clip. End Time is before Start Time, please change your input.');
        setTrimUrl('');
        return; //leaves before rest of the code is used
      }
      else if (endTimeTotal > duration || startTimeTotal > duration){
        setTrimError('Cannot clip. Start Time or End Time is too large for the video, please change your input.');
        setTrimUrl('');
        return; //leaves before rest of the code is used
      }
      else if (lengthOfVid <6){
        setTrimError('Cannot clip. Clip length is too small, please change your input.');
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
      setTrimError('Something happened while trimming the video.');
    }
  }

  if(!showClips && !showTrim && !showCut) //UPLOAD VIDEO PAGE
  {
    return (    
        <div className="body">
  
        <div className="home-page">
          <div className="header" id="logo">
          <h1>&nbsp;&nbsp;&nbsp;Live</h1> <h2 className="title1">Video Clipper</h2>
          </div>
  
          <div className="home-section">
            <br/>
            <h4 className='welcome'>Welcome!</h4>
            <br/>
            <div className="upload-box">
            <p>Choose a Video</p>
              <input type="file" id="file-1" accept="video/*" display="block" className="file-button" style={{ display: 'none' }} onChange={handleFileChange} />
                
                <label htmlFor="file-1" className="label">
                  <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="currentColor" className="folder-icon" viewBox="0 0 16 16">
                    <path d="m.5 3 .04.87a2 2 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14H9v-1H2.826a1 1 0 0 1-.995-.91l-.637-7A1 1 0 0 1 2.19 4h11.62a1 1 0 0 1 .996 1.09L14.54 8h1.005l.256-2.819A2 2 0 0 0 13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2m5.672-1a1 1 0 0 1 .707.293L7.586 3H2.19q-.362.002-.683.12L1.5 2.98a1 1 0 0 1 1-.98z"/>
                    <path d="M13.5 9a.5.5 0 0 1 .5.5V11h1.5a.5.5 0 1 1 0 1H14v1.5a.5.5 0 1 1-1 0V12h-1.5a.5.5 0 0 1 0-1H13V9.5a.5.5 0 0 1 .5-.5"/>
                  </svg>
        
                </label>

                {selectedFile ? (<p>Selected File: {selectedFile.name}</p>) : (<p>No File Selected</p>)}
            </div>
          </div>
          <br></br>
  
          <button onClick={handleClipVideo}>Clip Video</button>
          <button onClick={handleTrimVideo}>Trim Video</button>
          <button onClick={handleCutVideo}>Cut Video</button>
          <br/>
          <br/>
      
        </div>
  
        <footer><p>Created By: Amaya, Angela, Fiona, Tesneem, Yeni</p></footer>

      </div>);
  }
  else if(showClips){ //CLIPS DISPLAY PAGE
    return(
     <main className="App">
         <div className="body">
         <div className="header" id="logo">
          <h1>&nbsp;&nbsp;&nbsp;Live</h1> <h2 className="title1">Video Clipper</h2>
          <button onClick={handleReturn} className="return-button">Back</button>
          </div>
         
      <div className="main">
        <div id="section">
          <h4>Clip Video</h4>
        </div>
        <div className="original-video-box">
        <video id="myVideo" preload="metadata" className="uploaded-video"controls src={selectedFile} onLoadedMetadata={handleMetaData}></video>
        </div>
      <br></br>
        <div className='video-list-container'>
    <div className='video-list'>
      <h3 className='total-clips'> Total Clips: {clipCount}</h3>
      {clipUrls.length > 0 ? (    //if not empty array
        clipUrls.map((url, i) => ( //using map, output each video from array
          <div key={i} className='clip-card'>
            <div className='clip-thumbnail'>
              <video controls src={url} />
            </div>
            <div className='clip-info'>
              <h5>Clip {i + 1}</h5>
            </div>
            <button
              className="open-video-button"
              onClick={() => window.open(url, '_blank')}>
              Open Clip {i + 1}
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
  </div>

      </div>
      <br></br>
      <footer><p>Created By: Amaya, Angela, Fiona, Tesneem, Yeni</p></footer>
        </div>
      
  </main>
    );
  }
  else if(showCut){ //CUTTING TRIM PAGE
    return (
      <div className="App">
        <div className="body">

        <header className="header" id="logo">
          <h1>&nbsp;&nbsp;&nbsp;Live</h1> <h2 className="title1">Video Clipper</h2>
          <button onClick={handleReturn} className="return-button">Back</button>
          </header>
        
        <div className="main">
          <div id="section">
            <h4>Cut Video</h4>
          </div>

          <div className="container">

          <div className="item-1">
          <h2 className="original-video-tag">Original Video:</h2>
          <div className="original-video-box">
            <video className="uploaded-video"controls src={selectedFile} onLoadedMetadata={handleMetaData} ></video>
          </div>
          </div>

          <div className="item-2">

          {trimUrl && !trimError && ( //if trimUrl exists and trimError doesn't
          <div className="trimmed-video-container">
            <h2 className="trimmed-tag">Trimmed Video:</h2>
            <div className="trimmed-video-box">
            <video className='uploaded-video' controls src={trimUrl}></video>
            </div>            
          </div>
        )}

          </div>

          </div>


          <br></br>
          <div className='trimTime'>
            <br></br>
          <div className="trim-inputs-box">
          <span className='minuteSec'>
            <label htmlFor='startTime'>Start time: </label>
            <input type="number" id="startTimeMin" value={startTimeMin || ''} onChange={handleStartMin} min="0" placeholder="min"/> 
            <span> : </span>
            <input type="number" id="startTimeSec" value={startTimeSec || ''} onChange={handleStartSec} min="0" max="59" placeholder="sec"/> <br></br>
          </span>
          <span className='minuteSec'>
            <label htmlFor="endTime">End time: </label>
            <input type="number" id="startTimeMin" value={endTimeMin || ''} onChange={handleEndMin} min="0" placeholder="min"/> 
            <span> : </span>
            <input type="number" id="startTimeSec" value={endTimeSec || ''} onChange={handleEndSec} min="0" max="59" placeholder="sec"/>
          </span>
          </div>
          <br></br>
          <button onClick={cutVideo}>Cut Video</button>
        {trimError && 
        <div>
        <br></br>
        <p className="error-message">{trimError}</p>
        </div>
        } 
        {/* if exists show error message */}
        </div>

        <br></br>

        
        <br></br>
        </div>
       
        <footer><p>Created By: Amaya, Angela, Fiona, Tesneem, Yeni</p></footer>
        </div>
      </div>
    );
  }
  else if(showTrim){ // trimming SLIDER
    return (
      <div className="App">

      <div className="body">

        <header className="header" id="logo">
          <h1>&nbsp;&nbsp;&nbsp;Live</h1> <h2 className="title1">Video Clipper</h2>
          <button onClick={handleReturn} className="return-button">Back</button>
        </header>
        
        <div className="main">
          <div id="section">
            <h4>Trim Video</h4>
          </div>

          <div className="container">

          <div className="item-1">

          <h2 className="original-video-tag">Original Video:</h2>

          <div className="original-video-box">
            <video
            className='uploaded-video' ref={videoRef} src={selectedFile} controls onLoadedMetadata={handleMetaDataTrim} onTimeUpdate={handleTimeUpdate}/>
          </div>

          </div>

          <div className="item-2">

            {trimUrl && ( //if trimUrl exists and trimError doesn't
              <div className="trimmed-video-container">
                <h2 className="trimmed-tag">Trimmed Video:</h2>
                <div className="trimmed-video-box">
                <video className='uploaded-video' controls src={trimUrl}></video>
                </div>            
              </div>
            )}

          </div>

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
                    onClick={trimVideo}
                    disabled={trimIsProcessing}
                  >
                    {trimIsProcessing ? "Trimming..." : "Trim Video"}
                  </button>
                  <br/>
                  <br/>
                </div>
              }
              thumbNails={thumbNails}
              onChange={handleRangeChange}  //updating video pos immediately
            />
            {/* {trimUrl ? (<video className="uploaded-video"controls src={trimUrl} ></video>): (<p></p>)
            } */}

        </div>

      <footer><p>Created By: Amaya, Angela, Fiona, Tesneem, Yeni</p></footer>

      </div>

      </div>
    )
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