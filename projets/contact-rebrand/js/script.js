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

const video = document.querySelector('.js-header__video');

window.addEventListener('scroll', () => {
    // Get the video's position relative to the viewport
    const videoRect = video.getBoundingClientRect();
    const videoTop = videoRect.top;
    const videoHeight = videoRect.height;
    
    // Calculate the center of the video in relation to the viewport
    const videoCenter = videoTop + videoHeight / 2;
    const viewportCenter = window.innerHeight / 2;

    // Determine the maximum distance for volume adjustment (e.g., half the viewport height)
    const maxDistance = window.innerHeight / 2;

    // Calculate the distance of the video's center from the viewport's center
    const distanceFromCenter = Math.abs(videoCenter - viewportCenter);

    // Calculate the volume based on the distance from center
    // Volume should be 1 when the distance is 0 and decrease to 0 as it reaches or exceeds maxDistance
    let volume = 1 - (distanceFromCenter / maxDistance);
    volume = Math.max(0, Math.min(1, volume)); // Ensure volume is between 0 and 1

    // Set the video volume
    video.volume = volume;
});


const images = document.querySelectorAll('.c-loading__img');
const button = document.querySelector('.c-loading__button');

let i = 0;
function changeImage() {
    if (i > 0 && i < images.length) {
        images[i - 1].classList.remove('visble');
    }
    if (i < images.length) {
        images[i].classList.add('visble');
        const timing = 300 * (i + 1) / 2;
        setTimeout(changeImage, timing);
    }
    i++;
}
setTimeout(changeImage, 1000);

setTimeout(() => {
    button.classList.add('visble');
}, 4000);

    // Event listener for the button click
    button.addEventListener('click', function() {
    // Hide the loading screen
    document.querySelector('.c-loading-screen').style.display = 'none';
    

    video.play();
});