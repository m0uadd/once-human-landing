// INITIALIZE LENIS (SMOOTH SCROLL)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// GET SCROLL TO Lenis
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Link Lenis to GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);

document.addEventListener('DOMContentLoaded', () => {

    // 1. PARTICLES INIT (tsParticles)
    loadParticles({
        id: "tsparticles",
        options: {
            preset: "stars",
            background: {
                color: "transparent"
            },
            particles: {
                color: {
                    value: ["#8B00FF", "#00FFFF", "#00FF88"]
                },
                number: {
                    value: 80,
                    density: { enable: true, value_area: 800 }
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: { enable: false }
                },
                move: {
                    enable: true,
                    speed: 0.5,
                    direction: "none",
                    random: true,
                    straight: false,
                    outModes: { default: "out" },
                    attract: { enable: false }
                }
            }
        }
    });

    // 2. HERO ANIMATIONS
    // Pin Hero
    ScrollTrigger.create({
        trigger: ".hero-section",
        start: "top top",
        end: "+=100%",
        pin: true,
        pinSpacing: false
    });

    // Parallax BG
    gsap.to(".hero-bg", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: 0.5
        }
    });

    // Scale title & Glow
    gsap.to(".hero-content .glitch-text", {
        scale: 1.2,
        textShadow: "0 0 30px #8B00FF",
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // 3. PROBLEM/SOLUTION CARDS REVEAL
    gsap.to(".stagger-card", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".problem-section",
            start: "top 70%",
        }
    });
    // Set initial state for cards
    gsap.set(".stagger-card", { y: 50, opacity: 0 });

    // 4. SOCIAL PROOF HORIZONTAL CAROUSEL
    const track = document.querySelector('.proof-track');
    
    let getScrollAmount = () => -(track.scrollWidth - window.innerWidth);
    
    gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
            trigger: ".proof-sticky-container",
            start: "center center",
            end: () => `+=${getScrollAmount() * -1}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true
        }
    });

    // Parallax inner images of horizontal scroll
    gsap.utils.toArray('.parallax-img').forEach(img => {
        gsap.to(img, {
            xPercent: 15,
            ease: "none",
            scrollTrigger: {
                trigger: ".proof-sticky-container",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // 5. FEATURES PARALLAX & EXPLODE
    gsap.set(".explode-item", { scale: 0.8, opacity: 0, y: 50 });
    
    ScrollTrigger.batch(".explode-item", {
        onEnter: batch => gsap.to(batch, { opacity: 1, scale: 1, y: 0, stagger: 0.15, overwrite: true, duration: 0.8, ease: "back.out(1.7)" }),
        start: "top 80%"
    });

    // Image Zoom on scroll internal
    gsap.utils.toArray('.zoom-img').forEach(img => {
        gsap.to(img, {
            scale: 1.15,
            scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // SVG Draw Stroke
    gsap.utils.toArray('.draw-stroke').forEach(svg => {
        const paths = svg.querySelectorAll('path');
        paths.forEach(path => {
            const length = path.getTotalLength();
            gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
            gsap.to(path, {
                strokeDashoffset: 0,
                duration: 2,
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: svg,
                    start: "top 85%",
                }
            });
        });
    });

    // 6. URGENCY SECTION
    ScrollTrigger.create({
        trigger: ".urgency-section",
        start: "center center",
        pin: true,
        end: "+=50%"
    });

    // Countdown mock logic
    let time = 14 * 60 + 59; // 14 mins 59
    const minEl = document.getElementById('minutes');
    const secEl = document.getElementById('seconds');
    
    setInterval(() => {
        if(time > 0) {
            time--;
            const mins = Math.floor(time / 60);
            const secs = time % 60;
            minEl.textContent = mins.toString().padStart(2, '0');
            secEl.textContent = secs.toString().padStart(2, '0');
        }
    }, 1000);

    // Confetti on hover/click CTA
    const downloadCta = document.getElementById('download-cta');
    downloadCta.addEventListener('mouseenter', () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.8 },
            colors: ['#8B00FF', '#00FFFF', '#00FF88']
        });
    });

    // 7. EXIT INTENT POPUP
    const exitPopup = document.getElementById('exit-popup');
    const closePopupBtn = document.querySelector('.close-popup');
    let popupShown = false;

    // Trigger on mouse leave window
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 0 && !popupShown) {
            exitPopup.classList.add('active');
            popupShown = true;
        }
    });

    closePopupBtn.addEventListener('click', () => {
        exitPopup.classList.remove('active');
    });

    // 8. FOOTER FADE-IN
    gsap.from(".fade-footer", {
        y: 100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: ".fade-footer",
            start: "top 90%"
        }
    });

});

// Helper wrapper for loading tsparticles async
async function loadParticles(options) {
    await tsParticles.load(options.id, options.options);
}
