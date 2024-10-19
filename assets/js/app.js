// import { app, database } from './firebaseConfig.js';
// import firebase from "firebase/compat/app";

import { app, db, doc, collection, getDoc, getDocs, Timestamp, addDoc, query, orderBy, limit, where, onSnapshot } from './firebaseConfig.js';

const collectionRef = collection(db, 'songs');

// DATA QUERIES AND PUTTING THEM INTO ARRAYS FOR FUTURE USE

const q = query(collectionRef);
// const q = query(collectionRef, where(firebase.firestore.FieldPath.documentId(), "==", "01"));
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
console.log(albums);
console.log(albumAlts);
console.log(albumArtists);
// console.log(genres);

const artistsSection = document.querySelector(".artists-section div");
const albumsSection = document.querySelector(".albums-section div");
const featuredArtistSection = document.querySelector("main aside .aside-featured");
const featuredSongsSection = document.querySelector("main aside .aside-songs .aside-songs-grid");

artistsSection.onload = popularArtists();
albumsSection.onload = popularAlbums();
featuredArtistSection.onload = featured();

function popularArtists() {
    for(let i = 0; i < artists.length; i++) {
        if (artists[i].length <= 10) {
            artistsSection.innerHTML += 
            `<div>
                <img src="assets/images/Artist Profile/${artists[i]}.png">
                <h3>${artists[i]}</h3>
                <p class="sub">Artist</p>
            </div>`;
        } else {
            artistsSection.innerHTML += 
            `<div>
                <img src="assets/images/Artist Profile/${artists[i]}.png">
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

    featuredArtistSection.innerHTML = 
    `<h2>Featured Artist</h2>
    <img src="assets/images/Artist Profile/${song.artist.name}.png" alt="" class="aside-featured-img">
    <h3>${song.artist.name}</h3>
    <p class="sub">${song.genre[1]}</p>`

    for (let i = 0; i < allSongs.length; i++) {
        if (allSongs[i].albumAlt != undefined) {
            if (allSongs[i].title.length <= 20) {
                featuredSongsSection.innerHTML +=
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
                featuredSongsSection.innerHTML +=
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
                featuredSongsSection.innerHTML +=
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
                featuredSongsSection.innerHTML +=
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