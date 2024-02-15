// Define the LyricsApp web component
class LyricsApp extends HTMLElement {
    constructor() {
        super();
        this.id = this.getAttribute("id");
        this.originLink = "https://raw.githubusercontent.com/vdebrabandere-rtl/ressources/main/contact-rebrand/";
        this.dataOrigin = this.originLink + "/lyrics/json/";
        this.imageOrigin = this.originLink + "animateurs-pictures/";
        this.soundOrigin = this.originLink + "/lyrics/sounds/";
        this._data = null;
        this.freeScroll = false;
        this.isAutoScrolling = false;
        this.currentLine = null;

        this.handleScroll = this.handleScroll.bind(this);
    }

    connectedCallback() {
        this.fetchDatas().then(() => {
            this.render();
            this.generateLyrics(this._data.lyrics);
            this.content = this.querySelector(".c-content");
            this.player = this.querySelector("custom-player");
            this.resetButton = this.querySelector(".c-reset-button");

            this.initEventListeners();
            this.initHeader();
        });
    }

    disconnectedCallback() {
        if (this.content) {
            this.content.removeEventListener("scroll", this.handleScroll);
        }
        clearTimeout(this.autoScrollTimeout);
    }

    async fetchDatas() {
        const link = this.dataOrigin + this.id + ".json";
        try {
            const response = await fetch(link);
            if (!response.ok) {
                throw new Error("Failed to fetch lyric data");
            }
            this._data = await response.json();
        } catch (error) {
            console.error("Error:", error);
        }
    }
    render() {
        const content = `
        <div class="c-content">
            <div class="c-header">
                <div class="c-header__icon">
                    <img class="c-header__img" src="${this.imageOrigin}${this.id}.jpg" alt="">
                </div>
                <div class="c-header__text">
                    <h3 class="c-header__title">${this._data.title}</h3>
                    <p class="c-header__subtitle">${this._data.name}</p>
                </div>
            </div>
            <div class="c-lyrics"></div>
        </div>
        <button class="c-reset-button">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.008 14.1V42M12 26L24 14L36 26M12 6H36" stroke="white" stroke-width="4" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </button>
        <custom-player src="${this.soundOrigin}${this._data.id}.mp3"></custom-player>
        <div class="c-app__bg">
            <img class="c-app__img" src="${this.imageOrigin}${this._data.id}.jpg" alt="">
        </div>
        <div class="c-app__bar"></div>
        `;
        this.innerHTML = `${content}`;
    }

    generateLyrics(lyrics) {
        const lyricsContainer = this.querySelector(".c-lyrics");
        lyricsContainer.innerHTML = ""; // Clear existing content

        lyrics.forEach((line) => {
            const lyricElement = document.createElement("p");
            lyricElement.classList.add("c-lyrics__line");
            if (line.note) {
                lyricElement.classList.add("c-past-lyrics");
            }
            lyricElement.setAttribute("data-time", line.time);
            lyricElement.textContent = line.line || "";
            lyricElement.addEventListener("click", () => {
                const time =
                    parseFloat(lyricElement.getAttribute("data-time")) / 1000;
                this.player.seek(time);
                this.isAutoScrolling = true;
                this.freeScroll = false;
                this.resetButton.classList.remove("active");
                this.alignLyrics();
            });
            lyricsContainer.appendChild(lyricElement);
        });
        this.alignLyrics();
    }

    initEventListeners() {
        this.resetButton.addEventListener("click", () => {
            this.resetLyrics();
        });

        this.content.addEventListener("scroll", this.handleScroll);
        this.player.onTimeUpdate((currentTime) => {
            const time = currentTime * 1000;
            const nextLineIndex = this._data.lyrics.findIndex(
                (line) => line.time > time
            );
            if (
                nextLineIndex !== -1 &&
                this._data.lyrics[nextLineIndex] !== this.currentLine
            ) {
                this.currentLine = this._data.lyrics[nextLineIndex];
                const lyricsLines = this.querySelectorAll(".c-lyrics__line");
                lyricsLines.forEach((line, index) => {
                    index = index + 1;
                    line.classList.toggle(
                        "highlighted",
                        index === nextLineIndex
                    );
                    line.classList.toggle(
                        "c-past-lyrics",
                        index < nextLineIndex
                    );
                });
                this.alignLyrics();
            }
        });
    }

