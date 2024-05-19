document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.querySelector(".menu-icon");
  const sidebar = document.querySelector(".sidebar");
  const searchInput = document.querySelector(".search-box input");
  const searchButton = document.getElementById("searchButton");
  const videoList = document.querySelector(".vid-list");
  const playerContainer = document.getElementById("player-container");
  const themeToggleBtn = document.getElementById("theme-toggle");
  const body = document.body;

  // Check and apply the saved theme from localStorage
  if (localStorage.getItem("theme") === "dark") {
      body.classList.add("dark-theme");
  } else {
      body.classList.add("light-theme");
  }

  themeToggleBtn.addEventListener("click", () => {
      if (body.classList.contains("light-theme")) {
          body.classList.replace("light-theme", "dark-theme");
          localStorage.setItem("theme", "dark");
      } else {
          body.classList.replace("dark-theme", "light-theme");
          localStorage.setItem("theme", "light");
      }
  });

  let currentSearchQuery = "";

  // Event listener for menu icon click
  menuIcon.addEventListener("click", function () {
      sidebar.classList.toggle("small-sidebar");
  });

  // Event listener for search button click
  searchButton.addEventListener("click", function () {
      const query = searchInput.value.trim();
      if (query !== currentSearchQuery && query.length > 0) {
          currentSearchQuery = query;
          searchVideos(query);
      }
  });

  // Fetch YouTube videos based on search query
  function searchVideos(query) {
      const apiKey = "AIzaSyBApWKeXp2o0AlaZPvII7s_Ln_FlUP6F28"; // Replace with your YouTube API key
      const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${query}&key=${apiKey}`;

      fetch(apiUrl)
          .then((response) => {
              if (!response.ok) {
                  throw new Error("Failed to fetch videos");
              }
              return response.json();
          })
          .then((data) => {
              const videos = data.items;
              renderVideos(videos);
          })
          .catch((error) => {
              console.error("Error fetching videos:", error);
          });
  }

  // Function to fetch most popular YouTube videos
  function fetchVideos() {
      const apiKey = "AIzaSyBApWKeXp2o0AlaZPvII7s_Ln_FlUP6F28"; // Replace with your YouTube API key
      const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=IN&maxResults=50&key=${apiKey}`;

      fetch(apiUrl)
          .then((response) => {
              if (!response.ok) {
                  throw new Error("Failed to fetch videos");
              }
              return response.json();
          })
          .then((data) => {
              const videos = data.items;
              renderVideos(videos);
          })
          .catch((error) => {
              console.error("Error fetching videos:", error);
          });
  }

  // Function to render videos
  function renderVideos(videos) {
      // Clear previous video list
      videoList.innerHTML = "";

      videos.forEach((video) => {
          const videoDiv = document.createElement("div");
          videoDiv.classList.add("video-item");

          const videoThumbnail = document.createElement("img");
          videoThumbnail.src = video.snippet.thumbnails.medium.url;

          const videoTitle = document.createElement("p");
          videoTitle.textContent = video.snippet.title;

          // Add click event listener to play the video
          videoDiv.addEventListener("click", function () {
              playVideo(video.id.videoId || video.id); // Handle both search and popular video IDs
          });

          videoDiv.appendChild(videoThumbnail);
          videoDiv.appendChild(videoTitle);

          videoList.appendChild(videoDiv);
      });
  }

  function playVideo(videoId) {
      let playURL = `https://youtube.com/watch?v=${videoId}`;
      let newTab = window.open(playURL, "_blank");
      newTab.focus();
  }

  // Initial fetch for most popular videos when the page loads
  fetchVideos();
});
