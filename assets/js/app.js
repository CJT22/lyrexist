// import { app, database } from './firebaseConfig.js';
// import firebase from "firebase/compat/app";

import { db, collection, getDocs, query, where } from './firebaseConfig.js';

const collectionRef = collection(db, 'songs');

// DATA QUERIES AND PUTTING THEM INTO ARRAYS FOR FUTURE USE
// Querying all songs
const q = query(collectionRef);
const qSnapshot = await getDocs(q);

let songs = [];
let artists = [];
let albumArtists = [];
let albums = [];
let albumAlts = [];

qSnapshot.forEach((doc) => {
    songs.push(doc.data());

    if (artists.includes(doc.data().artist.name) == false) {
        artists.push(doc.data().artist.name);
    }
    
    if(albums.includes(doc.data().album) == false) {
        albums.push(doc.data().album);
        albumAlts.push(doc.data().albumAlt);
        albumArtists.push(doc.data().artist.name);
    }
});

// Querying genre-specific songs
let altSongs = [];

const qAlt = query(collectionRef, where("genre", "array-contains", "Alternative/Indie"));
const qAltSnapshot = await getDocs(qAlt);

qAltSnapshot.forEach((doc) => {
    altSongs.push(doc.data());
});

let opmSongs = [];

const qOPM = query(collectionRef, where("genre", "array-contains", "OPM"));
const qOPMSnapshot = await getDocs(qOPM);

qOPMSnapshot.forEach((doc) => {
    opmSongs.push(doc.data());
});

let popRockSongs = [];

const qPopRock = query(collectionRef, where("genre", "array-contains", "Pop Rock"));
const qPopRockSnapshot = await getDocs(qPopRock);

qPopRockSnapshot.forEach((doc) => {
    popRockSongs.push(doc.data());
});

let kpopSongs = [];

const qKPOP = query(collectionRef, where("genre", "array-contains", "KPOP"));
const qKPOPSnapshot = await getDocs(qKPOP);

qKPOPSnapshot.forEach((doc) => {
    kpopSongs.push(doc.data());
});

let rbSongs = [];

const qRB = query(collectionRef, where("genre", "array-contains", "R&B"));
const qRBSnapshot = await getDocs(qRB);

qRBSnapshot.forEach((doc) => {
    rbSongs.push(doc.data());
});

const artistsSection = document.querySelector("#index-artists-section");
const albumsSection = document.querySelector("#index-albums-section");

if (artistsSection != null && albumsSection != null) {
    artistsSection.onload = popularArtists();
    albumsSection.onload = popularAlbums();
}

function popularArtists() {
    for(let i = 0; i < artists.length; i++) {
        if (artists[i].length <= 10) {
            artistsSection.innerHTML += 
            `<div>
                <a href="artist.html?name=${artists[i]}"><img src="assets/images/Artist Profile/${artists[i]}.png"></a>
                <h3>${artists[i]}</h3>
                <p class="sub">Artist</p>
            </div>`;
        } else {
            artistsSection.innerHTML += 
            `<div>
                <a href="artist.html?name=${artists[i]}"><img src="assets/images/Artist Profile/${artists[i]}.png"></a>
                <h3>${artists[i].substring(0, 11)}...</h3>
                <p class="sub">Artist</p>
            </div>`;
        }
    }
}

function popularAlbums() {
    for(let i = 0; i < 8; i++) {
        if (albumAlts[i] != undefined) {
            if (albums[i].length <= 10) {
                albumsSection.innerHTML += 
                `<div>
                    <a href="album.html?name=${albums[i]}"><img src="assets/images/Album Covers/${albumAlts[i]}.png" alt=""></a>
                    <h3>${albums[i]}</h3>
                    <p class="sub">${albumArtists[i]}</p>
                </div>`;
            } else {
                albumsSection.innerHTML += 
                `<div>
                    <a href="album.html?name=${albums[i]}"><img src="assets/images/Album Covers/${albumAlts[i]}.png" alt=""></a>
                    <h3>${albums[i].substring(0, 11)}...</h3>
                    <p class="sub">${albumArtists[i]}</p>
                </div>`;
            }
        } else {
            if (albums[i].length <= 10) {
                albumsSection.innerHTML += 
                `<div>
                    <a href="album.html?name=${albums[i]}"><img src="assets/images/Album Covers/${albums[i]}.png" alt=""></a>
                    <h3>${albums[i]}</h3>
                    <p class="sub">${albumArtists[i]}</p>
                </div>`;
            } else {
                albumsSection.innerHTML += 
                `<div>
                    <a href="album.html?name=${albums[i]}"><img src="assets/images/Album Covers/${albums[i]}.png" alt=""></a>
                    <h3>${albums[i].substring(0, 11)}...</h3>
                    <p class="sub">${albumArtists[i]}</p>
                </div>`;
            }
        }
    }
}

