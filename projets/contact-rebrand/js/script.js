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

document.addEventListener('DOMContentLoaded', () => {
    // Select all videos that require scroll-based sound adjustment or autoplay
    const videos = document.querySelectorAll('.js-scroll-sound, .js-autoplay, .js-header__video');
    console.log(videos)

    const observerOptions = {
        root: null, // Use the viewport as the root
        threshold: 0.5 // Trigger when 50% of the video is visible
    };

    const videoVisibilityChanged = (entries, observer) => {
        entries.forEach(entry => {
            // For autoplay videos
            if (entry.isIntersecting && entry.target.classList.contains('js-autoplay')) {
                entry.target.play();
            } else if (!entry.isIntersecting && entry.target.classList.contains('js-autoplay')) {
                entry.target.pause();
            }

            // For scroll sound videos, adjust volume based on visibility
            if (entry.target.classList.contains('js-scroll-sound') || entry.target.classList.contains('js-header__video')) {
                const volume = entry.isIntersecting ? 1 : 0; // Simple visibility-based volume control
                entry.target.volume = volume;
            }
        });
    };

    const observer = new IntersectionObserver(videoVisibilityChanged, observerOptions);

    videos.forEach(video => {
        observer.observe(video); // Observe each video
    });

    // Adjust the volume based on scroll position for videos with class js-scroll-sound
    window.addEventListener('scroll', () => {
        document.querySelectorAll('.js-scroll-sound').forEach(video => {
            adjustVolumeBasedOnScroll(video);
        });
    });

    function adjustVolumeBasedOnScroll(video) {
        const videoRect = video.getBoundingClientRect();
        const videoCenter = videoRect.top + videoRect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const maxDistance = window.innerHeight / 2;
        const distanceFromCenter = Math.abs(videoCenter - viewportCenter);
        let volume = 1 - (distanceFromCenter / maxDistance);
        volume = Math.max(0, Math.min(1, volume)); // Ensure volume is between 0 and 1
        video.volume = volume;
    }
});

// Code for handling keyboard events remains the same


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
}, 0);

    // Event listener for the button click
    button.addEventListener('click', function() {
    // Hide the loading screen
    window.scrollTo(0, 0);
    document.querySelector('.c-loading-screen').style.display = 'none';
    const video = document.querySelector('.c-header__video');
    video.play();
});