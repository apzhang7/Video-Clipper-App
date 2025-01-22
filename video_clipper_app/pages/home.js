// import Head from "next/head";
// import Image from "next/image";
// import { Geist, Geist_Mono } from "next/font/google";

// import { Html, Head, Main, NextScript } from 'next/document'

// import Link from "next/link"
// export default function Home(){
//     return(
//         <>
//     {/* <head>
//         <link rel="stylesheet" href="styles.css">
//       </head> */}
      
//       <head>
//         <h1>Live</h1>
//         <h3>Video Clipper</h3>
//       </head>
      
//       <p>Please upload a downloaded video! Then click on the button down below to to clip the video.</p>
      
//       <body>
//         <form action="/action_page.php" enctype="multipart/form-data">
//           <p>Upload File</p>
//           <label for="myfile"></label>
//           <input type="file" id="videoFile" accept="video/*" />
//           <br/><br/><br/><br/><br/>
//           <button type="button">Video Inserted Page</button>
//         </form>
//             <script src="../static/jspractice.js"></script>
//       </body>
//       </>
//       );

// }
// import { Html, Head, Main, NextScript } from 'next/document'
// export default function Home() {
//   return (
//     <Html lang="en" className="scroll-smooth antialiased">
//       <Head>
//       <meta charset="utf-8"/>
//         <meta name="viewport" content="width=device-width, initial-scale=1"/>
        
//         <title>Practice Website</title>
        
//         <link rel="stylesheet" href="../static/style2.css"/>

//         <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"/>
//         <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        
//         <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"/>
//         <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
//         <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
        
//         <link href='https://fonts.googleapis.com/css?family=Source+Sans+Pro' rel='stylesheet' type='text/css/'>
//         {/* Performance Optimization: Preload Critical Resources */}
//         {/* <link 
//           rel="preload" 
//           href="/fonts/inter-var.woff2" 
//           as="font" 
//           type="font/woff2" 
//           crossOrigin="anonymous" 
//         /> */}
        
//         {/* Web App Manifest */}
//         {/* <link rel="manifest" href="/manifest.json" /> */}
        
//         {/* Favicon and Touch Icons */}
//         {/* <link rel="icon" href="/favicon.ico" />
//         <link 
//           rel="apple-touch-icon" 
//           sizes="180x180" 
//           href="/apple-touch-icon.png" 
//         /> */}
        
//         {/* Open Graph / Social Media Meta Tags */}
//         {/* <meta property="og:type" content="website" />
//         <meta property="og:title" content="Your Site Name" />
//         <meta 
//           property="og:description" 
//           content="Detailed site description" 
//         /> */}
        
//         {/* Additional Performance Optimizations */}
//         {/* <meta name="theme-color" content="#ffffff" /> */}

//       </Head>
//       <body>
//         {/* Optional: Add custom loading indicator or global wrapper */}
//         <h2 className="blue-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Video Clipper</h2>
    
//         <div className="background">

//         <div className="jumbotron text-center" style="margin-bottom:0">
//           <h1>Welcome!</h1>
//           <p>Generate clips with a push of a button!</p> 
//         </div>   
//         <br></br>

//         <div className="box">
//             <input type="file" name="file-1[]" id="file-1" className="inputfile inputfile-1" data-multiple-caption="{count} files selected" multiple style="display: none;" />
//             <label for="file-1"><svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" fill="currentColor" className="bi bi-folder-plus" viewBox="0 0 16 16">
//                     <path d="m.5 3 .04.87a2 2 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14H9v-1H2.826a1 1 0 0 1-.995-.91l-.637-7A1 1 0 0 1 2.19 4h11.62a1 1 0 0 1 .996 1.09L14.54 8h1.005l.256-2.819A2 2 0 0 0 13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2m5.672-1a1 1 0 0 1 .707.293L7.586 3H2.19q-.362.002-.683.12L1.5 2.98a1 1 0 0 1 1-.98z"/>
//                     <path d="M13.5 9a.5.5 0 0 1 .5.5V11h1.5a.5.5 0 1 1 0 1H14v1.5a.5.5 0 1 1-1 0V12h-1.5a.5.5 0 0 1 0-1H13V9.5a.5.5 0 0 1 .5-.5"/>
//                   </svg> <span style="display: flex; flex-direction: column; 
//             justify-content: flex-end;">Choose a video&hellip;</span></label>                
//         </div>
//         <br></br>
//     </div>
//         <footer>
//             <p>Created by the Sprintern LinkedIn Team 2025</p>
//         </footer>
        
