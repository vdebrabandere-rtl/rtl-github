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
    const videoBottom = videoRect.bottom;
    const viewportHeight = window.innerHeight;

    // Determine the maximum distance for volume adjustment
    const maxDistance = 750; // Diminution over 750px

    let volume = 1;

    // Check if the video is moving off the top of the screen
    if (videoBottom < 0) {
        let distanceFromViewportTop = Math.abs(videoBottom);
        volume = 1 - (distanceFromViewportTop / maxDistance);
    }
    // Check if the video is moving off the bottom of the screen
    else if (videoTop > viewportHeight) {
        let distanceFromViewportBottom = videoTop - viewportHeight;
        volume = 1 - (distanceFromViewportBottom / maxDistance);
    }
    // If the video is fully within the viewport, set volume to 1
    else if (videoTop >= 0 && videoBottom <= viewportHeight) {
        volume = 1;
    }

    // Ensure volume is between 0 and 1
    volume = Math.max(0, Math.min(1, volume));

    // Set the video volume
    video.volume = volume;
});


const images = document.querySelectorAll('.c-loading__img');
const button = document.querySelector('.c-loading__button');

document.body.style.overflowY = 'hidden';


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
    document.body.style.overflowY = 'auto';
    

    video.play();
});