const featuredArtist = document.querySelector("main aside .aside-featured");
const featuredSongs = document.querySelector("main aside .aside-songs .aside-songs-grid");

if (featuredArtist != null && featuredSongs != null) {
    featuredArtist.onload = featured();
}

function featured() {
    let songNumber = Math.floor(Math.random() * songs.length);
    let song = songs[songNumber];
    let artistNumber = song.artist._id;
    let allSongs = [];

    for (let i = 0; i < songs.length; i++) {
        if (songs[i].artist._id == artistNumber) {
            allSongs.push(songs[i]);
        }
    }

    featuredArtist.innerHTML = 
    `<h2>Suggested Artist</h2>
    <a href="artist.html?name=${allSongs[0].artist.name}"><img src="assets/images/Artist Profile/${song.artist.name}.png" alt="" class="aside-artist-img"></a>
    <h3>${song.artist.name}</h3>
    <p class="sub">${song.genre[1]}</p>`

    for (let i = 0; i < allSongs.length; i++) {
        if (allSongs[i].albumAlt != undefined) {
            if (allSongs[i].title.length <= 20) {
                featuredSongs.innerHTML +=
                `<div class="aside-song-block">
                    <a href="song.html?name=${allSongs[i].title}"><img src="assets/images/Album Covers/${allSongs[i].albumAlt}.png" alt=""></a>
                    <div>
                        <p class="white">${allSongs[i].title}</p>
                        <p class="sub mt-s">${song.artist.name}</p>
                    </div>
                </div>`
            } else {
                featuredSongs.innerHTML +=
                `<div class="aside-song-block">
                    <a href="song.html?name=${allSongs[i].title}"><img src="assets/images/Album Covers/${allSongs[i].albumAlt}.png" alt=""></a>
                    <div>
                        <p class="white">${allSongs[i].title.substring(0, 21)}...</p>
                        <p class="sub mt-s">${song.artist.name}</p>
                    </div>
                </div>`
            }
        } else {
            if (allSongs[i].title.length <= 20) {
                featuredSongs.innerHTML +=
                `<div class="aside-song-block">
                    <a href="song.html?name=${allSongs[i].title}"><img src="assets/images/Album Covers/${allSongs[i].album}.png" alt=""></a>
                    <div>
                        <p class="white">${allSongs[i].title}</p>
                        <p class="sub mt-s">${song.artist.name}</p>
                    </div>
                </div>`
            } else {
                featuredSongs.innerHTML +=
                `<div class="aside-song-block">
                    <a href="song.html?name=${allSongs[i].title}"><img src="assets/images/Album Covers/${allSongs[i].album}.png" alt=""></a>
                    <div>
                        <p class="white">${allSongs[i].title.substring(0, 21)}...</p>
                        <p class="sub mt-s">${song.artist.name}</p>
                    </div>
                </div>`
            }
        }
    }
}

// FUNCTIONS FOR LINKING AND LOADING DYNAMIC WEBPAGE CONTENTS
// REDIRECT TO ARTIST
let path = window.location.pathname;

if (path == "/artist.html") {
    window.onload = loadArtist();
}

