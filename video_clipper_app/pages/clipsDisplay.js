import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";




function App(){
  const ffmpeg = createFFmpeg({
    // log: true,
    corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js"
  });  //creates ffmpeg instance
  
  (async function () {
    await ffmpeg.load();  //loads ffmpeg
  })();
  
  const [ videoUrl , setVideoUrl ] = useState(null); //video
  const [ clipUrls, setClipUrls ] = useState([]); //clip count
  const clipCount = clipUrls.length;

  const router = useRouter();
  const { uploadedVid } = router.query; //uploaded vid take the uploadedVideoUrl passed over from index.js
  const [message, setMessage] = useState('');

  const ResetArray = () => {
    setClipUrls([]); //empty the array
  }
  useEffect(() => {

    console.log(JSON.stringify(sessionStorage.getItem('hasLoaded')));
    if ((typeof window !== 'undefined') && (router.pathname === '/clipsDisplay')) {
      //compares and if it is empty or false, set it as true
      const isFirstLoad = sessionStorage.getItem('hasLoaded') !== 'true';

      if (isFirstLoad) {
        sessionStorage.setItem('hasLoaded', 'true');
        console.log('Received video URL:', uploadedVid);
        ResetArray();
        console.log("I RESET THE ARRAY AND CLIP VIDEO");
        clipVideo();
      } else {
        console.log('RELOADING THE PAGE OR JUST GOING BACK TO INDEX');
        router.push('/');
      }
    }
    return () => {
      sessionStorage.removeItem('hasLoaded');
      console.log('SESSION DATA REMOVED');
    }
  }, [uploadedVid]);

  const clipVideo = async () => {
    try {
      if (!ffmpeg.isLoaded()) await ffmpeg.load();  //if not loaded, loads ffmpeg

      const inputFile = await fetchFile(uploadedVid);
      ffmpeg.FS('writeFile', 'input.mp4', inputFile);  //fetches video file as binary data 
      ffmpeg.run(
        '-i', 'input.mp4', '-c', 'copy', '-map', '0', '-segment_time', '00:00:30', '-f', 'segment', '-reset_timestamps', '1', 'output%03d.mp4'
      ).then(res => {
        ResetArray();
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
      })
      .catch(error => {
        // console.log("err", err);
      })

     
    } catch (error) {
      console.error('Error clipping video:', error);
    }
  };
  
  return (
    <main className="App">
          
        <div className="main">
          <h2>Welcome to Your Clips Library</h2>
          <br></br>
          <h3> Original Video: </h3>
          <video className="uploaded-video"controls src={uploadedVid}></video>
          <h3> Total Clips: {clipCount}</h3>
        </div>
      <div className='video-grid'>
        {clipUrls.length > 0 ? (    //if not empty array
          clipUrls.map((url, i) => ( //using map, output each video from array
            <div key={i}>
              <h3>Clip {i + 1}</h3> 
              <video controls src={url} />
              <button
                className="open-video-button"
                onClick={() => window.open(url, '_blak')}>
                Open Clip {i +1}
              </button>
            </div>
          ))
        ) : (
          <p>No Clips Available</p>
        )}
      </div>
      <footer>Created By: Amaya, Angela, Fiona, Tesneem, Yeni</footer>
    </main>
  );
}
export default App;

export async function getServerSideProps(context) {
  context.res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  context.res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");

  return {
    props: {},
  };
}