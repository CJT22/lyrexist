// import { app, database } from './firebaseConfig.js';
// import firebase from "firebase/compat/app";

import { app, db, doc, collection, getDoc, getDocs, Timestamp, addDoc, query, orderBy, limit, where, onSnapshot } from './firebaseConfig.js';

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
let genres = [];

qSnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
    songs.push(doc.data());

    if (artists.includes(doc.data().artist.name) == false) {
        artists.push(doc.data().artist.name);
    }

    // if (albums.includes([doc.data().album, doc.data().albumAlt]) == false) {
    //     albums.push([doc.data().album, doc.data().albumAlt]);
    // }
    // console.log(albums.includes([doc.data().album, doc.data().albumAlt]));

    // if(albums.includes(doc.data().album) == false) {
    //     albums.push(doc.data().album);
    //     albumAlts.push(doc.data().albumAlt);
    // }
    
    if(albums.includes(doc.data().album) == false) {
        albums.push(doc.data().album);
        albumAlts.push(doc.data().albumAlt);
        albumArtists.push(doc.data().artist.name);
    }

    genres.push(doc.data().genre);
});

// console.log(songs);
// console.log(albums);
// console.log(albumAlts);
// console.log(albumArtists);
// console.log(genres);

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

// const allGenres = [altSongs, opmSongs, popRockSongs, kpopSongs, rbSongs];

// console.log(allGenres);

const artistsSection = document.querySelector("#index-artists-section");
const albumsSection = document.querySelector("#index-albums-section");

// console.log(artistsSection != null, albumsSection != null);

if (artistsSection != null && albumsSection != null) {
    artistsSection.onload = popularArtists();
    albumsSection.onload = popularAlbums();
}

