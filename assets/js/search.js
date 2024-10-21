// SEARCH SEARCH SEARCH SEARCH SEARCH
// SEARCH SEARCH SEARCH SEARCH SEARCH
// SEARCH SEARCH SEARCH SEARCH SEARCH
/* The code snippet you provided is adding an event listener to the form element with the id
"searchForm". When the form is submitted, the function inside the event listener is executed. Here's
a breakdown of what the function does: */
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

// ==========================================================================================================

// POPULATING THE SEARCH-LYRICS.HTML
// POPULATING THE SEARCH-LYRICS.HTML
// POPULATING THE SEARCH-LYRICS.HTML
import { db, collection, query, where, getDocs } from "./firebaseConfig.js";

/**
 * The function `getSearchQuery` retrieves the value of the "query" parameter from the URL search
 * parameters.
 * @returns The `getSearchQuery` function returns the value of the "query" parameter from the URL
 * search parameters.
 */
function getSearchQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("query");
}

/**
 * The function `searchDatabase` searches a database for songs based on a search query, including
 * searching by title, artist name, and lyrics.
 * @param searchQuery - The `searchQuery` parameter is the term or phrase that the user wants to search
 * for in the database. This function searches for the `searchQuery` in the "title" field,
 * "artist.name" field, and the lyrics of the songs in the "songs" collection in the database.
 * @returns The `searchDatabase` function returns an array of search results based on the search query
 * provided. The search results include songs that match the search query in their title, artist name,
 * or lyrics. If there are any errors during the search process, an empty array is returned.
 */
async function searchDatabase(searchQuery) {
  const songsRef = collection(db, "songs");
  const searchResults = [];

  try {
    const titleQuery = query(
      songsRef,
      where("title", ">=", searchQuery),
      where("title", "<=", searchQuery + "\uf8ff")
    );
    const titleSnapshot = await getDocs(titleQuery);
    titleSnapshot.forEach((doc) => searchResults.push(doc.data()));

    const artistQuery = query(
      songsRef,
      where("artist.name", ">=", searchQuery),
      where("artist.name", "<=", searchQuery + "\uf8ff")
    );
    const artistSnapshot = await getDocs(artistQuery);
    artistSnapshot.forEach((doc) => searchResults.push(doc.data()));

    const lyricsSnapshot = await getDocs(songsRef);

    lyricsSnapshot.forEach((doc) => {
      const data = doc.data();

      if (data.lyrics) {
        let normalizedLyrics = data.lyrics.replaceAll(/\\n/g, " ").toLowerCase();
        normalizedLyrics = normalizedLyrics.replaceAll("  ", " ");

        console.log(normalizedLyrics);

        if (normalizedLyrics.includes(searchQuery.toLowerCase())) {
          searchResults.push(data);
        }
      }
    });

    const releaseYearQuery = query(
      songsRef,
      where("releaseYear", "==", parseInt(searchQuery))
    );
    const releaseYearSnapshot = await getDocs(releaseYearQuery);
    releaseYearSnapshot.forEach((doc) => searchResults.push(doc.data()));

    return searchResults;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

/**
 * The function `populateResults` populates the search results on a webpage with album images, song
 * titles, artist information, and snippets of lyrics based on the search query.
 * @param results - The `results` parameter in the `populateResults` function is an array containing
 * information about songs that match a search query. Each element in the array represents a song and
 * includes details such as title, artist, genre, album, albumAlt, and lyrics. The function populates
 * the search results on
 * @param searchQuery - The `searchQuery` parameter in the `populateResults` function is the search
 * term entered by the user to search for lyrics. This search term is used to display relevant results
 * on the webpage.
 */
function populateResults(results, searchQuery) {
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

    const otherResultsContainer = document.querySelector(
      ".other-results-section .album-box"
    );
    otherResultsContainer.innerHTML = "";
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

    const exploreMoreContainer = document.querySelector(
      ".explore-more-section .album-box"
    );
    exploreMoreContainer.innerHTML = "";
    const genre = mainResult.genre[0];
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
    songTitle.textContent = "No results found";
    artistAndGenre.textContent = "";
    lyricsSnippet.textContent = "";
  }
}

/**
 * The `initSearch` function asynchronously initializes a search by retrieving the search query,
 * searching the database for results, and populating the results on the page.
 * @returns If the `searchQuery` is falsy (e.g. empty string, null, undefined), the function will
 * return early and nothing will be executed.
 */
async function initSearch() {
  const searchQuery = getSearchQuery();
  if (!searchQuery) return;

  const results = await searchDatabase(searchQuery);
  populateResults(results, searchQuery);
}

/* The line `window.addEventListener("DOMContentLoaded", initSearch);` is adding an event listener to
the `window` object for the "DOMContentLoaded" event. */
window.addEventListener("DOMContentLoaded", initSearch);

// POPULATING THE SEARCH-LYRICS.HTML
// POPULATING THE SEARCH-LYRICS.HTML
// POPULATING THE SEARCH-LYRICS.HTML
