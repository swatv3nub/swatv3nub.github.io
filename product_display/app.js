const timeLine = gsap.timeline({ defaults: { ease: "power1.out" } });

timeLine.to(".text", { y: "0%", duration: 1, stagger: 0.25 });
timeLine.to(".slider", { y: "-100%", duration: 1.5, delay: 1.5 });
timeLine.to('.intro', { y: "-100%", duration: 1 }, "-=1");
timeLine.fromTo('nav', { opacity: 0 }, { opacity: 1, duration: 1.5 })
timeLine.fromTo('section', { opacity: 0 }, { opacity: 1, duration: 1.5 }, "-=1")
timeLine.fromTo('.big-text', { opacity: 0 }, { opacity: 1, duration: 1.5 })


// seperate
const sections = document.querySelectorAll("section");
const Bubble =  document.querySelector(".bubble");

const options = {
    threshold : 0.7
}

let observer = new IntersectionObserver(navCheck, options)

function navCheck(entries){
    entries.forEach(entry => {
        const className = entry.target.className;
        const activeAnchor = document.querySelector(`[data-page=${className}]`);
        // const get_Attribute = entry.getAttribute("data-index");

        const cords = activeAnchor.getBoundingClientRect();
        const directions = {
            height: cords.height,
            width: cords.width,
            top: cords.top,
            left: cords.left,
        };
        if (entry.isIntersecting){
            Bubble.style.setProperty("left", `${directions.left}px`);
            Bubble.style.setProperty("top", `${directions.top}px`);
            Bubble.style.setProperty("width", `${directions.width}px`);
            Bubble.style.setProperty("height", `${directions.height}px`);
        }
    })
}

sections.forEach(section => {
    observer.observe(section);

});