//         <Main />
//         <NextScript />
        
//         {/* Optional: Add global scripts or third-party integrations */}
//         <script 
//           dangerouslySetInnerHTML={{
//             __html: `
//               // Example: Simple analytics or performance tracking
//               window.addEventListener('load', () => {
//                 console.log('Page fully loaded');
//               });
//             `
//           }} 
//         />
//       </body>
//     </Html>
//   )
// }
// function Home() {
//       return (
//           <head>
//         <meta charset="utf-8"></meta>
//         <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        
//         <title>Practice Website</title>
        
//         <link rel="stylesheet" href="../styles/style2.css"></link>

//         <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"></link>
//         <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        
//         <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"></link>
//         <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
//         <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
        
//         <link href='https://fonts.googleapis.com/css?family=Source+Sans+Pro' rel='stylesheet' type='text/css'> </link>

//     </head>

//     <h2 className="blue-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Video Clipper</h2>
    
//     <div className="background">

//     <div className="jumbotron text-center" style="margin-bottom:0">
//       <h1>Welcome!</h1>
//       <p>Generate clips with a push of a button!</p> 
//     </div>   
//     <br></br>

//     <div className="box">
//         <input type="file" name="file-1[]" id="file-1" className="inputfile inputfile-1" data-multiple-caption="{count} files selected" multiple style="display: none;" />
//         <label for="file-1"><svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" fill="currentColor" class="bi bi-folder-plus" viewBox="0 0 16 16">
//                 <path d="m.5 3 .04.87a2 2 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14H9v-1H2.826a1 1 0 0 1-.995-.91l-.637-7A1 1 0 0 1 2.19 4h11.62a1 1 0 0 1 .996 1.09L14.54 8h1.005l.256-2.819A2 2 0 0 0 13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2m5.672-1a1 1 0 0 1 .707.293L7.586 3H2.19q-.362.002-.683.12L1.5 2.98a1 1 0 0 1 1-.98z"/>
//                 <path d="M13.5 9a.5.5 0 0 1 .5.5V11h1.5a.5.5 0 1 1 0 1H14v1.5a.5.5 0 1 1-1 0V12h-1.5a.5.5 0 0 1 0-1H13V9.5a.5.5 0 0 1 .5-.5"/>
//               </svg> <span style="display: flex; flex-direction: column; 
//         justify-content: flex-end;">Choose a video&hellip;</span></label>                
//     </div>
    
//     <br></br>
//     </div>
//     <footer>
//         <p>Created by the Sprintern LinkedIn Team 2025</p>
//     </footer>


//       );
//     }
    // export default Home;

    'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from "@/styles/Home.module.css";


export default function Home() {
  const [videoFile, setVideoFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setVideoFile(file)
    }
  }

  return (
    <>
<link rel="stylesheet" href="../styles/style2.css"></link>


    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">
          Video Clipper
        </h2>

        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome!</h1>
          <p className="text-xl mb-6">Generate clips with a push of a button!</p>

          <div className="flex justify-center items-center">
            <div className="max-w-md w-full">
              <input 
                type="file" 
                id="file-1" 
                className="hidden" 
                accept="video/*"
                onChange={handleFileChange}
                multiple 
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
                <span className="mt-4 text-gray-600">
                  {videoFile 
                    ? `Selected: ${videoFile.name}` 
                    : 'Choose a video…'}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center py-4 bg-gray-200">
        <p className="text-sm text-gray-600">
          Created by the Sprintern Team 2025
        </p>
      </footer>
    </div>
    </>
  )
}