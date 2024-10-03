let playlist = [];
// Get HTML elements
const videoInput = document.getElementById('videoInput');
const addVideoBtn = document.getElementById('addVideoBtn');
const videoList = document.getElementById('videoList');
const showCodeBtn = document.getElementById('showCodeBtn');
const codeSection = document.getElementById('codeSection');
const codeOutput = document.getElementById('codeOutput');
const thumbnailResolutionSelect = document.getElementById('thumbnailResolution'); // Dropdown for thumbnail resolution
// Function to add video to playlist
addVideoBtn.addEventListener('click', () => {
const videoId = videoInput.value.trim();
const thumbnailResolution = thumbnailResolutionSelect.value; // Get selected thumbnail resolution
if (videoId) {
// Add video ID to playlist array
playlist.push({ videoId });
renderVideoList(); // Render list immediately after adding
// Fetch video details to display preview
fetch(`https://data-den.vercel.app/api/youtube-proxy?videoId=${videoId}`)
.then(response => response.json())
.then(data => {
const index = playlist.findIndex(video => video.videoId === videoId);
if (index !== -1) {
// Update the playlist array with the fetched data and selected thumbnail resolution
playlist[index].title = data.title;
playlist[index].thumbnail = `https://img.youtube.com/vi/${videoId}/${thumbnailResolution}.jpg`; // Use selected resolution
renderVideoList(); // Re-render the list to show updated data
}
})
.catch(error => {
alert('Invalid Video ID or error fetching video details');
console.error('Error fetching video details:', error);
});
videoInput.value = ''; // Clear input after adding
}
});
// Function to render the video list in the correct order
function renderVideoList() {
videoList.innerHTML = ''; // Clear previous list
// Loop through the playlist array and display video preview in the correct order
playlist.forEach((video, index) => {
const videoEntry = document.createElement('div');
videoEntry.classList.add('video-entry');
const thumbnail = document.createElement('img');
thumbnail.src = video.thumbnail || 'placeholder-thumbnail.png'; // Default thumbnail
thumbnail.alt = 'Video Thumbnail';
thumbnail.classList.add('thumbnail');
const videoTitle = document.createElement('span');
videoTitle.textContent = video.title || 'Loading...';
videoTitle.classList.add('video-title');
const removeBtn = document.createElement('button');
removeBtn.textContent = 'Remove';
removeBtn.classList.add('btn', 'btn-danger', 'ml-2');
removeBtn.addEventListener('click', () => removeVideo(index));
videoEntry.appendChild(thumbnail);
videoEntry.appendChild(videoTitle);
videoEntry.appendChild(removeBtn);
videoList.appendChild(videoEntry);
});
}
// Function to remove a video from the playlist
function removeVideo(index) {
playlist.splice(index, 1); // Remove the video at the specified index
renderVideoList(); // Re-render the list
}
// Function to show playlist code
showCodeBtn.addEventListener('click', () => {
if (playlist.length === 0) {
alert('Please add at least one video ID to generate the code.');
return;
}
// Generate playlist code, preserving the order in which videos were added
const generatedCode = `
<div class="container-fluid customBackground pad-vert-2x">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <h1 class="text-white">Check Out Our Youtube Channel</h1>
            </div>
            <div class="col-lg-9">
                <div class="video-container">
                    <div class="embed-responsive embed-responsive-16by9">
                        <iframe id="player" src="" frameborder="0" loading="lazy" allowfullscreen="" class="embed-responsive-item"></iframe>
                    </div>
                </div>
            </div>
            <div class="col-lg-3">
                <div class="sidebar">
                    <h2 class="playlistTitle">Playlist</h2>
                    <ul id="playlist"></ul>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
const playlist = $ { JSON.stringify(playlist.map(video => ({ videoId: video.videoId, title: video.title, thumbnail: video.thumbnail }))) };

const playerContainer = document.getElementById('player');
const playlistContainer = document.getElementById('playlist');

function loadVideo(videoId) {
    playerContainer.src = \`https://www.youtube.com/embed/\${videoId}?rel=0\`;
        }

        function createPlaylistItem(video, container) {
            const listItem = document.createElement('li');
            listItem.dataset.videoId = video.videoId;
            listItem.classList.add('playlist-item');

            const thumbnail = document.createElement('img');
            thumbnail.src = video.thumbnail;
            thumbnail.alt = 'Video Thumbnail';
            thumbnail.classList.add('thumbnail');
            listItem.appendChild(thumbnail);

            const videoTitle = document.createElement('span');
            videoTitle.textContent = video.title;
            videoTitle.classList.add('video-title');
            listItem.appendChild(videoTitle);

            listItem.addEventListener('click', () => {
                loadVideo(video.videoId);
            });

            container.appendChild(listItem);
        }

        playlist.forEach(video => {
            createPlaylistItem(video, playlistContainer);
        });

        loadVideo(playlist[0].videoId);
        <\/script>`;

    // Display the code in the output section
    codeOutput.textContent = generatedCode.trim();
    codeSection.classList.remove('hidden');
});

// Function to copy code to clipboard
copyCodeBtn.addEventListener('click', () => {
    const codeText = codeOutput.textContent;
    navigator.clipboard.writeText(codeText).then(() => {
        alert('Code copied to clipboard!');
    }).catch(err => {
        alert('Failed to copy code: ' + err);
    });
});