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
    const videos = document.querySelectorAll('.js-scroll-sound, .js-autoplay');

    const observerOptions = {
        root: null, // Use the viewport as the root
        threshold: [0, 0.5, 1] // Multiple thresholds for finer control
    };

    const videoVisibilityChanged = (entries, observer) => {
        entries.forEach(entry => {
            // Handle autoplay and pause for .js-autoplay videos
            if (entry.target.classList.contains('js-autoplay')) {
                if (entry.isIntersecting) {
                    entry.target.play();
                } else {
                    entry.target.pause();
                }
            }
        });
    };

    const observer = new IntersectionObserver(videoVisibilityChanged, observerOptions);
    videos.forEach(video => observer.observe(video));

    // Function to adjust volume based on scroll for .js-scroll-sound videos
    const adjustVideoVolumeOnScroll = () => {
        videos.forEach(video => {
            if (!video.classList.contains('js-scroll-sound')) return;

            const videoRect = video.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            let volume = 1;

            // Adjust volume based on the video's vertical position in the viewport
            if (videoRect.top < viewportHeight && videoRect.bottom > 0) {
                // Video is partially visible
                const visibleHeight = Math.min(videoRect.bottom, viewportHeight) - Math.max(videoRect.top, 0);
                volume = visibleHeight / videoRect.height;
            } else if (videoRect.bottom <= 0 || videoRect.top >= viewportHeight) {
                // Video is completely out of view
                volume = 0;
            }

            video.volume = Math.max(0, Math.min(volume, 1)); // Ensure volume is between 0 and 1
        });
    };

    // Adjust volume on scroll and on load
    window.addEventListener('scroll', adjustVideoVolumeOnScroll);
    adjustVideoVolumeOnScroll();
});

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