import Swiper, { Pagination, Navigation } from 'swiper';
import 'swiper/swiper-bundle.min.css';
import gsap from "gsap";
import { reviews } from "./data";
import imagesLoaded from "imagesloaded";
import Scrollbar, { ScrollbarPlugin } from "smooth-scrollbar";

class DisableScrollPlugin extends ScrollbarPlugin {
    static pluginName = 'disableScroll';
    static defaultOptions = { direction: '' };
    transformDelta(delta) {
        if (this.options.direction) {
            delta[this.options.direction] = 0;
        }
        return { ...delta };
    }
}
Scrollbar.use(DisableScrollPlugin);

class AnchorPlugin extends ScrollbarPlugin {
    static pluginName = 'anchor';
    onHashChange = () => { this.jumpToHash(window.location.hash); };
    onClick = (event) => {
        const { target } = event;
        if (target.tagName !== 'A') return;
        const hash = target.getAttribute('href');
        if (!hash || hash.charAt(0) !== '#') return;
        this.jumpToHash(hash);
    };
    jumpToHash = (hash) => {
        const { scrollbar } = this;
        if (!hash) return;
        scrollbar.containerEl.scrollTop = 0;
        scrollbar.scrollIntoView(document.querySelector(hash));
    };
    onInit() {
        this.jumpToHash(window.location.hash);
        window.addEventListener('hashchange', this.onHashChange);
        this.scrollbar.contentEl.addEventListener('click', this.onClick);
    }
    onDestory() {
        window.removeEventListener('hashchange', this.onHashChange);
        this.scrollbar.contentEl.removeEventListener('click', this.onClick);
    }
}
Scrollbar.use(AnchorPlugin);

document.addEventListener('DOMContentLoaded', function () {
    Swiper.use([Pagination, Navigation]);
    const swiper = new Swiper(".swiper", {
        direction: "horizontal",
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        breakpoints: {
            850: { slidesPerView: 2 },
            1400: { slidesPerView: 3 },
            2200: { slidesPerView: 4 },
        },
        pagination: { el: ".swiper-pagination", type: "bullets", clickable: true },
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
    });

    const swiperContainer = document.querySelector(".swiper-wrapper");
    reviews.forEach((review) => {
        let template = `
            <div class="swiper-slide">
                <div class="review">
                    <div class="review__card">
                        <div class="review__topborder"></div>
                        <div class="review__text">
                            <span>${review.review.substring(0, 1)}</span>
                            ${review.review.substring(1)}
                        </div>
                        <img src="${review.image}" alt="" class="review__img"/>
                        <div class="review__profile">
                            <span>${review.name}</span>
                            <span>${review.position}</span>
                        </div>
                    </div>
                </div>
            </div>`;
        swiperContainer.innerHTML += template;
    });

    const nextButton = document.querySelector(".swiper-button-next");
    const prevButton = document.querySelector(".swiper-button-prev");

    if (nextButton && prevButton) {
        nextButton.addEventListener("click", () => swiper.slideNext());
        prevButton.addEventListener("click", () => swiper.slidePrev());
    }

    animateLoadingComplete();
});

function animateLoadingComplete() {
    const bar = document.querySelector(".loading__bar--inner");
    const counterNum = document.querySelector(".loading__counter--number");
    let c = 0;
    let barInterval = setInterval(() => {
        bar.style.width = c + "%";
        counterNum.innerText = c + "%";
        c++;
        if (c >= 100) {
            clearInterval(barInterval);
            gsap.to(".loading__bar", { duration: 5, rotate: "90deg", left: "1000%" });
            gsap.to(".loading__text, .loading__counter", { duration: 0.5, opacity: 0 });
            gsap.to(".loading__box", { duration: 1, height: "470px", borderRadius: "50%" });
            gsap.to(".loading__svg", { duration: 10, opacity: 1, rotate: "360deg" });
            gsap.to(".loading__box", { duration: 2, border: "none" });
            imagesLoaded(document.querySelectorAll('img'), () => {
                gsap.to(".loading", { delay: 2, duration: 2, zIndex: 1, background: "transparent", opacity: 0.5 });
                gsap.to(".loading__svg", { delay: 2, duration: 100, rotate: "360deg" });
                gsap.to("header", { duration: 1, delay: 2, top: "0" });
                gsap.to(".socials", { duration: 1, delay: 2.5, bottom: "10rem" });
                gsap.to(".scrollDown", { duration: 1, delay: 3, bottom: "3rem" });
                setTimeout(() => {
                    let options = {
                        damping: 0.1,
                        alwaysShowTracks: true,
                        plugins: {
                            disableScroll: { direction: 'x' },
                        },
                    };
                    let pageSmoothScroll = Scrollbar.init(document.body, options);
                    pageSmoothScroll.track.xAxis.element.remove();
                });
            });
        }
    }, 50);
}
const questions = [...document.querySelectorAll(".question")];
questions.map((question) => {
    let q_text = question.querySelector("h3");
    question.addEventListener("click", () => {
        questions.filter((q) => q !== question).map((q) => q.classList.remove('open'));
        question.classList.toggle("open");
    });
});