// console.log(artistsSection.onload);

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
    for(let i = 0; i < 16; i++) {

        if (albumAlts[i] != undefined) {
            if (albums[i].length <= 10) {
                albumsSection.innerHTML += 
                `<div>
                    <img src="assets/images/Album Covers/${albumAlts[i]}.png">
                    <h3>${albums[i]}</h3>
                    <p class="sub">${albumArtists[i]}</p>
                </div>`;
            } else {
                albumsSection.innerHTML += 
                `<div>
                    <img src="assets/images/Album Covers/${albumAlts[i]}.png">
                    <h3>${albums[i].substring(0, 11)}...</h3>
                    <p class="sub">${albumArtists[i]}</p>
                </div>`;
            }
        } else {
            if (albums[i].length <= 10) {
                albumsSection.innerHTML += 
                `<div>
                    <img src="assets/images/Album Covers/${albums[i]}.png">
                    <h3>${albums[i]}</h3>
                    <p class="sub">${albumArtists[i]}</p>
                </div>`;
            } else {
                albumsSection.innerHTML += 
                `<div>
                    <img src="assets/images/Album Covers/${albums[i]}.png">
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
    `<h2>Featured Artist</h2>
    <img src="assets/images/Artist Profile/${song.artist.name}.png" alt="" class="aside-artist-img">
    <h3>${song.artist.name}</h3>
    <p class="sub">${song.genre[1]}</p>`

    for (let i = 0; i < allSongs.length; i++) {
        if (allSongs[i].albumAlt != undefined) {
            if (allSongs[i].title.length <= 20) {
                featuredSongs.innerHTML +=
                `<div class="aside-song-block">
                    <img src="assets/images/Album Covers/${allSongs[i].albumAlt}.png" alt="">
                    <div>
                        <p class="white">${allSongs[i].title}</p>
                        <p class="sub mt-s">${song.artist.name}</p>
                    </div>
                </div>`
            } else {
                // albumsSection.innerHTML += 
                // `<div>
                //     <img src="assets/images/Album Covers/${albumAlts[i]}.png">
                //     <h3>${albums[i].substring(0, 11)}...</h3>
                //     <p class="sub">Artist</p>
                // </div>`;
                featuredSongs.innerHTML +=
                `<div class="aside-song-block">
                    <img src="assets/images/Album Covers/${allSongs[i].albumAlt}.png" alt="">
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
                    <img src="assets/images/Album Covers/${allSongs[i].album}.png" alt="">
                    <div>
                        <p class="white">${allSongs[i].title}</p>
                        <p class="sub mt-s">${song.artist.name}</p>
                    </div>
                </div>`
            } else {
                // albumsSection.innerHTML += 
                // `<div>
                //     <img src="assets/images/Album Covers/${albumAlts[i]}.png">
                //     <h3>${albums[i].substring(0, 11)}...</h3>
                //     <p class="sub">Artist</p>
                // </div>`;
                featuredSongs.innerHTML +=
                `<div class="aside-song-block">
                    <img src="assets/images/Album Covers/${allSongs[i].album}.png" alt="">
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
console.log(path == "/artist.html");

if (path == "/artist.html") {
    window.onload = loadArtist();
}

function loadArtist() {
    console.log(songs);

    const urlParams = new URLSearchParams(window.location.search);
    const artist = urlParams.get('name');
    let artistSongs = [];

    console.log(artist);

    for (let i = 0; i < songs.length; i++) {
        // console.log(songs.artist.includes(artist));

        if (songs[i].artist.name == artist) {
            artistSongs.push(songs[i]);
        }
    }

    console.log(artistSongs);
}

// GENRE FILTERING
window.onload = loadGenre();

function loadGenre() {
    const urlParams = new URLSearchParams(window.location.search);
    const genreKey = urlParams.get('genre');
    // console.log(genreKey);
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

    // console.log(genre);

    const albumsSection = document.querySelector("section .albums-section");

    albumsSection.innerHTML += 
    `<p class="sub bold upper">Check out these albums!</p>
    <h2>Our top albums for ${genre[0].genre[1]}</h2>
    <div class="album-box mt-l">

    </div>`;

    const innerAlbumsSection = document.querySelector("section .albums-section .album-box");

    for(let i = 0; i < 4; i++) {

        if (genre[i].albumAlt != undefined) {
            if (genre[i].album.length <= 10) {
                innerAlbumsSection.innerHTML += 
                `<div>
                    <img src="assets/images/Album Covers/${genre[i].albumAlt}.png" alt="">
                    <h3>${genre[i].album}</h3>
                    <p class="sub">${genre[i].artist.name}</p>
                </div>`;
            } else {
                innerAlbumsSection.innerHTML += 
                `<div>
                    <img src="assets/images/Album Covers/${genre[i].albumAlt}.png" alt="">
                    <h3>${genre[i].album.substring(0, 11)}...</h3>
                    <p class="sub">${genre[i].artist.name}</p>
                </div>`;
            }
        } else {
            if (genre[i].album.length <= 10) {
                innerAlbumsSection.innerHTML += 
                `<div>
                    <img src="assets/images/Album Covers/${genre[i].album}.png" alt="">
                    <h3>${genre[i].album}</h3>
                    <p class="sub">${genre[i].artist.name}</p>
                </div>`;
            } else {
                innerAlbumsSection.innerHTML += 
                `<div>
                    <img src="assets/images/Album Covers/${genre[i].album}.png" alt="">
                    <h3>${genre[i].album.substring(0, 11)}...</h3>
                    <p class="sub">${genre[i].artist.name}</p>
                </div>`;
            }
        }
    }

    const artistsSection = document.querySelector("section .artists-section");

    artistsSection.innerHTML +=
    `<p class="sub bold upper">Check out these artists!</p>
    <h2>Our top artists for ${genre[0].genre[1]}</h2>
    <div class="artist-box mt-l">
    
    </div>`;

    const innerArtistsSection = document.querySelector("section .artists-section .artist-box");

    for(let i = 0; i < 2; i++) {
        innerArtistsSection.innerHTML +=
        `<div>
            <img src="assets/images/Artist Profile/${genre[i + 4].artist.name}.png" alt="">
            <h3>${genre[i + 4].artist.name}</h3>
            <p class="sub">Artist</p>
        </div>
        `;
    }

    const albumCovers = document.querySelector("section.featured-album");

    albumCovers.innerHTML +=
    `<img src="assets/images/Artist Cover/${genre[0].artist.name}.jpg" alt="">
    <img src="assets/images/Artist Cover/${genre[5].artist.name}.jpg" alt="">`;

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
                    <img src="assets/images/Album Covers/${genre[i].albumAlt}.png" alt="">
                    <h3>${genre[i].title}</h3>
                    <p class="sub">${genre[i].artist.name}</p>
                </div>`;
            } else {
                innerMusicSection.innerHTML +=
                `<div>
                    <img src="assets/images/Album Covers/${genre[i].albumAlt}.png" alt="">
                    <h3>${genre[i].title.substring(0, 11)}...</h3>
                    <p class="sub">${genre[i].artist.name}</p>
                </div>`;
            }
        } else {
            if (genre[i].title <= 10) {
                innerMusicSection.innerHTML +=
                `<div>
                    <img src="assets/images/Album Covers/${genre[i].album}.png" alt="">
                    <h3>${genre[i].title}</h3>
                    <p class="sub">${genre[i].artist.name}</p>
                </div>`;
            } else {
                innerMusicSection.innerHTML +=
                `<div>
                    <img src="assets/images/Album Covers/${genre[i].album}.png" alt="">
                    <h3>${genre[i].title.substring(0, 11)}...</h3>
                    <p class="sub">${genre[i].artist.name}</p>
                </div>`;
            }
        }
    }
}