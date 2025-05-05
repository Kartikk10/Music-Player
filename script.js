// DOM Elements
const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");

// Song Data
const songs = [
    {
        id: 1,
        title: "Passo Bem Solto - Slowed",
        artist: "ATLXS",
        duration: "1:56",
        src: "Assets/song-1.mp3",
        coverArt: "Assets/cover-art-1.jfif",
        alt: "Cover art for Passo Bem Solto - Slowed by ATLXS"
    },
    {
        id: 2,
        title: "Funk Infernal",
        artist: "DYGO & MxngO",
        duration: "1:30",
        src: "Assets/song-2.mp3",
        coverArt: "Assets/cover-art-2.jfif",
        alt: "Cover art for Funk Infernal by DYGO & MxngO"
    },
    {
        id: 3,
        title: "Funk Universo",
        artist: "Irokz",
        duration: "2:07",
        src: "Assets/song-3.mp3",
        coverArt: "Assets/cover-art-3.jfif",
        alt: "Cover art for Funk Universo by Irokz"
    },
    {
        id: 4,
        title: "Matushka Ultrafunk",
        artist: "Satirin",
        duration: "2:24",
        src: "Assets/song-4.mp3",
        coverArt: "Assets/cover-art-4.jfif",
        alt: "Cover art for Matushka Ultrafunk by Satirin"
    },
    {
        id: 5,
        title: "Montagem Tomada - Slowed",
        artist: "MXZI",
        duration: "1:25",
        src: "Assets/song-5.mp3",
        coverArt: "Assets/cover-art-5.jfif",
        alt: "Cover art for Montagem Tomada - Slowed by MXZI"
    },
    {
        id: 6,
        title: "Nunca Muda? - Slowed",
        artist: "Scythermane, NXGTH!, MC Fabinho da Osk",
        duration: "1:30",
        src: "Assets/song-6.mp3",
        coverArt: "Assets/cover-art-6.jfif",
        alt: "Cover art for Nunca Muda? - Slowed by Scythermane, NXGTH!, MC Fabinho da Osk"
    },
    {
        id: 7,
        title: "Slava Funk!",
        artist: "MVSTERIOUS, Hxmr, yngastrobeatz, EVO",
        duration: "1:53",
        src: "Assets/song-7.mp3",
        coverArt: "Assets/cover-art-7.jfif",
        alt: "Cover art for Slava Funk! by MVSTERIOUS, Hxmr, yngastrobeatz, EVO"
    },
    {
        id: 8,
        title: "SPACE! - Super Slowed",
        artist: "NAOMI",
        duration: "1:49",
        src: "Assets/song-8.mp3",
        coverArt: "Assets/cover-art-8.jfif",
        alt: "Cover art for SPACE! - Super Slowed by NAOMI"
    },
    {
        id: 9,
        title: "Montagem Lunar Celestia 1.0 - Super Slowed",
        artist: "TOKYOPHILE",
        duration: "1:54",
        src: "Assets/song-9.mp3",
        coverArt: "Assets/cover-art-9.jfif",
        alt: "Cover art for Montagem Lunar Celestia 1.0 - Super Slowed by TOKYOPHILE"
    },
    {
        id: 10,
        title: "Judas Funk!",
        artist: "RVNGE, xlout, FUNK DEMON, EVO",
        duration: "2:13",
        src: "Assets/song-10.mp3",
        coverArt: "Assets/cover-art-10.jfif",
        alt: "Cover art for Judas Funk! by RVNGE, xlout, FUNK DEMON, EVO"
    }
];

// Audio Setup
const audio = new Audio();

// User State
let userData = {
    songs: [...songs],
    currentSong: null,
    songCurrentTime: 0
};

// Playback controls
const playSong = id => {
    const song = userData?.songs.find((song) => song.id === id);
    audio.src = song.src;
    audio.title = song.title;

    if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
        audio.currentTime = 0;
    } else {
        audio.currentTime = userData?.songCurrentTime;
    }

    userData.currentSong = song;
    playButton.classList.add("playing");

    setPlayerDisplay();
    highlightCurrentSong();
    setPlayButtonAccessibleText();
    audio.play();
}

const pauseSong = () => {
    userData.songCurrentTime = audio.currentTime;
    playButton.classList.remove("playing");
    audio.pause();
};

const playNextSong = () => {
    if (userData?.currentSong === null) {
        playSong(userData?.songs[0].id);
    } else {
        const currentSongIndex = getCurrentSongIndex();
        const nextSong = userData?.songs[currentSongIndex + 1];
        playSong(nextSong.id);
    }
}

const playPreviousSong = () => {
    if (userData?.currentSong === null) {
        return;
    } else {
        const currentSongIndex = getCurrentSongIndex();
        const previousSong = userData?.songs[currentSongIndex - 1];
        playSong(previousSong.id);
    }
}

