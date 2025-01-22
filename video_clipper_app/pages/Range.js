import { useState,  } from 'react';           //components?
import { useRouter } from 'next/router';    //nav
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

export default function Range({
    thumbNails,
    rEnd,
    rStart,
    handleUpdaterStart,
    handleUpdaterEnd,
    loading,
    control,
    videoMeta,
})
{
    const toTimeString = (sec, showMilliSeconds = true) => {
        sec = parseFloat(sec);
        let hours = Math.floor(sec / 3600); // get hours
        let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
        let seconds = sec - hours * 3600 - minutes * 60; //  get seconds
        // add 0 if value < 10; Example: 2 => 02
        if (hours < 10) {
          hours = "0" + hours;
        }
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        let maltissaRegex = /\..*$/; // matches the decimal point and the digits after it e.g if the number is 4.567 it matches .567
      
        let millisec = String(seconds).match(maltissaRegex);
        return (
          hours +
          ":" +
          minutes +
          ":" +
          String(seconds).replace(maltissaRegex, "") +
          (showMilliSeconds ? (millisec ? millisec[0] : ".000") : "")
        );
      };
    let RANGE_MAX = 100;
      // console.log(videoMeta);
      // console.log(rStart);
      // console.log(rEnd);
    if (thumbNails.length === 0 && !loading) {
      return null;
    } 
    if (loading) {
        return (
          <center>
            <h2> Processing thumbnails.....</h2>
          </center>
        );
      }
      console.log("END AGAIN: ",rEnd);
      return (
        <>
          <div className="range_pack">
            <div className="image_box">
              {thumbNails.map((imgURL, id) => (
                <img src={imgURL} alt={`sample_video_thumbnail_${id}`} key={id} />
              ))} 
    
              <div
                className="clip_box"
                style={{
                  width: `calc(${rEnd - rStart}% )`,
                  left: `${rStart}%`,
                }}
                data-start={toTimeString(
                  (rStart / RANGE_MAX) * videoMeta.duration,
                  false
                )}
                data-end={toTimeString(
                  (rEnd / RANGE_MAX) * videoMeta.duration,
                  false
                )}
              >
                <span className="clip_box_des"></span>
                <span className="clip_box_des"></span>
              </div>
    
              <input
                className="range"
                type="range"
                min={0}
                max={RANGE_MAX}
                onInput={handleUpdaterStart}
                value={rStart}
              />
              <input
                className="range"
                type="range"
                min={0}
                max={RANGE_MAX}
                onInput={handleUpdaterEnd}
                value={rEnd}
              />
            </div>
          </div>
    
          {control}
        </>
      );
    }
