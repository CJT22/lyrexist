// SEARCH SEARCH SEARCH SEARCH SEARCH
// SEARCH SEARCH SEARCH SEARCH SEARCH
// SEARCH SEARCH SEARCH SEARCH SEARCH
// SEARCH SEARCH SEARCH SEARCH SEARCH
// SEARCH SEARCH SEARCH SEARCH SEARCH
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
// SEARCH SEARCH SEARCH SEARCH SEARCH
// SEARCH SEARCH SEARCH SEARCH SEARCH
// SEARCH SEARCH SEARCH SEARCH SEARCH
// SEARCH SEARCH SEARCH SEARCH SEARCH
// SEARCH SEARCH SEARCH SEARCH SEARCH

// POPULATING THE SEARCH-LYRICS.HTML
// POPULATING THE SEARCH-LYRICS.HTML
// POPULATING THE SEARCH-LYRICS.HTML
// POPULATING THE SEARCH-LYRICS.HTML
// POPULATING THE SEARCH-LYRICS.HTML
import { db, collection, query, where, getDocs } from "./firebaseConfig.js";

// Extract search query from URL
function getSearchQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("query");
}

// Query Firebase database for matching results
async function searchDatabase(searchQuery) {
  const songsRef = collection(db, "songs");
  const searchResults = [];

  try {
    // Query by title
    const titleQuery = query(
      songsRef,
      where("title", ">=", searchQuery),
      where("title", "<=", searchQuery + "\uf8ff")
    );
    const titleSnapshot = await getDocs(titleQuery);
    titleSnapshot.forEach((doc) => searchResults.push(doc.data()));

    // Query by artist name
    const artistQuery = query(
      songsRef,
      where("artist.name", ">=", searchQuery),
      where("artist.name", "<=", searchQuery + "\uf8ff")
    );
    const artistSnapshot = await getDocs(artistQuery);
    artistSnapshot.forEach((doc) => searchResults.push(doc.data()));

    // Query by lyrics
    const lyricsQuery = query(
      songsRef,
      where("lyrics", ">=", searchQuery),
      where("lyrics", "<=", searchQuery + "\uf8ff")
    );
    const lyricsSnapshot = await getDocs(lyricsQuery);
    lyricsSnapshot.forEach((doc) => searchResults.push(doc.data()));

    return searchResults;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

// Populate the search-lyrics.html page with the results
function populateResults(results, searchQuery) {
  // Update the search term in the header
  const searchTermHeader = document.querySelector(".search-lyrics-header h2");
  searchTermHeader.innerHTML = `"${searchQuery}"`;

  // Select elements to populate
  const albumImage = document.querySelector(".long-album-art");
  const songTitle = document.querySelector(".featured-lyrics h3");
  const artistAndGenre = document.querySelector(".featured-lyrics .sub");
  const lyricsSnippet = document.querySelector("pre");

  if (results.length > 0) {
    // Populate the first result as the main feature
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

    // Populate other results in the "Other Results" section
    const otherResultsContainer = document.querySelector(
      ".other-results-section .album-box"
    );
    otherResultsContainer.innerHTML = ""; // Clear existing content
    results.slice(1).forEach((result) => {
      const otherResultHtml = `
    <div>
      <a href="song.html?name=${result.title}">
      <img src="assets/images/Album Covers/${
        result.albumAlt ? result.albumAlt : result.album
      }.png" alt="${result.title}">
      </a>
      <h3>${result.title}</h3>
      <p class="sub">${result.artist.name}</p>
    </div>`;
      otherResultsContainer.innerHTML += otherResultHtml;
    });

    // Populate the "Explore More" section with similar genre
    const exploreMoreContainer = document.querySelector(
      ".explore-more-section .album-box"
    );
    exploreMoreContainer.innerHTML = ""; // Clear existing content
    const genre = mainResult.genre[0]; // Assuming you want to explore the first genre of the main result
    const genreMatches = results.filter((res) => res.genre.includes(genre));
    genreMatches.forEach((result) => {
      const exploreMoreHtml = `
    <div>
      <a href="song.html?name=${result.title}">
      <img src="assets/images/Album Covers/${
        result.albumAlt ? result.albumAlt : result.album
      }.png" alt="${result.title}">
      </a>
      <h3>${result.title}</h3>
      <p class="sub">${result.artist.name}</p>
    </div>`;
      exploreMoreContainer.innerHTML += exploreMoreHtml;
    });
  } else {
    // If no results, show a "No results found" message
    songTitle.textContent = "No results found";
    artistAndGenre.textContent = "";
    lyricsSnippet.textContent = "";
  }
}

// Initialize the search functionality
async function initSearch() {
  const searchQuery = getSearchQuery();
  if (!searchQuery) return;

  const results = await searchDatabase(searchQuery);
  populateResults(results, searchQuery);
}

// Run search logic when page loads
window.addEventListener("DOMContentLoaded", initSearch);

// POPULATING THE SEARCH-LYRICS.HTML
// POPULATING THE SEARCH-LYRICS.HTML
// POPULATING THE SEARCH-LYRICS.HTML
// POPULATING THE SEARCH-LYRICS.HTML
// POPULATING THE SEARCH-LYRICS.HTML
