class customPlayer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.src = this.getAttribute("src");
        this.render();
        this.video = this.querySelector("video");
        this.playPauseButton = this.querySelector(".c-player__play");
        this.playPauseIcon = this.playPauseButton.querySelector("img");
        this.initEventListeners();
    }

    render() {
        // Styles and content as previously defined
        const content = `
            <div class="c-player">
                <button class="c-player__play"><img src="/assets/img/play.svg" alt="Play icon"></button>
                <div class="c-player__wave">
                    <img src="/assets/img/wavform.svg" alt="waveform transparent" class="c-player__wave-svg">
                    <img src="/assets/img/wavform.svg" alt="waveform transparent" class="c-player__wave-svg c-player__wave-svg--clipped">
                    <img src="/assets/img/wavform.svg" alt="waveform transparent" class="c-player__wave-svg c-player__wave-svg--hover">
                </div>
                <video controlslist="nodownload" _autoplay="" name="media" oncontextmenu="return false;">
                    <source src="${this.src}" type="audio/mpeg" />
                </video>
            </div>
        `;

        this.innerHTML = `${content}`;
    }

    initEventListeners() {
        const wave = this.querySelector('.c-player__wave');
        const clippedWave = this.querySelector('.c-player__wave-svg--clipped');
    
        this.playPauseButton.addEventListener("click", () => this.togglePlayPause());
    
        // Updated to call updateClip directly with the correct argument
        this.video.addEventListener("timeupdate", () => this.updateClip(clippedWave));
    
        wave.addEventListener("click", e => this.calculSeek(e, wave));
        wave.addEventListener("mousemove", e => this.hoverWave(e, wave));
        wave.addEventListener("mouseleave", () => this.leaveWave());
    }
    

    togglePlayPause() { 
        if (this.video.paused) {
            this.video.play();
            this.playPauseIcon.src = "/assets/img/pause.svg";
        } else {
            this.video.pause();
            this.playPauseIcon .src = "/assets/img/play.svg";
        }
    }

    updateClip(clippedWave) {
        const percentage = this.video.currentTime / this.video.duration * 100;
        clippedWave.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        requestAnimationFrame(() => this.updateClip(this.video, clippedWave));
    }
    

    calculSeek(e, wave) {
        if (!this.video) {
            console.error("Video element is not available");
            return;
        }
        const rect = wave.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / wave.offsetWidth;
        this.video.currentTime = percentage * this.video.duration;
    }
    
    hoverWave(e, wave) {
        const hoverWave = this.querySelector('.c-player__wave-svg--hover');
        const rect = wave.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / wave.offsetWidth;
        hoverWave.style.clipPath = `inset(0 ${100 - percentage * 100}% 0 0)`;
    }

    leaveWave() {
        const hoverWave = this.querySelector('.c-player__wave-svg--hover');
        hoverWave.style.clipPath = 'inset(0 100% 0 0)';
    }

    getCurrentTime() {
        return this.video.currentTime;
    }

    seek(time) {
        this.video.currentTime = time;
    }

    // You might also want to expose event listeners to the outside
    onTimeUpdate(callback) {
        this.video.addEventListener("timeupdate", () => callback(this.video.currentTime));
    }
}

customElements.define("custom-player", customPlayer);
