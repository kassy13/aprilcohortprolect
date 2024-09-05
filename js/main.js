//main javascript
const menuBtn = document.getElementById('menu-btn');
const navlinks = document.getElementById("nav-links")
const menuBtnIcon = document.querySelector("i");

// First is to toggle the menu(nav-links) when the menu button is clicked

menuBtn.addEventListener('click', () => {
    navlinks.classList.toggle('open')

    // Change the menu button icon depending on if the menu is opened or closed
    const isOpen = navlinks.classList.contains('open');

    menuBtnIcon.setAttribute("class", isOpen ? 'ri-close-line' : "ri-menu-line")
})

// To remove the navlinks when you click on it
navlinks.addEventListener('click', () => {
    navlinks.classList.remove('open')
    menuBtnIcon.setAttribute('class', "ri-menu-line")
})



const scrollToTopBtn = document.querySelector('#scrollToTopBtn')
console.log(scrollToTopBtn);
// Show or hide the button based on scroll position
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.style.display = 'block'
    } else {
        scrollToTopBtn.style.display = 'none'
    }

})

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
})
const scrollRevealOption = {
    distance: "50px",
    origin: "bottom",
    duration: 1000
}
ScrollReveal().reveal(".header__image img", {
    ...scrollRevealOption,
    origin: "right"

})

//For countup 
import { CountUp } from 'https://cdn.jsdelivr.net/npm/countup.js@2.8.0/dist/countUp.min.js';

ScrollReveal().reveal(".counter__item", {
    interval: 200,
    afterReveal: function (el) {
        const countEl = el.querySelector('.count');
        const targetvalue = countEl.getAttribute('data-target')

        //initialize countupjs and start counting
        const countUp = new CountUp(countEl.id, targetvalue, { duration: 200 })
        if (!countUp.error) {
            countUp.start()
        } else {
            console.log(CountUp.error);
        }
    }

})

// Scroll to top functionality

