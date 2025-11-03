document.addEventListener('DOMContentLoaded', () => {
    console.log('video.js loaded'); 

    const videos = document.querySelectorAll('.js-scroll-sound, .js-autoplay');
    const ambientSound = document.querySelector('.js-ambient-sound');
    if (ambientSound) ambientSound.volume = 0.5;

    const observerOptions = {
        root: null, 
        threshold: [0, 0.5, 1]
    };

    // Handle user-initiated pause/play to toggle scroll autoplay behavior
    const handleUserPauseState = (videoElement, evt) => {
        const lastUserInteraction = videoElement.dataset.lastUserInteraction === 'true';
        const userInitiated = (evt && evt.isTrusted) || lastUserInteraction;

        if (videoElement.paused) {
            // Mark as user-paused only for user-initiated pauses
            if (userInitiated) {
                videoElement.dataset.userPaused = 'true';
                videoElement.classList.remove('js-scroll-sound');
                videoElement.classList.add('js-scroll-paused');
            }
        } else {
            // Playing clears the userPaused flag
            videoElement.dataset.userPaused = 'false';
            videoElement.classList.add('js-scroll-sound');
            videoElement.classList.remove('js-scroll-paused');
        }

        // Reset the hint flag after handling
        videoElement.dataset.lastUserInteraction = 'false';
    };

    const videoVisibilityChanged = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.target.classList.contains('js-autoplay')) {
                const userPaused = entry.target.dataset && entry.target.dataset.userPaused === 'true';
                if (userPaused) return; // respect manual pause

                if (entry.isIntersecting) {
                    entry.target.play();
                } else {
                    entry.target.pause();
                }
            }
        });
    };

    const observer = new IntersectionObserver(videoVisibilityChanged, observerOptions);
    videos.forEach(video => {

        // Initialize user pause flag
        if (!video.dataset.userPaused) video.dataset.userPaused = 'false';
        if (!video.dataset.lastUserInteraction) video.dataset.lastUserInteraction = 'false';

        // Wire user interaction listeners
        video.addEventListener('click', () => {
            // Mark that the next media state change is from a user action
            video.dataset.lastUserInteraction = 'true';
            setTimeout(() => handleUserPauseState(video), 50);
        });
        video.addEventListener('pause', (evt) => handleUserPauseState(video, evt));
        video.addEventListener('play', (evt) => handleUserPauseState(video, evt));
        video.addEventListener('seeked', (evt) => {
            // Seeking is user interaction; don't force userPaused true, but clear flag
            video.dataset.lastUserInteraction = evt && evt.isTrusted ? 'true' : 'false';
            video.dataset.userPaused = 'false';
            handleUserPauseState(video, evt);
        });

        // Initialize state once
        handleUserPauseState(video);

        observer.observe(video);
    });

    const adjustVideoVolumeOnScroll = () => {
        let maxVisibleVolume = 0;

        videos.forEach(video => {
            if (!video.classList.contains('js-scroll-sound')) return;

            const videoRect = video.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            let volume = 0;

            if (videoRect.top < viewportHeight && videoRect.bottom > 0) {
                const visibleHeight = Math.min(videoRect.bottom, viewportHeight) - Math.max(videoRect.top, 0);
                
                // Determine volume calculation based on video size relative to viewport
                if (videoRect.height <= viewportHeight) {
                    // Small video: calculate volume based on video height
                    volume = visibleHeight / videoRect.height;
                } else {
                    // Large video: calculate volume based on viewport height
                    volume = visibleHeight / viewportHeight;
                }

                maxVisibleVolume = Math.max(maxVisibleVolume, volume);
            } 

            video.volume = Math.min(1, Math.max(0, volume));
        });

        if (ambientSound) {
            ambientSound.volume = Math.max(0, 1 - maxVisibleVolume)/2;
        }
    };

    window.addEventListener('scroll', adjustVideoVolumeOnScroll);
    adjustVideoVolumeOnScroll();
});