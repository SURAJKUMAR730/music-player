// Get required elements
let wrapper = document.querySelector(".wrapper"),
	imgTag = document.querySelector(".img-box img"),
	songName = document.querySelector(".music-details h3"),
	artist = document.querySelector(".music-details h4"),
	audioTag = document.querySelector("#audio"),
	playPauseBtn = document.querySelector(".play-pause"),
	prevBtn = document.querySelector(".prev"),
	nextBtn = document.querySelector(".next"),
	progressBar = document.querySelector(".progress"),
	currentTag = document.querySelector(".current"),
	durationTag = document.querySelector(".duration"),
	flowBtns = document.querySelectorAll(".flow"),
	shuffleBtn = document.querySelector(".shuffle"),
	musicListTag = document.querySelector(".music-list"),
	listIcon = document.querySelector(".list-icon"),
	closeIcon = document.querySelector(".close"),
	songsBox = document.querySelector(".songs"),
	activeSongTime;

// Import musicList from external module
import { musicList } from "./music.js";

// Generate a random song index on page load
let songIndex = Math.floor(Math.random() * musicList.length);

// Event listener for when the window loads to get song data
window.addEventListener("load", () => {
	getSongData(songIndex);
});

// Function to get song data and update HTML elements
function getSongData(index) {
	imgTag.src = `imgs/${musicList[index].src}.jpg`;
	songName.textContent = musicList[index].name;
	artist.textContent = musicList[index].artist;
	audioTag.src = `music/${musicList[index].src}.mp3`;

	// Add 'active' class to the current song and update activeSongTime
	songs.forEach((song) => {
		activeSongTime = document.querySelector(".active .time-num");
		if (activeSongTime != undefined || activeSongTime != null) {
			activeSongTime.textContent = activeSongTime.getAttribute("time");
		}
		song.classList.remove("active");
	});
	songs[index].classList.add("active");
	activeSongTime = document.querySelector(".active .time-num");
}

// Get required elements SOUND SLIDER
let volumeSlider = document.querySelector("#volume-slider"),
	decreaseVolumeBtn = document.querySelector(".decrease-volume"),
	increaseVolumeBtn = document.querySelector(".increase-volume");

// Event listener for volume slider change
volumeSlider.addEventListener("input", () => {
	audioTag.volume = volumeSlider.value / 100;
});

// Event listener for decrease volume button
decreaseVolumeBtn.addEventListener("click", () => {
	if (volumeSlider.value > 0) {
		volumeSlider.value = parseInt(volumeSlider.value) - 10;
		audioTag.volume = volumeSlider.value / 100;
	}
});

// Event listener for play/pause button click
playPauseBtn.addEventListener("click", () => {
	playPauseBtn.classList.toggle("playing");
	wrapper.classList.toggle("bounce");
	activeSongTime = document.querySelector(".active .time-num");

	// Play or pause the song based on the 'playing' class
	if (playPauseBtn.classList.contains("playing")) {
		audioTag.play();
		activeSongTime.textContent = "Playing";
	} else {
		audioTag.pause();
		activeSongTime.textContent = activeSongTime.getAttribute("time");
	}
});

// Event listener for previous button click
prevBtn.addEventListener("click", () => {
	// Auto-play if not playing, add 'playing' class, and update song index
	!playPauseBtn.classList.contains("playing") ? playPauseBtn.classList.add("playing") : "";
	wrapper.classList.add("bounce");

	if (songIndex > 0) {
		songIndex--;
		getSongData(songIndex), audioTag.play();
	} else {
		songIndex = musicList.length - 1;
		getSongData(songIndex);
		audioTag.play();
	}
});

// Event listener for next button click
nextBtn.addEventListener("click", () => {
	// Auto-play if not playing, add 'playing' class, and update song index
	!playPauseBtn.classList.contains("playing") ? playPauseBtn.classList.add("playing") : "";
	wrapper.classList.add("bounce");

	if (songIndex < musicList.length - 1) {
		songIndex++;
		getSongData(songIndex), audioTag.play();
	} else {
		songIndex = 0;
		getSongData(songIndex);
		audioTag.play();
	}
});

// Event listener for shuffle button click
shuffleBtn.addEventListener("click", () => {
	// Start playing if not playing and shuffle to a random song
	if (!playPauseBtn.classList.contains("playing")) {
		playPauseBtn.click();
	}

	let randomIndex = Math.floor(Math.random() * musicList.length);
	if (randomIndex !== songIndex) {
		getSongData(randomIndex);
		audioTag.play();
		songIndex = randomIndex;
	}
});

