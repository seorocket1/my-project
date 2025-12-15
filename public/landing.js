document.addEventListener("DOMContentLoaded", function() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section Animation
    gsap.from(".hero-content h1", {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: "power3.out",
        delay: 0.5
    });
    gsap.from(".hero-content p", {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: "power3.out",
        delay: 0.8
    });
    gsap.from(".cta-button", {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: "power3.out",
        delay: 1.1
    });

    // Features Section Animation
    gsap.from(".feature-text h2", {
        scrollTrigger: ".features",
        duration: 1,
        x: -50,
        opacity: 0,
        ease: "power3.out"
    });
    gsap.from(".feature-text p", {
        scrollTrigger: ".features",
        duration: 1,
        x: -50,
        opacity: 0,
        ease: "power3.out",
        delay: 0.3
    });
    gsap.from(".feature-text ul li", {
        scrollTrigger: ".features",
        duration: 1,
        x: -50,
        opacity: 0,
        ease: "power3.out",
        stagger: 0.2,
        delay: 0.5
    });
    gsap.from(".feature-3d", {
        scrollTrigger: ".features",
        duration: 1,
        x: 50,
        opacity: 0,
        ease: "power3.out"
    });

    // USPs Section Animation
    gsap.from(".usp", {
        scrollTrigger: ".usps",
        duration: 1,
        y: 50,
        opacity: 0,
        ease: "power3.out",
        stagger: 0.3
    });

    // How It Works Section Animation
    gsap.from(".how-it-works h2", {
        scrollTrigger: ".how-it-works",
        duration: 1,
        y: 50,
        opacity: 0,
        ease: "power3.out"
    });
    gsap.from(".step", {
        scrollTrigger: ".how-it-works",
        duration: 1,
        y: 50,
        opacity: 0,
        ease: "power3.out",
        stagger: 0.3
    });

    // Final CTA Section Animation
    gsap.from(".final-cta h2", {
        scrollTrigger: ".final-cta",
        duration: 1,
        y: 50,
        opacity: 0,
        ease: "power3.out"
    });
    gsap.from(".final-cta .cta-button", {
        scrollTrigger: ".final-cta",
        duration: 1,
        y: 50,
        opacity: 0,
        ease: "power3.out",
        delay: 0.3
    });
});
