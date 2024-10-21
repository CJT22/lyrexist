// SEARCH SEARCH SEARCH SEARCH SEARCH
document
  .getElementById("searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const searchQuery = document.getElementById("searchInput").value;
    window.location.href = `search-lyrics.html?query=${encodeURIComponent(
      searchQuery
    )}`;
  });
// SEARCH SEARCH SEARCH SEARCH SEARCH

// ==========================================================================================================

// POPULATING THE SEARCH-LYRICS.HTML
import { db, collection, query, where, getDocs } from "./firebaseConfig.js";

function getSearchQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("query");
}

async function searchDatabase(searchQuery) {
  const songsRef = collection(db, "songs");
  let searchResults = [];

  try {
    const titleSnapshot = await getDocs(songsRef);
    titleSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.title && data.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      searchResults.push(data);
      }
    });

    const artistSnapshot = await getDocs(songsRef);
    artistSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.artist && data.artist.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      searchResults.push(data);
      }
    });

    const albumSnapshot = await getDocs(songsRef);
    albumSnapshot.forEach((doc) => {
      const data = doc.data();
      if (
        data.album &&
        data.album.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        searchResults.push(data);
      }
    });

    const releaseYearQuery = query(
      songsRef,
      where("releaseYear", "==", parseInt(searchQuery))
    );
    const releaseYearSnapshot = await getDocs(releaseYearQuery);
    releaseYearSnapshot.forEach((doc) => searchResults.push(doc.data()));

    const lyricsSnapshot = await getDocs(songsRef);

    lyricsSnapshot.forEach((doc) => {
      const data = doc.data();

      if (data.lyrics) {
        let normalizedLyrics = data.lyrics
          .replaceAll(/\\n/g, " ")
          .toLowerCase();
        normalizedLyrics = normalizedLyrics.replaceAll("  ", " ");

        if (normalizedLyrics.includes(searchQuery.toLowerCase())) {
          searchResults.push(data);
        }
      }
    });

    return searchResults;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

async function populateResults(results, searchQuery) {
  const searchTermHeader = document.querySelector(".search-lyrics-header h2");
  searchTermHeader.innerHTML = `"${searchQuery}"`;

  const albumImage = document.querySelector(".long-album-art");
  const songTitle = document.querySelector(".featured-lyrics h3");
  const artistAndGenre = document.querySelector(".featured-lyrics .sub");
  const lyricsSnippet = document.querySelector("pre");

  if (results.length > 0) {
    const mainResult = results[0];
    if (mainResult.albumAlt != undefined) {
      albumImage.src = `assets/images/Album Covers/${mainResult.albumAlt}.png`;
    } else {
      albumImage.src = `assets/images/Album Covers/${mainResult.album}.png`;
    }
    const albumImageWrapper = document.createElement("a");
    albumImageWrapper.href = `song.html?name=${mainResult.title}`;
    albumImage.parentNode.insertBefore(albumImageWrapper, albumImage);
    albumImageWrapper.appendChild(albumImage);
    songTitle.textContent = mainResult.title;
    artistAndGenre.innerHTML = `<span>${
      mainResult.artist.name
    }</span> • <span>${mainResult.genre.join(", ")}</span>`;
    const words = mainResult.lyrics.split(" ");
    const maxWords = 20;
    let formattedLyrics = words
      .slice(0, maxWords)
      .reduce((acc, word, index) => {
        const lineIndex = Math.floor(index / 5);
        if (!acc[lineIndex]) acc[lineIndex] = [];
        acc[lineIndex].push(word);
        return acc;
      }, [])
      .map((line) => line.join(" "))
      .join("\n");
    formattedLyrics = formattedLyrics.replaceAll("\\n", " ");
    lyricsSnippet.innerHTML = `<pre>${formattedLyrics}</pre>`;

    // ==========================================================
    const songsRef = collection(db, "songs");
    let allSongs = [];
    let otherResults = [];
    let exploreMore = [];

    const q = query(songsRef);
    const qSnapshot = await getDocs(q);

    qSnapshot.forEach((doc) => {
      allSongs.push(doc.data());

      if (
        doc.data().artist.name == mainResult.artist.name &&
        doc.data().title != mainResult.title
      ) {
        otherResults.push(doc.data());
      }

      if (
        doc.data().genre[1] == mainResult.genre[1] &&
        doc.data().artist.name != mainResult.artist.name
      ) {
        exploreMore.push(doc.data());
      }
    });

    const otherResultsContainer = document.querySelector(
      ".other-results-section .album-box"
    );
    otherResultsContainer.innerHTML = "";
    const artistMatches = results.filter(
      (res) =>
        res.artist.name === mainResult.artist.name &&
        res.title !== mainResult.title
    );

    otherResults.forEach((result) => {
      const formattedTitle =
        result.title.length > 10
          ? result.title.substring(0, 10) + "..."
          : result.title;
      const otherResultHtml = `
      <div>
      <a href="song.html?name=${result.title}">
      <img src="assets/images/Album Covers/${
        result.albumAlt ? result.albumAlt : result.album
      }.png" alt="${result.title}">
      </a>
      <h3>${formattedTitle}</h3>
      <p class="sub">${result.artist.name}</p>
      </div>`;
      otherResultsContainer.innerHTML += otherResultHtml;
    });
    // ==========================================================

    // ==========================================================
    const exploreMoreContainer = document.querySelector(
      ".explore-more-section .album-box"
    );
    exploreMoreContainer.innerHTML = "";
    const genre = mainResult.genre[mainResult.genre.length - 1];
    const genreMatches = results.filter(
      (res) =>
        res.genre.includes(genre) && res.artist.name !== mainResult.artist.name
    );

    exploreMore.forEach((result) => {
      const formattedTitle =
        result.title.length > 10
          ? result.title.substring(0, 10) + "..."
          : result.title;
      const exploreMoreHtml = `
      <div>
      <a href="song.html?name=${result.title}">
      <img src="assets/images/Album Covers/${
        result.albumAlt ? result.albumAlt : result.album
      }.png" alt="${result.title}">
      </a>
      <h3>${formattedTitle}</h3>
      <p class="sub">${result.artist.name}</p>
      </div>`;
      exploreMoreContainer.innerHTML += exploreMoreHtml;
    });
  } else {
    const featuredLyricsContainer = document.querySelector(
      ".featured-lyrics-container"
    );
    featuredLyricsContainer.innerHTML = "";
    const otherResultsSection = document.querySelector(
      ".other-results-section"
    );
    otherResultsSection.innerHTML = "";
    const exploreMoreSection = document.querySelector(".explore-more-section");
    exploreMoreSection.innerHTML = "";
    const noResultsMessage = document.createElement("h3");
    noResultsMessage.textContent = "No Results Found...";
    featuredLyricsContainer.appendChild(noResultsMessage);
  }
}
// ==========================================================

async function initSearch() {
  const searchQuery = getSearchQuery();
  if (!searchQuery) return;

  const results = await searchDatabase(searchQuery);
  populateResults(results, searchQuery);
}

window.addEventListener("DOMContentLoaded", initSearch);
// POPULATING THE SEARCH-LYRICS.HTML
