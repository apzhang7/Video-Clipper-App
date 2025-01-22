//play pause button (unnecessary will change later)
// var firstVideo = document.getElementById("video1"); 
// function playPause() { 
//   if (firstVideo.paused) 
//     firstVideo.play(); 
//   else 
//     firstVideo.pause(); 
// } 

// go to trim page, should have another functionality but is just default travel rn
function trimPage() {
    window.location.href = "trim.html";
};

// code for clip number and also an array for clips
document.addEventListener('DOMContentLoaded', function() { //loads things first before continuing
    const videoFiles = [ //array
        { src: '../static/testvideo/dog.mp4'},
        { src: '../static/testvideo/cats.mp4'},
        // add more video clips here
        // this needs to be the outputted clips after it gets trimmed but that should be supplied somehow by tesneem's code
    ];

    const videoGrid = document.getElementById('videoGrid');
    const clipCount = document.getElementById('clipCount'); 

    videoFiles.forEach((file, index) => { //loop for each file
        const videoContainer = document.createElement('div');
        videoContainer.className = 'video-container'; //creates one every time

        const video = document.createElement('video');
        video.id = `video${index + 1}`; // give id a number and also increment increment

        video.controls = true; //give controls
        video.autoplay = true; //allow autoplay
        video.muted = true; //tells it to mute

        const source = document.createElement('source');
        source.src = file.src; 
        source.type = 'video/mp4'; //type

        video.appendChild(source);

        const videoName = document.createElement('p');
        videoName.className = 'clip-name'; //gives class for styling
        videoName.textContent = `Clip ${index + 1}`; //make label for clips

        //creates open button
        const openMeButton = document.createElement('button');
        openMeButton.className = 'open-video-button';
        openMeButton.textContent = `Open Clip ${index + 1}`;
        openMeButton.addEventListener('click', function() {
          window.open(file.src, '_self');
        });

        videoContainer.appendChild(video);
        videoContainer.appendChild(videoName);
        videoContainer.appendChild(openMeButton);
        videoGrid.appendChild(videoContainer); 
        //adds it all to the page

    });

    clipCount.textContent = `Total Clips: ${videoFiles.length}`;
});