function loadArtist() {
    const urlParams = new URLSearchParams(window.location.search);
    const artist = urlParams.get('name');
    let artistSongs = [];


    for (let i = 0; i < songs.length; i++) {

        if (songs[i].artist.name == artist) {
            artistSongs.push(songs[i]);
        }
    }

    const mainFeatured = document.querySelector("section.main-featured");

    mainFeatured.innerHTML +=
    `
    <div>
        <img src="assets/images/Artist Cover/${artist}.jpg" alt="" class="featured-img">
    </div>
    <div class="main-featured-content">
        <div class="main-featured-artist">
            <h2>${artist}</h2>
            <img src="assets/images/Artist Profile/${artist}.png" alt="">
        </div>
        <div class="main-featured-content">
            <p>${artistSongs[0].artist.biography}</p>
        </div>
    </div>
    `;

    const artistAlbumsSection = document.querySelector("section.albums-section .album-box");

    let artistAlbums = [];
    let artistAlbumAlts = [];

    for (let i = 0; i < artistSongs.length; i++) {
        if (artistAlbums.includes(artistSongs[i].album) == false) {
            artistAlbums.push(artistSongs[i].album);
            artistAlbumAlts.push(artistSongs[i].albumAlt);
        }
    }

    for(let i = 0; i < artistAlbums.length; i++) {
        if (artistAlbumAlts[i] != undefined) {
            if (artistAlbums[i].length <= 10) {
                artistAlbumsSection.innerHTML += 
                `
                <div>
                    <a href="album.html?name=${artistAlbums[i]}"><img src="assets/images/Album Covers/${artistAlbumAlts[i]}.png" alt=""></a>
                    <h3>${artistAlbums[i]}</h3>
                    <p class="sub">${artist}</p>
                </div>
                `;
            } else {
                artistAlbumsSection.innerHTML += 
                `
                <div>
                    <a href="album.html?name=${artistAlbums[i]}"><img src="assets/images/Album Covers/${artistAlbumAlts[i]}.png" alt=""></a>
                    <h3>${artistAlbums[i].substring(0, 11)}...</h3>
                    <p class="sub">${artist}</p>
                </div>
                `;
            }
        } else {
            if (artistAlbums[i].length <= 10) {
                artistAlbumsSection.innerHTML += 
                `
                <div>
                    <a href="album.html?name=${artistAlbums[i]}"><img src="assets/images/Album Covers/${artistAlbums[i]}.png" alt=""></a>
                    <h3>${artistAlbums[i]}</h3>
                    <p class="sub">${artist}</p>
                </div>
                `;
            } else {
                artistAlbumsSection.innerHTML += 
                `
                <div>
                    <a href="album.html?name=${artistAlbums[i]}"><img src="assets/images/Album Covers/${artistAlbums[i]}.png" alt=""></a>
                    <h3>${artistAlbums[i].substring(0, 11)}...</h3>
                    <p class="sub">${artist}</p>
                </div>
                `;
            }
        }
    }
    
    const artistMusicSection = document.querySelector("section.music-section .music-box");

    for(let i = 0; i < artistSongs.length; i++) {
        if (artistSongs[i].albumAlt != undefined) {
            if (artistSongs[i].title.length <= 10) {
                artistMusicSection.innerHTML += 
                `
                <div>
                    <a href="song.html?name=${artistSongs[i].title}"><img src="assets/images/Album Covers/${artistSongs[i].albumAlt}.png" alt=""></a>
                    <h3>${artistSongs[i].title}</h3>
                    <p class="sub">${artist}t</p>
                </div>
                `;
            } else {
                artistMusicSection.innerHTML += 
                `
                <div>
                    <a href="song.html?name=${artistSongs[i].title}"><img src="assets/images/Album Covers/${artistSongs[i].albumAlt}.png" alt=""></a>
                    <h3>${artistSongs[i].title.substring(0, 11)}...</h3>
                    <p class="sub">${artist}</p>
                </div>
                `;
            }
        } else {
            if (artistSongs[i].title.length <= 10) {
                artistMusicSection.innerHTML += 
                `
                <div>
                    <a href="song.html?name=${artistSongs[i].title}"><img src="assets/images/Album Covers/${artistSongs[i].album}.png" alt=""></a>
                    <h3>${artistSongs[i].title}</h3>
                    <p class="sub">${artist}</p>
                </div>
                `;
            } else {
                artistMusicSection.innerHTML += 
                `<div>
                    <a href="song.html?name=${artistSongs[i].title}"><img src="assets/images/Album Covers/${artistSongs[i].album}.png" alt=""></a>
                    <h3>${artistSongs[i].title.substring(0, 11)}...</h3>
                    <p class="sub">${artist}</p>
                </div>`;
            }
        }
    }

    let otherArtists = [];
    const otherArtistsSection = document.querySelector("section.artists-section .artist-box")

    for (let i = 0; i < 5; i++) {
        if (artists[i] != artist) {
            otherArtists.push(artists[i]);
        }
    }

    for (let i = 0; i < otherArtists.length; i++) {
        if (otherArtists[i].length <= 10) {
            otherArtistsSection.innerHTML +=
            `
            <div>
                <a href="artist.html?name=${otherArtists[i]}"><img src="assets/images/Artist Profile/${otherArtists[i]}.png" alt=""></a>
                <h3>${otherArtists[i]}</h3>
                <p class="sub">Artist</p>
            </div>
            `;
        } else {
            otherArtistsSection.innerHTML +=
            `
            <div>
                <a href="artist.html?name=${otherArtists[i]}"><img src="assets/images/Artist Profile/${otherArtists[i]}.png" alt=""></a>
                <h3>${otherArtists[i].substring(0, 11)}</h3>
                <p class="sub">Artist</p>
            </div>
            `;
        }
    }
}

