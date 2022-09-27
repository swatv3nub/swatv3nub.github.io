console.log("Welcome to Linkin Park Music Player")

//Intialize the Varibles
let songIndex = 0;
let audioElement = new Audio("../song/1.mp3")
console.log(audioElement.src)

//condition to check the play 
let play = false;


let masterPlay = document.getElementById('masterPlay')
let myProgressBar = document.getElementById('myProgressBar')
let gif = document.getElementById('gif')
let masterSongName = document.getElementById('masterSongName')

//previous and next button
const previousBtn = document.getElementById("previous");
const nextBtn = document.getElementById("next");

// let songItems = Array.from(document.getElementsByClassName('songItem'))
//this code returns a nodeList which is preety like array only
let songItems = document.querySelectorAll(".songItem");


let songs = [
    { songsName: "Lost in the Echo", filePath: "../song/1.mp3", coverPath: "/music/covers/livingthings.jpeg" },
    { songsName: "In My remains", filePath: "../song/2.mp3", coverPath: "/music/covers/livingthings.jpeg" },
    { songsName: "Burn it down", filePath: "../song/3.mp3", coverPath: "/music/covers/livingthings.jpeg" },
    { songsName: "Lies Greed and Misery", filePath: "../song/4.mp3", coverPath: "/music/covers/livingthings.jpeg" },
    { songsName: "I'll be Gone", filePath: "../song/5.mp3", coverPath: "/music/covers/livingthings.jpeg" },
    { songsName: "Castle of Glass", filePath: "../song/6.mp3", coverPath: "/music/covers/livingthings.jpeg" },
    { songsName: "Victimized", filePath: "../song/7.mp3", coverPath: "/music/covers/livingthings.jpeg" },
    { songsName: "Roads Untraveled", filePath: "../song/8.mp3", coverPath: "/music/covers/livingthings.jpeg" },
    { songsName: "Skin to bone", filePath: "../song/9.mp3", coverPath: "/music/covers/livingthings.jpeg" },
    { songsName: "Powerless", filePath: "../song/10.mp3", coverPath: "/music/covers/livingthings.jpeg" },
]

songItems.forEach((element, i) =>{
    element.getElementsByTagName("img")[0].src = songs[i].coverPath
    element.getElementsByClassName("songName")[0].innerText = songs[i].songsName
    
 })



//Handle Play Pause click
masterPlay.addEventListener('click', () => {
    if ((!play) && (audioElement.paused || audioElement.currentTime <= 0)) {
        console.log("clicked")
        audioElement.play()
        masterPlay.classList.remove('fa-circle-play');
        masterPlay.classList.add('fa-circle-pause');
        gif.style.opacity = 1;
        play = true;
    }
    else{
       
        audioElement.pause();
        masterPlay.classList.remove('fa-circle-pause')
        masterPlay.classList.add('fa-circle-play')
        gif.style.opacity = 0;
        play = false;
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

// const makeAllPlays = () =>{
//     songItems.forEach((element) =>{
//         element.classList.remove('fa-circle-pause')
//         element.classList.add('fa-circle-play')
//     })
// }


//logic for each play element
songItems.forEach((element) =>{

    element.addEventListener('click',(e)=>{
    songIndex = parseInt(e.target.id);
    const songSrc = songs[songIndex].filePath;
    //   audioElement.src = `song/${songIndex+1}.mp3`
    audioElement.setAttribute('src',`${songSrc}`);
    
    //condition to check whether the song is playing or not
    if(!play){
        // makeAllPlays()
        audioElement.play();
        e.target.classList.remove('fa-circle-play')
        e.target.classList.add('fa-circle-pause')
        masterPlay.classList.remove('fa-circle-play')
        masterPlay.classList.add('fa-circle-pause')
        play = true;
    }
    else{
        audioElement.pause();
        e.target.classList.add('fa-circle-play')
        e.target.classList.remove('fa-circle-pause')
        masterPlay.classList.add('fa-circle-play')
        masterPlay.classList.remove('fa-circle-pause')
        play = false;
    }

     
      masterSongName.innerHTML = songs[songIndex].songsName
    
      console.log(audioElement.src)
      audioElement.currentTime = 0
     
      gif.style.opacity = 1;
     
      console.log(audioElement.src)

      
    
   })
})

//logic for next button
nextBtn.addEventListener('click',()=>{
    
    songIndex = songIndex < 9 ? songIndex + 1 : 0 ;
    const songSrc = songs[songIndex].filePath;
    //   audioElement.src = `song/${songIndex+1}.mp3`
    audioElement.setAttribute('src',`${songSrc}`);
    audioElement.play();
    masterSongName.innerHTML = songs[songIndex].songsName
    masterPlay.classList.remove('fa-circle-play')
    masterPlay.classList.add('fa-circle-pause')
})

//logic for previous button
previousBtn.addEventListener('click',()=>{
    songIndex = songIndex >= 9 ? songIndex - 1 : 9;
    const songSrc = songs[songIndex].filePath;
    //   audioElement.src = `song/${songIndex+1}.mp3`
    audioElement.setAttribute('src',`${songSrc}`);
    audioElement.play();
    masterSongName.innerHTML = songs[songIndex].songsName
    masterPlay.classList.remove('fa-circle-play')
    masterPlay.classList.add('fa-circle-pause')
    // if(songIndex<=0){
    //     songIndex = 0
    // }
    // else{
    //     songIndex -= 1
    // }
    // audioElement.src = `song/${songIndex+1}.mp3`
    // masterSongName.innerHTML = songs[songIndex].songsName
    // audioElement.currentTime = 0
    // audioElement.play();
    // masterPlay.classList.remove('fa-circle-play')
    // masterPlay.classList.add('fa-circle-pause')
})

