document.addEventListener('DOMContentLoaded', () => {
    console.log('video.js loaded'); 

    const videos = document.querySelectorAll('.js-scroll-sound, .js-autoplay');
    const ambientSound = document.querySelector('.js-ambient-sound');
    if (ambientSound) ambientSound.volume = 0.5;

    const observerOptions = {
        root: null, 
        threshold: [0, 0.5, 1]
    };

    const videoVisibilityChanged = (entries, observer) => {
        entries.forEach(entry => {
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