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
            this.headerHeight = this.querySelector(".c-header").clientHeight;

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
        // const link = this.dataOrigin + this.id + ".json";
        const link ="/contact-rebrand/convert/result/" + this.id + ".json";

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
                    <p class="c-header__function">${this._data.function}</p>
                </div>
            </div>
            <div class="c-lyrics"></div>
        </div>
        <button class="c-download-button">
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.4946 15.9706V19.9706C21.4946 20.501 21.2839 21.0097 20.9088 21.3848C20.5338 21.7599 20.0251 21.9706 19.4946 21.9706H5.49463C4.9642 21.9706 4.45549 21.7599 4.08042 21.3848C3.70534 21.0097 3.49463 20.501 3.49463 19.9706V15.9706" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7.49463 10.9706L12.4946 15.9706L17.4946 10.9706" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12.4946 15.9706V3.97058" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
        <button class="c-reset-button">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.008 14.1V42M12 26L24 14L36 26M12 6H36" stroke="white" stroke-width="4" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </button>
        <custom-player src="${this.soundOrigin}${this.id}.mp3""></custom-player>
        <div class="c-app__bg">
            <img class="c-app__img" src="${this.imageOrigin}${this.id}.jpg" alt="Photo floue de l'animateur en background">
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

        const downloadButton = this.querySelector('.c-download-button');
        downloadButton.addEventListener('click', () => {
            const link = this.originLink + "lyrics/text/" + this.id + ".pdf";
            console.log(link)
            window.open(link, '_blank');
        });

        this.content.addEventListener("scroll", this.handleScroll);
        this.player.onTimeUpdate((currentTime) => {
            const time = currentTime * 1000;
            console.log(time)
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
                const highlightPosition = highlighted.offsetTop - this.content.offsetTop  + this.headerHeight + highlighted.clientHeight; // Position of the highlighted line within the content
                const offset = 100 - this.headerHeight;
                // Calculate the target scroll top position
                let targetScrollTop = highlightPosition - (this.headerHeight - 72);
            
                this.content.scrollTo({
                    top: targetScrollTop,
                    behavior: "smooth",
                });
            }
            
        }
    }

    updateLyrics(currentTime) {
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
        this.headerHeight = headerHeight;
        const headerChildren = header.children;
        let headerChildrenHeight = 18;
        for (let i = 0; i < headerChildren.length; i++) {
            headerChildrenHeight += headerChildren[i].clientHeight;
            headerChildren[i].style.position = "absolute";
        }
        if (headerChildrenHeight > headerHeight) {
            header.style.height = `${headerChildrenHeight}px`;
            this.headerHeight = headerHeight;
        }
        const headerSubtitle = this.querySelector(".c-header__subtitle");
        headerSubtitle.style.position = "absolute";
    }
}
customElements.define("lyrics-app", LyricsApp);