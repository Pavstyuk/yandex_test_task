document.addEventListener('DOMContentLoaded', () => {

    console.log('Script Ready');

    // Just for fun moving figures on header section with moving mouse cursor

    let winX = window.innerWidth * 0.5;
    let winY = window.innerHeight * 0.5;

    window.addEventListener('resize', () => {
        winX = window.innerWidth * 0.5;
        winY = window.innerHeight * 0.5;
        console.log('Resized');
        if (window.innerWidth <= 768) {
            buildStepsSlider();
            console.log(`Screen Width: ${window.innerWidth}px`);
        }
    });

    document.addEventListener('mousemove', (e) => {
        Object.assign(document.documentElement, {
            style: `--move_x: ${(e.clientX - winX) * -0.05}px; --move_y: ${(e.clientY - winY) * 0.05}px;`
        });
    });


    // Build members card using native HTML instrument <template>

    const memberWrapper = document.getElementById('cards-group');
    const cardTemplate = document.getElementById('card-template');

    // Take data about members from json file

    fetch('./data/members.json')
        .then((response) => response.json())
        .then((data) => {

            generateCards(data);
        })
        .catch((err) => {
            console.log(err);
            memberWrapper.textContent = "Участники не турнира - приятный сюрприз для ценителей шахмат!"

        });

    const generateCards = (members) => {
        console.log(members);

        members.forEach((member) => {
            let newCard = cardTemplate.content.cloneNode(true);

            newCard.querySelector('.card-photo').src = member.photo;
            newCard.querySelector('.card-photo').setAttribute("alt", member.name);
            newCard.querySelector('.card-name').textContent = member.name;
            newCard.querySelector('.card-desc').textContent = member.desc;
            newCard.querySelector('.card-button').href = member.link;

            memberWrapper.append(newCard);
        });

        gettingSlider();
    }

    // Building Slider Members Section. Only after members's cards ready

    const gettingSlider = () => {

        const sliderWrapper = document.querySelector('.slider-wrapper');
        let switchPrev = sliderWrapper.querySelector('.switch-prev');
        let switchNext = sliderWrapper.querySelector('.switch-next');
        let currentSlide = sliderWrapper.querySelector('.current');
        let totalSlide = sliderWrapper.querySelector('.total');
        let slidesGroup = sliderWrapper.querySelector('.slides-group');
        let slides = sliderWrapper.querySelectorAll('.slide-item');

        let currentWidth = slidesGroup.offsetWidth;
        let delta = slides[0].offsetWidth;
        let slidesInView = Math.round(currentWidth / delta);

        window.addEventListener('resize', () => {
            currentWidth = slidesGroup.offsetWidth;
            delta = slides[0].offsetWidth;
            slidesInView = Math.round(currentWidth / delta);
        });

        totalSlide.textContent = slides.length;
        currentSlide.textContent = slidesInView;

        currentDelta = 0;

        switchNext.addEventListener('click', (e) => {
            e.preventDefault();

            clearInterval(interval);

            slidesInView++;
            currentSlide.textContent = slidesInView;
            currentDelta = currentDelta - delta;
            if (slidesInView <= slides.length) {
                slidesGroup.style.transform = `translate3d(${currentDelta}px,0,0)`;
            } else {
                currentDelta = 0;
                slidesInView = Math.round(currentWidth / delta);
                currentSlide.textContent = slidesInView;
                slidesGroup.style.transform = `translate3d(${currentDelta}px,0,0)`
            }
            restartTime();
        });

        switchPrev.addEventListener('click', (e) => {
            e.preventDefault();

            clearInterval(interval);

            slidesInView--;
            currentSlide.textContent = slidesInView;
            currentDelta = currentDelta + delta;

            if (slidesInView > 1) {
                slidesGroup.style.transform = `translate3d(${currentDelta}px,0,0)`;
            } else {
                currentDelta = -delta * (slides.length - Math.round(currentWidth / delta));
                slidesInView = slides.length;
                currentSlide.textContent = slidesInView;
                slidesGroup.style.transform = `translate3d(${currentDelta}px,0,0)`;
            }

            restartTime();
        });

        let interval = setInterval(() => { switchNext.click(); }, 4000);

        const restartTime = () => {
            interval = setInterval(() => { switchNext.click(); }, 4000);
        }

    }

    // Building Slider for Steps Section. It should be in mobile version only

    const buildStepsSlider = () => {
        const stepsSlider = document.querySelector('.steps-slider');
        const stepsContainer = stepsSlider.querySelector('.steps-system');
        const steps = stepsContainer.querySelectorAll('.step');
        const switchPrev = stepsSlider.querySelector('.switch-prev');
        const switchNext = stepsSlider.querySelector('.switch-next');
        const switcher = stepsSlider.querySelector('.switch-bullet');
        const bullets = switcher.querySelectorAll('i');

        let currentDelta = 0;


        let delta = steps[0].offsetWidth;
        let count = 1;

        switchPrev.disabled = true;

        switchNext.addEventListener('click', (e) => {
            e.preventDefault();

            count++;
            currentDelta = currentDelta - delta - 24;

            stepsContainer.style.transform = `translate3d(${currentDelta}px,0,0)`

            checkButtons(count);

        });

        switchPrev.addEventListener('click', (e) => {
            e.preventDefault();

            count--;
            currentDelta = currentDelta + delta + 24; // 24px it's a gap between steps cards

            stepsContainer.style.transform = `translate3d(${currentDelta}px,0,0)`;

            checkButtons(count);

        });

        const checkButtons = (count) => {
            if (count === 5) {
                switchNext.disabled = true;
            } else if (count === 1) {
                switchPrev.disabled = true;
            } else {
                switchNext.disabled = false;
                switchPrev.disabled = false;
            }

            bullets.forEach((bullet, i) => {
                if (i === (count - 1)) {
                    bullet.classList.add('active');
                } else {
                    bullet.classList.remove('active');
                }
            });
        }
    }

    if (window.innerWidth <= 768) {
        buildStepsSlider();
    }

});