    handleScroll() {
        if (!this.isAutoScrolling) {
            if (!this.freeScroll) {
                this.freeScroll = true;
                this.resetButton.classList.add("active");
            }
        } else {
            clearTimeout(this.autoScrollTimeout);
            this.autoScrollTimeout = setTimeout(() => {
                this.isAutoScrolling = false;
            }, 100);
        }
    }

    alignLyrics() {
        if (!this.freeScroll) {
            this.isAutoScrolling = true;
            const highlighted = this.querySelector(
                ".c-lyrics__line.highlighted"
            );

            if (highlighted) {
                const targetScrollTop =
                    highlighted.offsetTop -
                    highlighted.parentElement.offsetTop +
                    this.content.offsetHeight / 2 -
                    highlighted.offsetHeight / 2;
                this.content.scrollTo({
                    top: targetScrollTop,
                    behavior: "smooth",
                });

                clearTimeout(this.autoScrollTimeout);
                this.autoScrollTimeout = setTimeout(() => {
                    this.isAutoScrolling = false;
                }, 500);
            }
        }
    }

    updateLyrics(currentTime) {
        console.log(currentTime);
        const time = currentTime * 1000;
        const nextLineIndex = this._data.lyrics.findIndex(
            (line) => line.time > time
        );

        if (
            nextLineIndex !== -1 &&
            this._data.lyrics[nextLineIndex] !== this.currentLine
        ) {
            console.log("enter");
            this.currentLine = this._data.lyrics[nextLineIndex];
            const lyricsLines = this.querySelectorAll(".c-lyrics__line");
            lyricsLines.forEach((line, index) => {
                index = index + 1;
                line.classList.toggle("highlighted", index === nextLineIndex);
                line.classList.toggle("c-past-lyrics", index < nextLineIndex);
            });

            this.alignLyrics();
        }
    }

    resetLyrics() {
        this.freeScroll = false;
        this.isAutoScrolling = true;
        this.resetButton.classList.remove("active");
        this.alignLyrics();
    }

    play() {
        if (this.player) this.player.play();
    }

    pause() {
        if (this.player) this.player.pause();
    }

    seek(time) {
        if (this.player) this.player.currentTime = time;
    }

    initHeader() {
        const header = this.querySelector(".c-header");
        let originalHeaderPos = header.offsetTop;
        this.adjustHeaderSize(header);
        window.addEventListener("resize", () => this.adjustHeaderSize(header));
        this.content.addEventListener("scroll", () => {
            let headerNewPos = header.offsetTop;

            if (originalHeaderPos !== headerNewPos) {
                header.classList.add("sticky");
                this.classList.add("sticky");
            }
            if (this.content.scrollTop < originalHeaderPos) {
                header.classList.remove("sticky");
                this.classList.remove("sticky");
            }
        });
    }
    adjustHeaderSize(header) {
        let headerHeight = header.clientHeight;
        header.style.height = `${headerHeight}px`;
        const headerChildren = header.children;
        for (let i = 0; i < headerChildren.length; i++) {
            headerChildren[i].style.position = "absolute";
        }
        const headerSubtitle = this.querySelector(".c-header__subtitle");
        headerSubtitle.style.position = "absolute";
    }
}
customElements.define("lyrics-app", LyricsApp);
class customPlayer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.src = this.getAttribute("src");

        this.assetsOrigin = "https://raw.githubusercontent.com/vdebrabandere-rtl/ressources/main/contact-rebrand/assets/svg/";
        this.render();
        this.video = this.querySelector("video");
        this.playPauseButton = this.querySelector(".c-player__play");
        this.playPauseIcon = this.playPauseButton.querySelector("img");
        this.initEventListeners()
    }

    render() {
        // Styles and content as previously defined
        const content = `
            <div class="c-player">
                <button class="c-player__play"><img src="${this.assetsOrigin}/play.svg" alt="Play icon"></button>
                <div class="c-player__wave">
                    <img src="${this.assetsOrigin}/wavform.svg" alt="waveform transparent" class="c-player__wave-svg">
                    <img src="${this.assetsOrigin}/wavform.svg" alt="waveform transparent" class="c-player__wave-svg c-player__wave-svg--clipped">
                    <img src="${this.assetsOrigin}/wavform.svg" alt="waveform transparent" class="c-player__wave-svg c-player__wave-svg--hover">
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
            this.playPauseIcon.src = `${this.assetsOrigin}/pause.svg`;
        } else {
            this.video.pause();
            this.playPauseIcon .src = `${this.assetsOrigin}/play.svg`;
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