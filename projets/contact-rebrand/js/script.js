document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        e.preventDefault();
        const focusedPlayer = document.activeElement.closest('custom-player');
        console.log(focusedPlayer)
        if (focusedPlayer) {
            focusedPlayer.togglePlayPause();
        }
    }
});

console.log("test")

// const video = document.querySelector('.js-header__video');

// // Track the scroll position
// window.addEventListener('scroll', () => {
//     // Get the distance from the top of the viewport to the top of the video
//     const videoTop = video.getBoundingClientRect().top;
//     console.log(videoTop)

//     // If the video is outside the viewport by at least 500px, decrease the volume
//     if (videoTop < -500 || videoTop > window.innerHeight) {
//         video.volume = 0.2; // Adjust the volume as needed
//     } else {
//         video.volume = 1; // Reset the volume
//     }
// });