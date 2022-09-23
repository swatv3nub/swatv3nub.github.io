console.log("Welcome to Linkin Park Music Player")

//Intialize the Varibles
let songIndex = 0;
let audioElement = new Audio('/song/1.mp3')
let masterPlay = document.getElementById('masterPlay')
let myProgressBar = document.getElementById('myProgressBar')
let gif = document.getElementById('gif')
let masterSongName = document.getElementById('masterSongName')
let songItems = Array.from(document.getElementsByClassName('songItem'))

let songs = [
    { songsName: "Battle Symphony", filePath: "/music/song/1.mp3", coverPath: "/music/covers/cover.jpg" },
    { songsName: "Good Goodbye", filePath: "/music/song/1.mp3", coverPath: "/music/covers/cover.jpg" },
    { songsName: "Halfway Right", filePath: "/music/song/1.mp3", coverPath: "/music/covers/cover.jpg" },
    { songsName: "Heavy", filePath: "/music/song/1.mp3", coverPath: "/music/covers/cover.jpg" },
    { songsName: "Invisible", filePath: "/music/song/1.mp3", coverPath: "/music/covers/cover.jpg" },
    { songsName: "Nobody Can Save Me", filePath: "/music/song/1.mp3", coverPath: "/music/covers/cover.jpg" },
    { songsName: "One More Light", filePath: "/music/song/1.mp3", coverPath: "/music/covers/cover.jpg" },
    { songsName: "Sharp Edges", filePath: "/music/song/1.mp3", coverPath: "/music/covers/cover.jpg" },
    { songsName: "Sorry For Now", filePath: "/music/song/1.mp3", coverPath: "/music/covers/cover.jpg" },
    { songsName: "Talking to Myself", filePath: "/music/song/1.mp3", coverPath: "/music/covers/cover.jpg" },
]

songItems.forEach((element, i) =>{
    element.getElementsByTagName("img")[0].src = songs[i].coverPath
    element.getElementsByClassName("songName")[0].innerText = songs[i].songsName
 })
//audioElement.play()


//Handle Play Pause click
masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play()
        masterPlay.classList.remove('fa-circle-play');
        masterPlay.classList.add('fa-circle-pause');
        gif.style.opacity = 1;
    }
    else{
        audioElement.pause();
        masterPlay.classList.remove('fa-circle-pause')
        masterPlay.classList.add('fa-circle-play')
        gif.style.opacity = 0;
    }
})
//Listens to Events
audioElement.addEventListener('timeupdate', () => {
    progress = parseInt((audioElement.currentTime/audioElement.duration)* 100)
    myProgressBar.value = progress
})

myProgressBar.addEventListener('change' ,() =>{
    audioElement.currentTime = myProgressBar.value * audioElement.duration/100
})

const makeAllPlays = () =>{
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) =>{
        element.classList.remove('fa-circle-pause')
        element.classList.add('fa-circle-play')
    })
}

Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) =>{
    element.addEventListener('click',(e)=>{
    makeAllPlays()
    songIndex = parseInt(e.target.id)
      e.target.classList.remove('fa-circle-play')
      e.target.classList.add('fa-circle-pause')
      masterSongName.innerHTML = songs[songIndex].songsName
      audioElement.src = `song/${songIndex+1}.mp3`
      audioElement.currentTime = 0
      audioElement.play();
      gif.style.opacity = 1;
      masterPlay.classList.remove('fa-circle-play')
      masterPlay.classList.add('fa-circle-pause')
    
   })
})

document.getElementById('next').addEventListener('click',()=>{
    if(songIndex>=9){
        songIndex = 0
    }
    else{
        songIndex += 1
    }
    audioElement.src = `song/${songIndex+1}.mp3`
    masterSongName.innerHTML = songs[songIndex].songsName
    audioElement.currentTime = 0
    audioElement.play();
    masterPlay.classList.remove('fa-circle-play')
    masterPlay.classList.add('fa-circle-pause')
})

document.getElementById('previous').addEventListener('click',()=>{
    if(songIndex<=0){
        songIndex = 0
    }
    else{
        songIndex -= 1
    }
    audioElement.src = `song/${songIndex+1}.mp3`
    masterSongName.innerHTML = songs[songIndex].songsName
    audioElement.currentTime = 0
    audioElement.play();
    masterPlay.classList.remove('fa-circle-play')
    masterPlay.classList.add('fa-circle-pause')
})