// REDIRECT TO ALBUM
if (path == "/album.html") {
    window.onload = loadAlbum();
}

function loadAlbum() {
    const urlParams = new URLSearchParams(window.location.search);
    const album = urlParams.get('name');
    let albumSongs = [];

    for (let i = 0; i < songs.length; i++) {
        if (songs[i].album == album) {
            albumSongs.push(songs[i]);
        }
    }

    const mainFeatured = document.querySelector("section.main-featured");

    if (albumSongs[0].albumAlt != undefined) {
        mainFeatured.innerHTML += 
        `
        <div>
            <img src="assets/images/Album Covers/${albumSongs[0].albumAlt}.png" alt="" class="featured-img limit-height">
        </div>
        <div class="main-featured-content">
            <div class="main-featured-album">
                <h2>${albumSongs[0].album}</h2>
                <p class="sub">${albumSongs[0].genre[1]}</p>
            </div>
        </div>
        `;
    } else {
        mainFeatured.innerHTML += 
        `
        <div>
            <img src="assets/images/Album Covers/${albumSongs[0].album}.png" alt="" class="featured-img limit-height">
        </div>
        <div class="main-featured-content">
            <div class="main-featured-album">
                <h2>${albumSongs[0].album}</h2>
                <p class="sub">${albumSongs[0].genre[1]}</p>
            </div>
        </div>
        `;
    }

    const albumMusicSection = document.querySelector("section.music-section .music-box");

    for(let i = 0; i < albumSongs.length; i++) {
        if (albumSongs[i].albumAlt != undefined) {
            if (albumSongs[i].title.length <= 10) {
                albumMusicSection.innerHTML += 
                `
                <div>
                    <a href="song.html?name=${albumSongs[i].title}"><img src="assets/images/Album Covers/${albumSongs[i].albumAlt}.png" alt=""></a>
                    <h3>${albumSongs[i].title}</h3>
                    <p class="sub">${albumSongs[i].genre[0]}t</p>
                </div>
                `;
            } else {
                albumMusicSection.innerHTML += 
                `
                <div>
                    <a href="song.html?name=${albumSongs[i].title}"><img src="assets/images/Album Covers/${albumSongs[i].albumAlt}.png" alt=""></a>
                    <h3>${albumSongs[i].title.substring(0, 11)}...</h3>
                    <p class="sub">${albumSongs[i].genre[0]}</p>
                </div>
                `;
            }
        } else {
            if (albumSongs[i].title.length <= 10) {
                albumMusicSection.innerHTML += 
                `
                <div>
                    <a href="song.html?name=${albumSongs[i].title}"><img src="assets/images/Album Covers/${albumSongs[i].album}.png" alt=""></a>
                    <h3>${albumSongs[i].title}</h3>
                    <p class="sub">${albumSongs[i].genre[0]}</p>
                </div>
                `;
            } else {
                albumMusicSection.innerHTML += 
                `<div>
                    <a href="song.html?name=${albumSongs[i].title}"><img src="assets/images/Album Covers/${albumSongs[i].album}.png" alt=""></a>
                    <h3>${albumSongs[i].title.substring(0, 11)}...</h3>
                    <p class="sub">${albumSongs[i].genre[0]}</p>
                </div>`;
            }
        }
    }

    let otherSongs = [];

    for(let i = 0; i < songs.length; i++) {
        if (songs[i].artist.name == albumSongs[0].artist.name && songs[i].album != albumSongs[0].album) {
            otherSongs.push(songs[i]);
        }
    }

    const asideArtist = document.querySelector("aside .aside-artist");

    asideArtist.innerHTML +=
    `
    <h2>The Artist</h2>
    <a href="artist.html?name=${albumSongs[0].artist.name}"><img src="assets/images/Artist Profile/${albumSongs[0].artist.name}.png" alt="" class="aside-artist-img"></a>
    <h3>${albumSongs[0].artist.name}</h3>
    <p class="sub">Artist</p>
    `;

    const asideSongs = document.querySelector("aside .aside-albums .aside-albums-grid");

    for(let i = 0; i < otherSongs.length; i++) {
        if (otherSongs[i].albumAlt != undefined) {
            asideSongs.innerHTML +=
            `
            <div class="aside-album-block">
                <a href="song.html?name=${otherSongs[i].title}"><img src="assets/images/Album Covers/${otherSongs[i].albumAlt}.png" alt=""></a>
                <div>
                    <p class="white">${otherSongs[i].title}</p>
                    <p class="sub mt-s">${otherSongs[i].genre[0]}</p>
                </div>
            </div>
            `;
        } else {
            asideSongs.innerHTML +=
            `
            <div class="aside-album-block">
                <a href="song.html?name=${otherSongs[i].title}"><img src="assets/images/Album Covers/${otherSongs[i].album}.png" alt=""></a>
                <div>
                    <p class="white">${otherSongs[i].title}</p>
                    <p class="sub mt-s">${otherSongs[i].genre[0]}</p>
                </div>
            </div>
            `;
        }
    }
}