const shuffle = () => {
    userData?.songs.sort(() => Math.random() - 0.5);
    userData.currentSong = null;
    userData.songCurrentTime = 0;
    renderPlaylist(userData?.songs);
    pauseSong();
};

const deleteSong = id => {
    if (userData?.currentSong?.id === id) {
        userData.currentSong = null;
        userData.songCurrentTime = 0;
        pauseSong();
        setPlayerDisplay();
    }
    userData.songs = userData?.songs.filter((song) => song.id !== id);

    renderPlaylist(userData?.songs);
    highlightCurrentSong();
    setPlayButtonAccessibleText();
};

// Update display
const setPlayerDisplay = () => {
    const playingSongCoverArt = document.querySelector("#player-album-art #album-art-wrapper img");
    const playingSongTitle = document.getElementById("player-song-title");
    const playingSongArtist = document.getElementById("player-song-artist");

    if (!userData?.currentSong) {
        playingSongCoverArt.src = "Assets/default-cover-art.jfif";
        playingSongCoverArt.alt = "Default album cover";
        playingSongTitle.textContent = "";
        playingSongArtist.textContent = "";
        return;
    }

    const currentTitle = userData.currentSong.title;
    const currentArtist = userData.currentSong.artist;
    const coverArt = userData.currentSong.coverArt?.trim();

    playingSongCoverArt.src = coverArt ? coverArt : "Assets/default-cover-art.jfif";
    playingSongCoverArt.alt = userData.currentSong.alt ?? "";

    playingSongTitle.textContent = currentTitle ?? "";
    playingSongArtist.textContent = currentArtist ?? "";
};

// Highlight song
const highlightCurrentSong = () => {
    const playlistSongElements = document.querySelectorAll(".playlist-song");
    playlistSongElements.forEach((songElem) => {
        songElem.removeAttribute("aria-current");
    })
    if (userData?.currentSong) {
        const songToHighlight = document.getElementById(`song-${userData.currentSong.id}`);
        if (songToHighlight) {
            songToHighlight.setAttribute("aria-current", "true");
        }
    }
};

// Render playlist
const renderPlaylist = array => {
    const songsHTML = array.map(song => {
        return `
        <li id="song-${song.id}" class="playlist-song">
            <button onclick="playSong(${song.id})" class="playlist-song-info">
                <span class="playlist-song-title">${song.title}</span>
                <span class="playlist-song-artist">${song.artist}</span>
                <span class="playlist-song-duration">${song.duration}</span>
            </button>
            <button onclick="deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}" >
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg>
            </button>
        </li>
        `;
    })
    playlistSongs.innerHTML = songsHTML.join("");

    if (userData?.songs.length === 0) {
        const resetButton = document.createElement("button");
        const resetText = document.createTextNode("Reset Playlist");
        resetButton.id = "reset-playlist";
        resetButton.ariaLabel = "Reset Playlist";
        resetButton.appendChild(resetText);
        playlistSongs.appendChild(resetButton);

        resetButton.addEventListener("click", () => {
            userData.songs = [...songs];
            renderPlaylist(sortSongs());
            setPlayButtonAccessibleText();
            resetButton.remove();
        });
    }
}

// Accessible label
const setPlayButtonAccessibleText = () => {
    if (userData?.currentSong) {
        playButton.setAttribute("aria-label", `Play ${userData?.currentSong.title}`);
    } else {
        playButton.setAttribute("aria-label", "Play a song");
    }
};

// Get song index
const getCurrentSongIndex = () => userData?.songs.indexOf(userData?.currentSong);

// Button events
playButton.addEventListener("click", () => {
    if (userData?.currentSong === null) {
        playSong(userData?.songs[0].id);
    } else {
        playSong(userData?.currentSong.id);
    }
})

pauseButton.addEventListener("click", pauseSong);

nextButton.addEventListener("click", playNextSong);

previousButton.addEventListener("click", playPreviousSong);

shuffleButton.addEventListener("click", shuffle);

// Auto play next
audio.addEventListener("ended", () => {
    const currentSongIndex = getCurrentSongIndex();
    const nextSongExists = userData?.songs[currentSongIndex + 1] !== undefined;
    if (nextSongExists) {
        playNextSong();
    } else {
        playSong(userData?.songs[0].id);
    }
});

// Sort songs
const sortSongs = () => {
    userData?.songs.sort((a, b) => {
        if (a.title < b.title) {
            return -1;
        } else if (a.title > b.title) {
            return 1;
        }
        return 0;
    });
    return userData?.songs;
};

// Init app
renderPlaylist(sortSongs());
setPlayButtonAccessibleText();
setPlayerDisplay();
