console.log("Let's Go!!!")
let currentSong = new Audio()
let songs;
let currentFolder;
// SECOND TO MINUTES:SECONDS
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60); // Convert remaining seconds to integer
    // Adding leading zero if seconds or minutes are single digit
    let formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    let formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
    return `${formattedMinutes}:${formattedSeconds}`;
}

// Example usage:
// console.log(formatTime(125)); // Output: "02:05"
// console.log(formatTime(30)); // Output: "00:30"

async function getSongs(folder) {
    currentFolder = folder
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName('a')
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    // console.log(songs);
    //PUTTING SONGS IN songList
    //shows all songs in playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML += `<li> 
        <img src="img/music.svg" alt="">
        <div class="info">
        <div class="songName"> ${song.replaceAll("%20", " ")}  </div>
        <div class="songArtist">ANDIP CHAUHAN</div>
        </div>
        <div class="playNow">
        <img class="invert" src="img/play.svg" alt="">
        </div>
    </li> `
    }


    // ATTACH AN EVENT LISTENER TO EACH SONG
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(element => {
        element.addEventListener("click", element1 => {
            // console.log(element.querySelector(".songName").innerHTML);
            playMusic(element.querySelector(".songName").innerHTML.trim());
        })

    });
    return songs;

}

const playMusic = (track, pause = false) => {
    // let audio=new Audio("/Video 84 - Spotify Clone/Songs/"+track)
    currentSong.src = `/${currentFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track)
    document.querySelector(".songTime").innerHTML = "00:00/00:00"
}

async function displayAlbums() {
    let a = await fetch(`/Songs/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        // console.log(e.href)
        if (e.href.includes("/Songs") && !e.href.includes(".htaccess")) {
            let folder = (e.href.split('/').slice(-2)[0])

            // not including ! expression causes to treat .htaccess as folder
            // Get the METADATA of the folder
            let a = await fetch(`/Songs/${folder}/info.json`);
            let response = await a.json();
            // console.log(response)

            cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg  viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.795 11.272L7.795 16.272C6.79593 16.8964 5.5 16.1782 5.5 15L5.5 5.00002C5.5 3.82186 6.79593 3.1036 7.795 3.72802L15.795 8.72802C16.735 9.31552 16.735 10.6845 15.795 11.272Z" fill="#000000"/>
                            </svg>
                        </div>
                        <img src="/Songs/${folder}/cover.jpg" alt="">
                        <h4>${response.title}</h4>
                        <p>${response.description}</p>
                    </div>`
        }
    }
    // Load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            // console.log(item, item.currentTarget.dataset);
            songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0])

        })
    })
}
async function main() {
    // Get the list of all the songs
    await getSongs("Songs/English");
    playMusic(songs[0], true)

    // Display all the albums on the page
    displayAlbums()



    // ATTACH AN EVENT LISTENER TO PLAY 
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause();
            play.src = "img/play.svg"
        }
    })

    // LISTEN FOR TIMEUPDATE EVENT
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songTime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //  ADD AN EVENTLISTENER TO SEEK SONG WITH SEEKBAR CIRCLE
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 99;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // ADD AN EVENT LISTENER TO PREVIOUS AND NEXT
    previous.addEventListener("click", () => {
        // console.log("Previous clicked");
        // console.log(currentSong);  
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
        else {
            index = songs.length - 1;
            playMusic(songs[index])

        }
    })
    next.addEventListener("click", () => {
        // console.log("Next clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])

        }
        else {
            index = 0;
            playMusic(songs[index])

        }
        // console.log(currentSong.src.split("/").slice(-1) [0]);
        // console.log(songs,index);
    })

    // Add an event listener to volume range
    //"change" will only change volume when clicked || "input" can change volume as we slide on input range 
    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("input", (e) => {
        // console.log(e,e.target,e.target.value)
        console.log("Setting volume to ", e.target.value, " / 100")
        if (e.target.value > 0) {
            document.querySelector(".volume").getElementsByTagName("img")[0].src = "img/vol.svg";
        }
        else {
            document.querySelector(".volume").getElementsByTagName("img")[0].src = "img/mute.svg";
        }
        currentSong.volume = parseInt(e.target.value) / 100;

    })
    document.querySelector(".volume").getElementsByTagName("img")[0].addEventListener("click", (e) => {
        if (currentSong.volume > 0) {
            console.log("Setting volume to 0")
            currentSong.volume = 0;
            e.target.src = "img/mute.svg"
            document.querySelector(".volume").getElementsByTagName("input")[0].value = 0
        }
        else {
            console.log("Setting volume to 20 / 100")
            currentSong.volume = 0.2;
            e.target.src = "img/vol.svg"
            document.querySelector(".volume").getElementsByTagName("input")[0].value = 20
        }

    })

    // Add an event listener to .hamburger (to open song list in mobile view)
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add an event listener to .close (to close song list in mobile view)
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })

}
main()