// REDIRECT TO SONG
if (path == "/song.html") {
    window.onload = loadSong();
}

function loadSong() {
    const urlParams = new URLSearchParams(window.location.search);
    const songName = urlParams.get('name');
    let song;
    let artist;
    let otherSongs = [];
    let otherArtists = [];

    for (let i = 0; i < songs.length; i++) {
        if (songs[i].title == songName) {
            song = songs[i];
            artist = song.artist.name;
        }
    }

    for (let i = 0; i < songs.length; i++) {
        if (songs[i].title != songName && songs[i].artist.name == song.artist.name) {
            otherSongs.push(songs[i]);
        }

        if (songs[i].artist.name != artist && otherArtists.includes(songs[i].artist.name) == false) {
            otherArtists.push(songs[i].artist.name);
        }
    }

    const songHeader = document.querySelector("section.song-header");

    if (song.albumAlt != undefined) {
        songHeader.innerHTML += 
        `
        <h2>${song.title}</h2>
        <div class="song-details-container mt-l">
            <a href="album.html?name=${song.album}"><img src="assets/images/Album Covers/${song.albumAlt}.png" alt="" class="long-album-art"></a>
            <div class="artist-box">
                <div>
                    <a href="artist.html?name=${song.artist.name}"><img src="assets/images/Artist Profile/${song.artist.name}.png" alt=""></a>
                    <h3 class="text-center mt-s">${song.artist.name}</h3>
                    <p class="sub text-center">Artist</p>
                </div>
            </div>
            <div class="release-details">
                <p class="sub">Release Year</p>
                <h2>${song.releaseYear}</h2>
                <p class="sub genre">Genre</p>
                <h2>${song.genre[0]}</h2>
            </div>
        </div>
        `;
    } else {
        songHeader.innerHTML += 
        `
        <h2>${song.title}</h2>
        <div class="song-details-container mt-l">
            <a href="album.html?name=${song.album}"><img src="assets/images/Album Covers/${song.album}.png" alt="" class="long-album-art"></a>
            <div class="artist-box">
                <div>
                    <a href="artist.html?name=${song.artist.name}"><img src="assets/images/Artist Profile/${song.artist.name}.png" alt=""></a>
                    <h3 class="text-center mt-s">${song.artist.name}</h3>
                    <p class="sub text-center">Artist</p>
                </div>
            </div>
            <div class="release-details">
                <p class="sub">Release Year</p>
                <h2>${song.releaseYear}</h2>
                <p class="sub genre">Genre</p>
                <h2>${song.genre[0]}</h2>
            </div>
        </div>
        `;
    }

    const lyricsSection = document.querySelector("section.lyrics-section .mt-s");

    let lyrics = song.lyrics.replaceAll("\\n", "<br>");
    console.log(lyrics);

    lyricsSection.innerHTML += `${lyrics}`;

    const musicSection = document.querySelector("section.music-section .music-box");

    for(let i = 0; i < otherSongs.length; i++) {
        if (otherSongs[i].albumAlt != undefined) {
            if (otherSongs[i].title.length <= 10) {
                musicSection.innerHTML += 
                `
                <div>
                    <a href="song.html?name=${otherSongs[i].title}"><img src="assets/images/Album Covers/${otherSongs[i].albumAlt}.png" alt=""></a>
                    <h3>${otherSongs[i].title}</h3>
                    <p class="sub">${otherSongs[i].genre[0]}t</p>
                </div>
                `;
            } else {
                musicSection.innerHTML += 
                `
                <div>
                    <a href="song.html?name=${otherSongs[i].title}"><img src="assets/images/Album Covers/${otherSongs[i].albumAlt}.png" alt=""></a>
                    <h3>${otherSongs[i].title.substring(0, 11)}...</h3>
                    <p class="sub">${otherSongs[i].genre[0]}</p>
                </div>
                `;
            }
        } else {
            if (otherSongs[i].title.length <= 10) {
                musicSection.innerHTML += 
                `
                <div>
                    <a href="song.html?name=${otherSongs[i].title}"><img src="assets/images/Album Covers/${otherSongs[i].album}.png" alt=""></a>
                    <h3>${otherSongs[i].title}</h3>
                    <p class="sub">${otherSongs[i].genre[0]}</p>
                </div>
                `;
            } else {
                musicSection.innerHTML += 
                `<div>
                    <a href="song.html?name=${otherSongs[i].title}"><img src="assets/images/Album Covers/${otherSongs[i].album}.png" alt=""></a>
                    <h3>${otherSongs[i].title.substring(0, 11)}...</h3>
                    <p class="sub">${otherSongs[i].genre[0]}</p>
                </div>`;
            }
        }
    }

    const artistsSection = document.querySelector("section.artists-section .artist-box");

    for (let i = 0; i < otherArtists.length; i++) {
        if (otherArtists[i].length <= 10) {
            artistsSection.innerHTML +=
            `
            <div>
                <a href="artist.html?name=${otherArtists[i]}"><img src="assets/images/Artist Profile/${otherArtists[i]}.png" alt=""></a>
                <h3>${otherArtists[i]}</h3>
                <p class="sub">Artist</p>
            </div>
            `;
        } else {
            artistsSection.innerHTML +=
            `
            <div>
                <a href="artist.html?name=${otherArtists[i]}"><img src="assets/images/Artist Profile/${otherArtists[i]}.png" alt=""></a>
                <h3>${otherArtists[i].substring(0, 11)}</h3>
                <p class="sub">Artist</p>
            </div>
            `;
        }
    }
}