// Event listener for playlist icon click to show the list
listIcon.addEventListener("click", () => {
	musicListTag.classList.add("show");
});

// Event listener for close button click to hide the list
closeIcon.addEventListener("click", () => {
	musicListTag.classList.remove("show");
});

// Event listener for updating progress bar and time display
audioTag.addEventListener("timeupdate", (e) => {
	let current = e.target.currentTime,
		duration = e.target.duration,
		progress = (current / duration) * 100;
	progressBar.style.width = `${progress}%`;

	let currentMin = Math.floor(current / 60),
		currentSec = Math.floor(current % 60);

	currentTag.textContent = `${currentMin}:${currentSec < 10 ? "0" + currentSec : currentSec}`;

	// Auto-play next song or repeat if the current song ends
	let currentBtn = document.querySelector(".show");
	if (currentBtn.classList.contains("long")) {
		current == duration ? nextBtn.click() : "";
	} else if (currentBtn.classList.contains("repeat")) {
		if (current == duration) {
			audioTag.currentTime = 0;
			audioTag.play();
		}
	}

	// Update durationTag when audio data is loaded
	audioTag.addEventListener("loadeddata", () => {
		let durationTime = audioTag.duration,
			durationtMin = Math.floor(durationTime / 60),
			durationSec = Math.floor(durationTime % 60);
		durationTag.textContent = `${durationtMin}:${durationSec < 10 ? "0" + durationSec : durationSec}`;
	});
});

// Event listener for clicking on the progress bar to seek in the song
progressBar.parentElement.addEventListener("click", (e) => {
	let progressBarWidth = progressBar.parentElement.clientWidth,
		progressOffset = e.offsetX;
	audioTag.currentTime = (progressOffset / progressBarWidth) * audioTag.duration;
	playPauseBtn.classList.add("playing");
	audioTag.play();
});

// Event listener for flow buttons to toggle visibility
flowBtns.forEach((btn, index) => {
	btn.addEventListener("click", (e) => {
		e.target.classList.remove("show");
		// Show the appropriate button based on the clicked button
		if (index == flowBtns.length - 1) {
			document.querySelector(".long").classList.add("show");
		} else {
			e.target.nextElementSibling.classList.add("show");
		}
	});
});

// Insert songs into the list
musicList.forEach((song) => {
	let songTag = `<div class="song"}>
                  <div class="info">
                    <h4>${song.name}</h4>
                    <h5>${song.artist}</h5>
                  </div>
                  <audio id="${song.src}" src="music/${song.src}.mp3"></audio>
                  <span class="time-num ${song.src}"></span>
                </div>`;
	songsBox.insertAdjacentHTML("beforeend", songTag);

	let songAudio = document.querySelector(`#${song.src}`),
		songDuration = document.querySelector(`.${song.src}`);

	// Get the duration for each song and update the display
	songAudio.addEventListener("loadeddata", () => {
		let durationTime = songAudio.duration,
			durationtMin = Math.floor(durationTime / 60),
			durationSec = Math.floor(durationTime % 60);
		songDuration.textContent = `${durationtMin}:${durationSec < 10 ? "0" + durationSec : durationSec}`;
		songDuration.setAttribute("time", `${durationtMin}:${durationSec < 10 ? "0" + durationSec : durationSec}`);
	});
});

// Get all song elements and add click event listener
let songs = document.querySelectorAll(".song");

songs.forEach((song, index) => {
	song.addEventListener("click", (e) => {
		e.stopPropagation();
		wrapper.classList.add("bounce");
		// Remove 'active' class from other songs and reset time display
		songs.forEach((s, idx) => {
			s.classList.remove("active");
			let time = document.querySelectorAll(`.music-${idx + 1}`);
			if (time[0] != undefined) {
				time[0].textContent = time[0].getAttribute("time");
			}
		});

		// Determine which element was clicked and add 'active' class
		if (e.target.tagName == "H4" || e.target.tagName == "H5") {
			e.target.parentElement.parentElement.classList.add("active");
		} else if (e.target.tagName == "SPAN" || e.target.classList.contains("info")) {
			e.target.parentElement.classList.add("active");
		} else {
			e.target.classList.add("active");
		}

		// Change the time text to "Playing" and start the song
		activeSongTime = document.querySelector(".active .time-num");
		activeSongTime.textContent = "Playing";
		getSongData(index);
		playPauseBtn.classList.add("playing");
		audioTag.currentTime = 0;
		audioTag.play();
	});
});
