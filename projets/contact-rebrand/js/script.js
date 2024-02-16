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

// Track the scroll position
window.addEventListener('scroll', () => {
    // Get the distance from the top of the viewport to the top of the video
    const videoTop = video.getBoundingClientRect().top;

    // If the video is outside the viewport by at least 500px, decrease the volume
    if (videoTop < -500 || videoTop > window.innerHeight) {
        video.volume = 0.2; // Adjust the volume as needed
    } else {
        video.volume = 1; // Reset the volume
    }
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