const wrapper = document.querySelector(".wrapper");
const carouse = document.querySelector(".carouse");
const firstcardWidth = carouse.querySelector("#card").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper i");
const carouseChildrens = [...carouse.children];

let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;

// Get the number of cards that can fit in the carouse at once
let cardPerView = Math.round(carouse.offsetWidth / firstcardWidth);

// Insert copies of the last few cards to beginning of carouse for infinite scrolling
carouseChildrens.slice(-cardPerView).reverse().forEach(card => {
    carouse.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// Insert copies of the first few cards to end of carouse for infinite scrolling
carouseChildrens.slice(0, cardPerView).forEach(card => {
    carouse.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carouse at appropriate postition to hide first few duplicate cards on Firefox
carouse.classList.add("no-transition");
carouse.scrollLeft = carouse.offsetWidth;
carouse.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carouse left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carouse.scrollLeft += btn.id == "left" ? -firstcardWidth : firstcardWidth;
    });
});

const dragStart = (e) => {
    isDragging = true;
    carouse.classList.add("dragging");
    // Records the initial cursor and scroll position of the carouse
    startX = e.pageX;
    startScrollLeft = carouse.scrollLeft;
}

const dragging = (e) => {
    if(!isDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the carouse based on the cursor movement
    carouse.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    carouse.classList.remove("dragging");
}

const infiniteScroll = () => {
    // If the carouse is at the beginning, scroll to the end
    if(carouse.scrollLeft === 0) {
        carouse.classList.add("no-transition");
        carouse.scrollLeft = carouse.scrollWidth - (2 * carouse.offsetWidth);
        carouse.classList.remove("no-transition");
    }
    // If the carouse is at the end, scroll to the beginning
    else if(Math.ceil(carouse.scrollLeft) === carouse.scrollWidth - carouse.offsetWidth) {
        carouse.classList.add("no-transition");
        carouse.scrollLeft = carouse.offsetWidth;
        carouse.classList.remove("no-transition");
    }

    // Clear existing timeout & start autoplay if mouse is not hovering over carouse
    clearTimeout(timeoutId);
    if(!wrapper.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if(window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
    // Autoplay the carouse after every 2500 ms
    timeoutId = setTimeout(() => carouse.scrollLeft += firstcardWidth, 2500);
}
autoPlay();

carouse.addEventListener("mousedown", dragStart);
carouse.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carouse.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);