// GENRE FILTERING
window.onload = loadGenre();

function loadGenre() {
    const urlParams = new URLSearchParams(window.location.search);
    const genreKey = urlParams.get('genre');
    let genre;

    if (genreKey == "altSongs") {
        genre = altSongs;
    } else if (genreKey == "opmSongs") {
        genre = opmSongs;
    } else if (genreKey == "popRockSongs") {
        genre = popRockSongs;
    } else if (genreKey == "kpopSongs") {
        genre = kpopSongs;
    } else if (genreKey == "rbSongs") {
        genre = rbSongs;
    }

    let genreAlbums = [];
    let genreAlbumAlts = [];

    for (let i = 0; i < genre.length; i++) {
        if (genreAlbums.includes(genre[i].album) == false) {
            genreAlbums.push(genre[i].album);
            genreAlbumAlts.push(genre[i].albumAlt);
        }
    }

    const albumsSection = document.querySelector("section .albums-section");

    albumsSection.innerHTML += 
    `<p class="sub bold upper">Check out these albums!</p>
    <h2>Our top albums for ${genre[0].genre[1]}</h2>
    <div class="album-box nowrap scrollbar mt-l">

    </div>`;

    const innerAlbumsSection = document.querySelector("section .albums-section .album-box");

    for(let i = 0; i < 4; i++) {

        if (genreAlbumAlts[i] != undefined) {
            if (genreAlbums[i].length <= 10) {
                innerAlbumsSection.innerHTML += 
                `<div>
                    <a href="album.html?name=${genreAlbums[i]}"><img src="assets/images/Album Covers/${genreAlbumAlts[i]}.png" alt=""></a>
                    <h3>${genreAlbums[i]}</h3>
                    <p class="sub">${genre[i].artist.name}</p>
                </div>`;
            } else {
                innerAlbumsSection.innerHTML += 
                `<div>
                    <a href="album.html?name=${genreAlbums[i]}"><img src="assets/images/Album Covers/${genreAlbumAlts[i]}.png" alt=""></a>
                    <h3>${genreAlbums[i].substring(0, 11)}...</h3>
                    <p class="sub">${genre[i].artist.name}</p>
                </div>`;
            }
        } else {
            if (genreAlbums[i].length <= 10) {
                innerAlbumsSection.innerHTML += 
                `<div>
                    <a href="album.html?name=${genreAlbums[i]}"><img src="assets/images/Album Covers/${genreAlbums[i]}.png" alt=""></a>
                    <h3>${genreAlbums[i]}</h3>
                    <p class="sub">${genre[i].artist.name}</p>
                </div>`;
            } else {
                innerAlbumsSection.innerHTML += 
                `<div>
                    <a href="album.html?name=${genreAlbums[i]}"><img src="assets/images/Album Covers/${genreAlbums[i]}.png" alt=""></a>
                    <h3>${genreAlbums[i].substring(0, 11)}...</h3>
                    <p class="sub">${genre[i].artist.name}</p>
                </div>`;
            }
        }
    }

    const artistsSection = document.querySelector("section .artists-section");

    artistsSection.innerHTML +=
    `<p class="sub bold upper">Check out these artists!</p>
    <h2>Our top artists for ${genre[0].genre[1]}</h2>
    <div class="artist-box nowrap scrollbar mt-l">
    
    </div>`;

    const innerArtistsSection = document.querySelector("section .artists-section .artist-box");

    for(let i = 0; i < 2; i++) {
        innerArtistsSection.innerHTML +=
        `<div>
            <a href="artist.html?name=${genre[i + 4].artist.name}"><img src="assets/images/Artist Profile/${genre[i + 4].artist.name}.png" alt=""></a>
            <h3>${genre[i + 4].artist.name}</h3>
            <p class="sub">Artist</p>
        </div>
        `;
    }

    const albumCovers = document.querySelector("section.featured-album");

    albumCovers.innerHTML +=
    `
    <a href="artist.html?name=${genre[0].artist.name}"><img src="assets/images/Artist Cover/${genre[0].artist.name}.jpg" alt=""></a>
    <a href="artist.html?name=${genre[5].artist.name}"><img src="assets/images/Artist Cover/${genre[5].artist.name}.jpg" alt=""></a>
    `;

    const musicSection = document.querySelector("section.music-section");

    musicSection.innerHTML += 
    `<p class="sub bold upper">Looking for more?</p>
    <h2>Our top songs for ${genre[0].genre[1]}</h2>
    <div class="music-box mt-l">
    
    </div>`;

    const innerMusicSection = document.querySelector("section.music-section .music-box");

    for(let i = 0; i < 8; i++) {
        if (genre[i].albumAlt != undefined) {
            if (genre[i].title <= 10) {
                innerMusicSection.innerHTML +=
                `<div>
                    <a href="song.html?name=${genre[i].title}"><img src="assets/images/Album Covers/${genre[i].albumAlt}.png" alt=""></a>
                    <h3>${genre[i].title}</h3>
                    <p class="sub">${genre[i].artist.name}</p>
                </div>`;
            } else {
                innerMusicSection.innerHTML +=
                `<div>
                    <a href="song.html?name=${genre[i].title}"><img src="assets/images/Album Covers/${genre[i].albumAlt}.png" alt=""></a>
                    <h3>${genre[i].title.substring(0, 11)}...</h3>
                    <p class="sub">${genre[i].artist.name}</p>
                </div>`;
            }
        } else {
            if (genre[i].title <= 10) {
                innerMusicSection.innerHTML +=
                `<div>
                    <a href="song.html?name=${genre[i].title}"><img src="assets/images/Album Covers/${genre[i].album}.png" alt=""></a>
                    <h3>${genre[i].title}</h3>
                    <p class="sub">${genre[i].artist.name}</p>
                </div>`;
            } else {
                innerMusicSection.innerHTML +=
                `<div>
                    <a href="song.html?name=${genre[i].title}"><img src="assets/images/Album Covers/${genre[i].album}.png" alt=""></a>
                    <h3>${genre[i].title.substring(0, 11)}...</h3>
                    <p class="sub">${genre[i].artist.name}</p>
                </div>`;
            }
        }
    }
}