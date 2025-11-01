import React, { useEffect, useRef, useState } from 'react';
import './LandingPage.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { EarlyAccessModal } from './EarlyAccessModal';
import { Info } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, TextPlugin, MotionPathPlugin);

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { url: string };
    }
  }
}

import { SubscriptionModal } from './SubscriptionModal';

interface LandingPageProps {
  onSignInClick: () => void;
  onSubscribeClick: (plan: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSignInClick, onSubscribeClick }) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false);
  // showSubscriptionModal and currentPlan are now managed by onSubscribeClick

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ---------- HERO ANIMATION ---------- */
      const heroAnimationContainer = document.getElementById('hero-animation-container');
      if (heroAnimationContainer) {
          const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

          const createDiv = (className: string, innerHTML = '') => {
            const div = document.createElement('div');
            div.className = className;
            div.innerHTML = innerHTML;
            heroAnimationContainer.appendChild(div);
            return div;
        };

        const prompts = [
            'A stunning <span class="text-purple-300">blog visual</span> about AI...',
            'A compelling <span class="text-pink-300">infographic</span> about data...'
        ];
        
        const visuals = [
            {
                className: 'w-64 h-40 bg-gradient-to-br from-purple-500 to-indigo-600 flex flex-col items-center justify-center text-white p-4',
                innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-file-text mb-2 opacity-70" viewBox="0 0 16 16"><path d="M5 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm1.5 0a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5V2a.5.5 0 0 0-.5-.5h-13z"/><path d="M5 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/></svg><span class="font-semibold">Blog Visual</span>`
            },
            {
                className: 'w-40 h-64 bg-gradient-to-br from-pink-500 to-rose-600 flex flex-col items-center justify-center text-white p-4',
                innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-bar-chart-line mb-2 opacity-70" viewBox="0 0 16 16"><path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1V2zM2 13h2v-3a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v3zm4 0h2V7a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v6zm4 0h2V2a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v11z"/></svg><span class="font-semibold">Infographic</span>`
            }
        ];

        const promptEl = createDiv('absolute bg-gray-800/80 p-3 rounded-lg text-sm shadow-lg text-white');
        const visualEl = createDiv('absolute rounded-lg shadow-lg');

        gsap.set([promptEl, visualEl], { autoAlpha: 0, scale: 0.5 });

        function runAnimation(index: number) {
            const subTl = gsap.timeline();
            subTl.set(promptEl, { innerHTML: prompts[index] })
                 .fromTo(promptEl, { autoAlpha: 0, y: 20, scale: 0.8 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.7)' })
                 .set(visualEl, { 
                    className: 'absolute rounded-lg shadow-lg ' + visuals[index].className,
                    innerHTML: visuals[index].innerHTML
                 }, "+=0.5")
                 .to(promptEl, { autoAlpha: 0, y: -20, scale: 0.8, duration: 0.5, ease: 'power2.in' }, "<")
                 .fromTo(visualEl, { autoAlpha: 0, y: 20, scale: 0.8 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.7)' })
                 .to(visualEl, { autoAlpha: 0, y: -20, scale: 0.8, duration: 0.5, ease: 'power2.in' }, "+=2");
            return subTl;
        }

        tl.add(runAnimation(0))
          .add(runAnimation(1), "+=1");
      }


      /* ---------- UTILITY FUNCTIONS ---------- */
      const createPinningScrollTrigger = (trigger: any, pin: any, tl: any) => {
          ScrollTrigger.create({
              animation: tl,
              trigger,
              pin,
              start: "top top",
              end: "bottom bottom", 
              scrub: 1,
              onToggle: self => gsap.set(trigger, { zIndex: self.isActive ? 2 : 1 })
          });
      };

      /* ---------- HEADER / HERO ---------- */
      gsap.from('#main-header', { y: -100, duration: 1, ease: 'power3.out', delay: .5 });
      gsap.from('.hero-element', { y: 50, opacity: 0, stagger: .2, duration: 1, ease: 'power3.out', delay: .7 });

      /* ---------- PAIN-POINT SLIDER ---------- */
      const painSection = document.querySelector('#pain-point');
      if (painSection) {
          const slides = gsap.utils.toArray('.pain-point-slide') as HTMLElement[];
          const sticky = painSection.querySelector('.sticky-container');
          
          slides.forEach(slide => {
              const p = slide.querySelector('p');
              if (p && p.textContent) {
                  p.innerHTML = p.textContent.split(' ').map(w=>`<span class="word">${w}</span>`).join(' ');
              }
          });

          gsap.set(slides, { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' });
          gsap.set(slides, { autoAlpha: 0, y: 50 });
          gsap.set(slides[0], { autoAlpha: 1, y: 0 });

          const tl = gsap.timeline();
          slides.forEach((slide, i) => {
              const imgs = slide.querySelectorAll('img');
              const words = slide.querySelectorAll('.word');
              gsap.set(imgs, { scale: .8, autoAlpha: 0, rotation: () => gsap.utils.random(-10, 10) });
              gsap.set(words, { color: '#4A4A4A' });

              tl.to(slide, { autoAlpha: 1, y: 0, duration: 0.5 })
                .to(imgs, { scale: 1, autoAlpha: 1, rotation: 0, stagger: .1, duration: 0.7 })
                .to(words, { color: '#E0E0E0', stagger: .1, duration: 1 }, '-=0.5');

              if (i < slides.length - 1) {
                  tl.to(slide, { autoAlpha: 0, y: -50, duration: 0.5 }, "+=1");
              }
          });
          
          if (sticky) {
            createPinningScrollTrigger(painSection, sticky, tl);
          }
      }

      /* ---------- FEATURE ANIMATIONS ---------- */
      const createParticles = (containerId: string, color: string) => {
          const container = document.getElementById(containerId);
          if (!container) return;
          for (let i = 0; i < 20; i++) {
              const p = document.createElement('div');
              p.className = 'particle';
              p.style.background = color;
              container.appendChild(p);
              gsap.set(p, { x: gsap.utils.random(0, container.offsetWidth), y: gsap.utils.random(0, container.offsetHeight), scale: gsap.utils.random(.5, 1.2) });
              gsap.to(p, { y: '-=100', opacity: 0, duration: gsap.utils.random(3, 6), repeat: -1, delay: gsap.utils.random(0, 5), ease: 'power1.out' });
          }
      };
      createParticles('speed-particles', 'rgba(168, 85, 247, 0.6)');
      createParticles('solution-particles', 'rgba(59, 130, 246, 0.6)');
      createParticles('branding-particles', 'rgba(34, 197, 94, 0.6)');
      createParticles('bulk-particles', 'rgba(249, 115, 22, 0.6)');

      const animateSpeed = () => {
          const container = document.getElementById('speed-animation');
          if (!container) return;
          container.innerHTML = '';
          const taskListHTML = (id: string) => `<div id="${id}" class="w-28 space-y-2">${Array(4).fill('<div class="w-full h-4 bg-gray-700 rounded-sm"></div>').join('')}</div>`;
          container.innerHTML = `
              <div class="absolute text-center"><div class="font-bold text-purple-400 mb-2">AI</div>${taskListHTML('ai-tasks')}</div>
              <div class="absolute text-center"><div class="font-bold text-red-400 mb-2">HUMAN</div>${taskListHTML('human-tasks')}</div>
              <div class="absolute text-2xl font-black text-gray-400">VS</div>
          `;
          const [aiSide, humanSide, vs] = container.children as HTMLCollectionOf<HTMLElement>;
          gsap.set([aiSide, humanSide, vs], { left: '50%', top: '50%', xPercent: -50, yPercent: -50 });
          gsap.set(aiSide, { xPercent: -170 });
          gsap.set(humanSide, { xPercent: 70 });
          const humanTasks = document.querySelectorAll('#human-tasks > div');
          const aiTasks = document.querySelectorAll('#ai-tasks > div');
          const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
          tl.from([aiSide, humanSide, vs], { opacity: 0, scale: .8, stagger: .2, duration: .7 })
            .to(humanTasks, { backgroundColor: '#EF4444', duration: .6, stagger: .6, ease: 'power1.inOut' }, .5)
            .to(aiTasks, { backgroundColor: '#A855F7', duration: .2, stagger: .1, ease: 'power2.out' }, .5)
            .to([aiSide, humanSide, vs], { opacity: 0, duration: .5 }, '+=1')
            .set([...humanTasks, ...aiTasks], { backgroundColor: '#374151' });
      };
      animateSpeed();

      const animateSolutions = () => {
          const container = document.getElementById('solution-animation');
          if (!container) return;
          container.innerHTML = '';
          const morph = document.createElement('div');
          morph.className = 'absolute';
          const label = document.createElement('div');
          label.className = 'absolute text-center text-xs text-blue-300 font-mono';
          container.append(morph, label);
          gsap.set([morph, label], { left: '50%', top: '50%', xPercent: -50, yPercent: -50 });
          gsap.set(label, { y: '+=85px', width: '200px' });

          const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5, defaults: { duration: .8, ease: 'elastic.out(1, .75)' } });
          tl.addLabel('blog')
            .to(label, { duration: 1.2, text: { value: 'Generating blog visual...' }, ease: 'none' }, 'blog')
            .to(morph, {
                width: 120, height: 80,
                background: 'linear-gradient(135deg,#3B82F6,#60A5FA)',
                borderRadius: '8px',
                innerHTML: `<div class="w-full h-full p-2 flex flex-col gap-1"><div class="w-1/3 h-2 bg-white/50 rounded-full"></div><div class="w-full h-1 bg-white/30 rounded-full"></div><div class="w-full h-1 bg-white/30 rounded-full"></div><div class="w-3/4 h-1 bg-white/30 rounded-full"></div></div>`
            }, 'blog')
            .addLabel('infographic', '+=1.5')
            .to(label, { duration: 1.2, text: { value: 'Generating infographic for your content...' }, ease: 'none' }, 'infographic')
            .to(morph, {
                width: 80, height: 120,
                background: 'linear-gradient(135deg,#8B5CF6,#A78BFA)',
                innerHTML: `<div class="w-full h-full p-2 flex justify-around items-end gap-1"><div class="w-3 h-1/2 bg-white/50 rounded-t-sm"></div><div class="w-3 h-3/4 bg-white/50 rounded-t-sm"></div><div class="w-3 h-1/3 bg-white/50 rounded-t-sm"></div></div>`
            }, 'infographic')
            .to([morph, label], { opacity: 0, scale: .8, duration: .5, ease: 'power1.in' }, '+=1.5')
            .set(label, { text: '' });
      };
      animateSolutions();

      const animateBranding = () => {
          const container = document.getElementById('branding-animation');
          if (!container) return;
          const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5, onRepeat: () => { if(container) container.innerHTML = ''; setup(); } });

          function setup() {
              if (!container) return;
              const generic = `<div class="absolute w-28 h-32 bg-gray-700 border-2 border-gray-500 rounded-lg p-3 flex flex-col gap-2"><div class="w-1/2 h-4 bg-gray-500 rounded"></div><div class="w-full h-2 bg-gray-500 rounded"></div><div class="w-full h-2 bg-gray-500 rounded"></div><div class="w-3/4 h-2 bg-gray-500 rounded"></div></div>`;
              const brandKit = `<div class="absolute flex flex-col items-center gap-2"><div class="brand-logo w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">B</div><div class="brand-palette flex gap-1"><div class="w-4 h-4 rounded-full bg-emerald-500"></div><div class="w-4 h-4 rounded-full bg-blue-500"></div><div class="w-4 h-4 rounded-full bg-purple-500"></div></div></div>`;
              container.innerHTML = generic + brandKit;
              const [template, kit] = container.children as HTMLCollectionOf<HTMLElement>;
              gsap.set([template, kit], { left: '50%', top: '50%', xPercent: -50, yPercent: -50 });
              gsap.set(kit, { yPercent: -150 });

              tl.clear()
                .from([template, kit], { opacity: 0, scale: .8, stagger: .2, duration: .7, ease: 'back.out(1.7)' })
                .addLabel('merge', '+=.5')
                .to(kit, { yPercent: -50, scale: 0, opacity: 0, duration: .7, ease: 'back.in(1.7)' }, 'merge')
                .to(template, { borderColor: '#34D399', scale: 1.1, duration: .5 }, 'merge+=.2')
                .to(template.children, { backgroundColor: (i) => ['#10B981', '#3B82F6', '#3B82F6', '#8B5CF6'][i], stagger: .1, duration: .5 }, 'merge+=.2')
                .to(template, { scale: 1, duration: .5, ease: 'back.out(1.7)' })
                .to(template, { opacity: 0, scale: .8, duration: .5, ease: 'power1.in' }, '+=1.5');
          }
          setup();
      };
      animateBranding();

      const animateBulkOps = () => {
          const container = document.getElementById('bulk-animation');
          if (!container) return;
          container.innerHTML = '';
          const core = `<div class="absolute w-8 h-8 bg-orange-500 rounded-full shadow-lg z-10 flex items-center justify-center"><div class="w-4 h-4 bg-yellow-300 rounded-full"></div></div>`;
          container.innerHTML = core;
          const elCore = container.children[0] as HTMLElement;
          gsap.set(elCore, { left: '50%', top: '50%', xPercent: -50, yPercent: -50 });
          
          const grid = document.createElement('div');
          grid.className = 'absolute inset-0 grid grid-cols-6 gap-2 transform scale-90';
          const cards: HTMLElement[] = [];
          for (let i = 0; i < 30; i++) {
              const card = document.createElement('div');
              card.className = 'w-full h-full bg-gray-800 rounded-md';
              grid.appendChild(card);
              cards.push(card);
          }
          container.prepend(grid);

          const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
          tl.from(elCore, { scale: 0, rotate: -180, duration: .7, ease: 'back.out(1.7)' })
            .to(elCore.children[0], { scale: 0, repeat: 1, yoyo: true, duration: .4, ease: 'power1.inOut' }, '+=.2')
            .from(cards, { scale: 0, opacity: 0, stagger: { each: .02, from: 'center', grid: 'auto' }, duration: .6, ease: 'power2.out' }, '-=.3')
            .to(cards, { backgroundColor: () => `hsl(${gsap.utils.random(25, 55)}, 90%, 60%)`, stagger: { each: .02, from: 'random' }, duration: .5 }, '+=.2')
            .to(container, { scale: 1.1, duration: 1, ease: 'power1.inOut' }, '-=.5')
            .to(container, { opacity: 0, duration: .7, ease: 'power1.in' }, '+=1')
            .set(container, { scale: 1, opacity: 1 });
      };
      animateBulkOps();

      /* ---------- HOW IT WORKS ---------- */
      const howItWorksSection = document.querySelector('#how-it-works');
      if (howItWorksSection && window.innerWidth >= 1024) {
          const steps = gsap.utils.toArray('.how-it-works-step');
          const visuals = gsap.utils.toArray('.how-it-works-visual-highlight');

          steps.forEach((step, i) => {
              ScrollTrigger.create({
                  trigger: step as any,
                  start: 'top center',
                  end: 'bottom center',
                  onEnter: () => {
                      visuals.forEach((v: any) => v.classList.remove('active'));
                      if (visuals[i]) {
                          (visuals[i] as any).classList.add('active');
                      }
                  },
                  onEnterBack: () => {
                      visuals.forEach((v: any) => v.classList.remove('active'));
                      if (visuals[i]) {
                          (visuals[i] as any).classList.add('active');
                      }
                  }
              });
          });
      }
      
      /* ---------- IMAGE TYPES ---------- */
      const imageTypeBtns = document.querySelectorAll('.image-type-btn');
      if (imageTypeBtns.length > 0) {
          imageTypeBtns.forEach(btn => {
              btn.addEventListener('click', () => {
                  imageTypeBtns.forEach(b => {
                      b.classList.remove('border-purple-500', 'bg-purple-500/20');
                      b.classList.add('border-transparent');
                  });
                  btn.classList.add('border-purple-500', 'bg-purple-500/20');
                  btn.classList.remove('border-transparent');
              });
          });
      }
      
      setTimeout(() => {
          ScrollTrigger.refresh();
      }, 500);
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="antialiased">
      <header id="main-header" className="fixed top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-20">
                  <div className="flex-shrink-0">
                      <a href="#" className="text-2xl font-bold text-white">ImageGen</a>
                  </div>
                  <div className="hidden md:block">
                      <a href="#" onClick={(e) => { e.preventDefault(); onSignInClick(); }} className="cta-button inline-block text-white font-bold text-sm px-6 py-2 rounded-full shadow-lg">Sign In</a>
                  </div>
              </div>
          </div>
      </header>

      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden p-4 gradient-bg">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-20">
              <div className="text-center md:text-left">
                  <h1 className="hero-element text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-white">
                      <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">AI Image Generator</span>
                  </h1>
                  <p className="hero-element text-lg md:text-xl max-w-3xl mx-auto md:mx-0 text-gray-300 mb-6">Create stunning blog featured images and infographics with the power of AI.</p>
                  
                  <div className="hero-element flex flex-wrap justify-center md:justify-start gap-4 mb-8 text-sm">
                      <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-shield-check text-green-400" viewBox="0 0 16 16"><path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.06.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.007 8 1.007c-.531 0-1.552.283-2.662.583zM8.354 10.354l-3-3a.5.5 0 0 1 .708-.708L7.5 8.793l2.646-2.647a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0z"/></svg>Powered by SEO Engine</span>
                      <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-image-plus text-blue-400" viewBox="0 0 16 16"><path d="M16 8c0 3.866-3.134 7-7 7-3.865 0-7-3.134-7-7 0-3.866 3.135-7 7-7 3.866 0 7 3.134 7 7ZM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3Z"/><path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 12.5v-9Zm1.5-1a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-9Z"/></svg>Add Custom Images</span>
                      <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-stack text-orange-400" viewBox="0 0 16 16"><path d="M1.5 1.637a.5.5 0 0 1 .408-.188l5.5-2.5a.5.5 0 0 1 .176 0l5.5 2.5a.5.5 0 0 1 .408.188l2.5 5.5a.5.5 0 0 1-.188.408l-2.5 5.5a.5.5 0 0 1-.408.188l-5.5 2.5a.5.5 0 0 1-.176 0l-5.5-2.5a.5.5 0 0 1-.408-.188l-2.5-5.5a.5.5 0 0 1 .188-.408l2.5-5.5zM2.48 7.373 4.5 11.5h7l2.02-4.127L8 4.873 2.48 7.373z"/></svg>Bulk Generation</span>
                  </div>
                  
                  <div className="hero-element grid grid-cols-3 gap-4 text-center mb-8">
                      <div>
                          <p className="text-3xl font-bold">10K+</p>
                          <p className="text-sm text-gray-400">Images Generated</p>
                      </div>
                      <div>
                          <p className="text-3xl font-bold">99.9%</p>
                          <p className="text-sm text-gray-400">Uptime</p>
                      </div>
                      <div>
                          <p className="text-3xl font-bold">30s</p>
                          <p className="text-sm text-gray-400">Avg Generation</p>
                      </div>
                  </div>

                  <div className="hero-element flex flex-col items-center md:items-start">
                      <a href="#" onClick={(e) => { e.preventDefault(); onSignInClick(); }} className="cta-button inline-block text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg">Create your free account</a>
                       <div className="mt-3 text-center">
                          <p className="text-white font-semibold">Get 100 Free Credits</p>
                          <p className="text-sm text-gray-400">No credit card required.</p>
                      </div>
                  </div>
              </div>
              <div className="hidden md:block">
                  <div id="hero-animation-container" className="w-full h-full relative glass-card rounded-2xl p-4 overflow-hidden">
                  </div>
              </div>
          </div>
      </section>

      <section className="ticker-wrap">
          <div className="ticker">
              <div className="ticker-item">INSTANT INFOGRAPHICS</div><div className="ticker-item">●</div>
              <div className="ticker-item">BLOG IMAGES IN SECONDS</div><div className="ticker-item">●</div>
              <div className="ticker-item">AI-POWERED CREATIVITY</div><div className="ticker-item">●</div>
              <div className="ticker-item">NO DESIGN SKILLS NEEDED</div><div className="ticker-item">●</div>
              <div className="ticker-item">INSTANT INFOGRAPHICS</div><div className="ticker-item">●</div>
              <div className="ticker-item">BLOG IMAGES IN SECONDS</div><div className="ticker-item">●</div>
              <div className="ticker-item">AI-POWERED CREATIVITY</div><div className="ticker-item">●</div>
              <div className="ticker-item">NO DESIGN SKILLS NEEDED</div><div className="ticker-item">●</div>
          </div>
      </section>

      <section id="pain-point" className="relative h-[300vh]">
          <div className="sticky-container sticky top-0 h-screen overflow-hidden">
              <div className="pain-point-slider-wrapper relative h-full w-full">
                  <div className="pain-point-slide">
                      <div className="text-content text-4xl md:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto text-center"><p>Stop waiting on designers.</p></div>
                      <div className="image-container">
                          <img src="https://images.unsplash.com/photo-1516116216624-53e697320f64?q=80&w=800&auto=format&fit=crop" className="w-48 h-64" style={{top:'15%',left:'10%'}} onError={(e: any) => {e.target.onerror = null; e.target.src='https://placehold.co/192x256/111827/E5E7EB?text=Image+1'}} />
                          <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726a?q=80&w=800&auto=format&fit=crop" className="w-64 h-48" style={{bottom:'20%',left:'25%'}} onError={(e: any) => {e.target.onerror = null; e.target.src='https://placehold.co/256x192/111827/E5E7EB?text=Image+2'}} />
                          <img src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=800&auto=format&fit=crop" className="w-40 h-56" style={{top:'20%',right:'15%'}} onError={(e: any) => {e.target.onerror = null; e.target.src='https://placehold.co/160x224/111827/E5E7EB?text=Image+3'}} />
                          <img src="https://images.unsplash.com/photo-1614850523011-8f49ffc73908?q=80&w=800&auto=format&fit=crop" className="w-56 h-40" style={{bottom:'15%',right:'18%'}} onError={(e: any) => {e.target.onerror = null; e.target.src='https://placehold.co/224x160/111827/E5E7EB?text=Image+4'}} />
                      </div>
                  </div>
                  <div className="pain-point-slide">
                      <div className="text-content text-4xl md:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto text-center"><p>Stop spending hours on complex tools.</p></div>
                      <div className="image-container">
                          <img src="https://images.unsplash.com/photo-1535378620166-273708d44e4c?q=80&w=800&auto=format&fit=crop" className="w-56 h-32" style={{top:'25%',right:'15%'}} onError={(e: any) => {e.target.onerror = null; e.target.src='https://placehold.co/224x128/111827/E5E7EB?text=Image+5'}} />
                          <img src="https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=800&auto=format&fit=crop" className="w-32 h-48" style={{bottom:'50%',left:'10%'}} onError={(e: any) => {e.target.onerror = null; e.target.src='https://placehold.co/128x192/111827/E5E7EB?text=Image+6'}} />
                          <img src="https://images.unsplash.com/photo-1587440871875-191322ee64b0?q=80&w=800&auto=format&fit=crop" className="w-48 h-32" style={{top:'15%',left:'30%'}} onError={(e: any) => {e.target.onerror = null; e.target.src='https://placehold.co/192x128/111827/E5E7EB?text=Image+7'}} />
                          <img src="https://images.unsplash.com/photo-1496065187959-7f07b8353c55?q=80&w=800&auto=format&fit=crop" className="w-40 h-56" style={{bottom:'10%',right:'40%'}} onError={(e: any) => {e.target.onerror = null; e.target.src='https://placehold.co/160x224/111827/E5E7EB?text=Image+8'}} />
                      </div>
                  </div>
                  <div className="pain-point-slide">
                      <div className="text-content text-4xl md:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto text-center"><p>Create professional visuals in 30 seconds.</p></div>
                      <div className="image-container">
                          <img src="https://images.unsplash.com/photo-1633114128174-2f8aa49759b0?q=80&w=800&auto=format&fit=crop" className="w-48 h-64" style={{top:'10%',left:'20%'}} onError={(e: any) => {e.target.onerror = null; e.target.src='https://placehold.co/192x256/111827/E5E7EB?text=Image+9'}} />
                          <img src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop" className="w-64 h-48" style={{bottom:'15%',left:'15%'}} onError={(e: any) => {e.target.onerror = null; e.target.src='https://placehold.co/256x192/111827/E5E7EB?text=Image+10'}} />
                          <img src="https://images.unsplash.com/photo-1611926653458-092a42e8ab05?q=80&w=800&auto=format&fit=crop" className="w-40 h-56" style={{top:'15%',right:'10%'}} onError={(e: any) => {e.target.onerror = null; e.target.src='https://placehold.co/160x224/111827/E5E7EB?text=Image+11'}} />
                          <img src="https://images.unsplash.com/photo-1611262588024-d12430b98920?q=80&w=800&auto=format&fit=crop" className="w-56 h-40" style={{bottom:'25%',right:'20%'}} onError={(e: any) => {e.target.onerror = null; e.target.src='https://placehold.co/224x160/111827/E5E7EB?text=Image+12'}} />
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <section id="features" className="py-20 md:py-32 px-4">
          <div className="max-w-7xl mx-auto">
              <h1 className="text-center text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-16 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                  Feature Animations
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="feature-card glass-card rounded-2xl p-6 flex flex-col hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
                      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                          <span className="text-purple-400">⚡</span>AI Powered Image Gen Speed
                      </h3>
                      <p className="text-gray-300 mb-4">Drastically reduce time and cost with lightning-fast generation.</p>
                      <div className="animation-container bg-gradient-to-br from-black/40 to-purple-900/20 rounded-lg p-4 mt-auto flex justify-center items-center relative">
                          <div className="floating-particles" id="speed-particles"></div>
                          <div id="speed-animation" className="w-full h-full relative"></div>
                      </div>
                  </div>
                  <div className="feature-card glass-card rounded-2xl p-6 flex flex-col hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
                      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                          <span className="text-blue-400">🎨</span>Custom Solution For All Needs
                      </h3>
                      <p className="text-gray-300 mb-4">Adaptive designs that transform for every purpose.</p>
                      <div className="animation-container bg-gradient-to-br from-black/40 to-blue-900/20 rounded-lg p-4 mt-auto flex justify-center items-center relative">
                          <div className="floating-particles" id="solution-particles"></div>
                          <div id="solution-animation" className="w-full h-full relative"></div>
                      </div>
                  </div>
                  <div className="feature-card glass-card rounded-2xl p-6 flex flex-col hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300">
                      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                          <span className="text-emerald-400">🧬</span>Add Your Personal Branding
                      </h3>
                      <p className="text-gray-300 mb-4">Seamlessly infuse your brand DNA into every creation.</p>
                      <div className="animation-container bg-gradient-to-br from-black/40 to-emerald-900/20 rounded-lg p-4 mt-auto flex justify-center items-center relative">
                          <div className="floating-particles" id="branding-particles"></div>
                          <div id="branding-animation" className="w-full h-full relative"></div>
                      </div>
                  </div>
                  <div className="feature-card glass-card rounded-2xl p-6 flex flex-col hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300">
                      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                          <span className="text-orange-400">🚀</span>Very Scalable Bulk Operations
                      </h3>
                      <p className="text-gray-300 mb-4">Quantum-scale generation that multiplies your productivity.</p>
                      <div className="animation-container bg-gradient-to-br from-black/40 to-orange-900/20 rounded-lg p-4 mt-auto flex justify-center items-center relative">
                          <div className="floating-particles" id="bulk-particles"></div>
                          <div id="bulk-animation" className="w-full h-full relative"></div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <section id="image-types" className="py-20 md:py-32 px-4">
          <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Two Powerful Tools in One</h2>
                  <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-300">Whether you need a stunning hero image for your next article or a compelling infographic for social media, we've got you covered.</p>
              </div>
              <div className="glass-card rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-1/2 h-80 bg-black/30 rounded-lg relative spline-wrapper">
                      <spline-viewer url="https://prod.spline.design/p64LwBwd47KRBIFj/scene.splinecode"></spline-viewer>
                  </div>
                  <div className="w-full md:w-1/2">
                      <div id="image-types-controls" className="flex flex-col gap-4">
                          <button data-type="blog" className="image-type-btn text-left p-4 rounded-lg border border-purple-500 bg-purple-500/20">
                              <h4 className="text-xl font-bold text-white">Blog Visuals</h4>
                              <p className="text-gray-300 mt-1">Create stunning header images and in-article visuals that perfectly match your content.</p>
                          </button>
                          <button data-type="infographic" className="image-type-btn text-left p-4 rounded-lg border border-transparent hover:border-purple-500 transition">
                              <h4 className="text-xl font-bold text-white">Infographics</h4>
                              <p className="text-gray-300 mt-1">Turn complex data into beautiful, shareable infographics that are easy to understand.</p>
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <section id="how-it-works" className="py-20 md:py-32 px-4">
          <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Three Steps to Perfection</h2>
                  <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-gray-300">Our process is designed for speed and simplicity. Go from idea to finished asset in under a minute.</p>
              </div>
              <div className="how-it-works-grid grid grid-cols-1 lg:grid-cols-2 gap-16 relative">
                  <div className="how-it-works-steps-wrapper h-full">
                      <div className="how-it-works-steps space-y-32">
                          <div className="how-it-works-step">
                              <span className="text-purple-400 font-bold">Step 1</span>
                              <h3 className="text-3xl font-bold text-white mt-2 mb-4">Describe Your Image</h3>
                              <p className="text-gray-300">Start with a simple or detailed text prompt. The more detail you provide, the better the result. Think about the subject, style, colors, and mood.</p>
                          </div>
                          <div className="how-it-works-step">
                              <span className="text-purple-400 font-bold">Step 2</span>
                              <h3 className="text-3xl font-bold text-white mt-2 mb-4">Select a Style</h3>
                              <p className="text-gray-300">Choose from options like Photorealistic, 3D Render, Flat Graphic, or Infographic to guide the AI. This ensures the output matches your brand's aesthetic.</p>
                          </div>
                          <div className="how-it-works-step">
                              <span className="text-purple-400 font-bold">Step 3</span>
                              <h3 className="text-3xl font-bold text-white mt-2 mb-4">Generate & Refine</h3>
                              <p className="text-gray-300">Click generate and receive multiple options in seconds. Tweak your prompt or settings to get the perfect image for your content.</p>
                          </div>
                      </div>
                  </div>
                  <div className="sticky-visual sticky top-32 h-[500px] hidden lg:block">
                      <div className="glass-card rounded-2xl p-6 h-full flex flex-col justify-center space-y-4">
                          <div id="visual-step-1" className="how-it-works-visual-highlight bg-black/30 rounded-lg p-4">
                              <label className="text-sm font-medium text-gray-400">Your Prompt</label>
                              <div className="mt-2 bg-gray-800 rounded-md p-3 text-gray-200">A stunning blog visual about the future of AI...</div>
                          </div>
                          <div id="visual-step-2" className="how-it-works-visual-highlight bg-black/30 rounded-lg p-4">
                              <label className="text-sm font-medium text-gray-400">Style</label>
                              <div className="mt-2 flex flex-wrap gap-2">
                                  <span className="bg-gray-700 text-white text-sm font-medium px-3 py-1 rounded-full">Photorealistic</span>
                                  <span className="bg-purple-500/50 text-purple-200 ring-2 ring-purple-400 text-sm font-medium px-3 py-1 rounded-full">3D Render</span>
                                  <span className="bg-gray-700 text-white text-sm font-medium px-3 py-1 rounded-full">Infographic</span>
                              </div>
                          </div>
                          <div id="visual-step-3" className="how-it-works-visual-highlight bg-black/30 rounded-lg p-4">
                              <a href="#" className="w-full cta-button inline-block text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg text-center">Generate</a>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <section id="pricing" className="py-20 md:py-32 px-4">
          <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Simple, Transparent Pricing</h2>
                  <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-300">Choose the plan that's right for you. No hidden fees.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Pricing Card 1 */}
                  <div className="glass-card rounded-2xl p-8 flex flex-col items-center text-center border border-purple-500/30 shadow-lg">
                      <h3 className="text-2xl font-bold text-white mb-4">Graphic Intern AI</h3>
                      <p className="text-5xl font-extrabold text-white mb-6">₹5,000<span className="text-lg font-medium text-gray-400">/month</span></p>
                      <ul className="text-gray-300 text-left space-y-3 mb-8">
                          <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle-fill text-green-400 mr-2" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02L11.03 6.97a.75.75 0 0 0-.02-1.08z"/></svg>300 Credits</li>
                          <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle-fill text-green-400 mr-2" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02L11.03 6.97a.75.75 0 0 0-.02-1.08z"/></svg>Blog Image Generation</li>
                          <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle-fill text-green-400 mr-2" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02L11.03 6.97a.75.75 0 0 0-.02-1.08z"/></svg>Image Generation with Custom Images</li>
                          <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle-fill text-green-400 mr-2" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02L11.03 6.97a.75.75 0 0 0-.02-1.08z"/></svg>Infographic Generation</li>
                          <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle-fill text-green-400 mr-2" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02L11.03 6.97a.75.75 0 0 0-.02-1.08z"/></svg>Basic Support</li>
                      </ul>
                      <a href="#" onClick={(e) => { e.preventDefault(); onSubscribeClick('Graphic Intern AI'); }} className="mt-8 w-full text-center cta-button inline-block text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg">Subscribe Now</a>
                  </div>
                  {/* Pricing Card 2 (Pro) */}
                  <div className="glass-card rounded-2xl p-8 flex flex-col items-center text-center neon-border relative overflow-hidden">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-full bg-blue-600 text-white text-xs font-bold py-1 text-center transform -rotate-45 origin-top-left -translate-x-1/4 -translate-y-1/2">
                          MOST POPULAR
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">Graphic Designer Expert</h3>
                      <p className="text-5xl font-extrabold text-white mb-6">₹7,500<span className="text-lg font-medium text-gray-400">/month</span></p>
                      <ul className="text-gray-300 text-left space-y-3 mb-8">
                          <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle-fill text-green-400 mr-2" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02L11.03 6.97a.75.75 0 0 0-.02-1.08z"/></svg>600 Credits</li>
                          <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle-fill text-green-400 mr-2" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02L11.03 6.97a.75.75 0 0 0-.02-1.08z"/></svg>Blog Image Generation</li>
                          <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle-fill text-green-400 mr-2" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02L11.03 6.97a.75.75 0 0 0-.02-1.08z"/></svg>Image Generation with Custom Images</li>
                          <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle-fill text-green-400 mr-2" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02L11.03 6.97a.75.75 0 0 0-.02-1.08z"/></svg>Basic Support</li>
                      </ul>
                      <a href="#" onClick={(e) => { e.preventDefault(); onSubscribeClick('Graphic Designer Expert'); }} className="mt-8 w-full text-center cta-button inline-block text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg">Subscribe Now</a>
                  </div>
                  {/* Pricing Card 3 */}
                  <div className="glass-card rounded-2xl p-8 flex flex-col items-center text-center border border-emerald-500/30 shadow-lg">
                      <h3 className="text-2xl font-bold text-white mb-4">Whole Graphic Team!</h3>
                      <p className="text-5xl font-extrabold text-white mb-6">₹12,500<span className="text-lg font-medium text-gray-400">/month</span></p>
                      <ul className="text-gray-300 text-left space-y-3 mb-8">
                          <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle-fill text-green-400 mr-2" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02L11.03 6.97a.75.75 0 0 0-.02-1.08z"/></svg>1200 Credits</li>
                          <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle-fill text-green-400 mr-2" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02L11.03 6.97a.75.75 0 0 0-.02-1.08z"/></svg>Blog Image Generation</li>
                          <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle-fill text-green-400 mr-2" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02L11.03 6.97a.75.75 0 0 0-.02-1.08z"/></svg>Image Generation with Custom Images</li>
                          <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle-fill text-green-400 mr-2" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02L11.03 6.97a.75.75 0 0 0-.02-1.08z"/></svg>Infographics Generation</li>
                          <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle-fill text-green-400 mr-2" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02L11.03 6.97a.75.75 0 0 0-.02-1.08z"/></svg>Dedicated Support</li>
                          <li className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle-fill text-green-400 mr-2" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02L11.03 6.97a.75.75 0 0 0-.02-1.08z"/></svg>
                            <span>Early Access to Upcoming Features</span>
                            <span
                              className="ml-2 cursor-pointer"
                              onClick={() => setShowEarlyAccessModal(true)}
                              title="Click to see upcoming features"
                            >
                              <Info className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                            </span>
                          </li>
                      </ul>
                      <a href="#" onClick={(e) => { e.preventDefault(); onSubscribeClick('Whole Graphic Team!'); }} className="mt-8 w-full text-center cta-button inline-block text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg">Subscribe Now</a>
                  </div>
              </div>
          </div>
      </section>

      <EarlyAccessModal
        isOpen={showEarlyAccessModal}
        onClose={() => setShowEarlyAccessModal(false)}
      />

      <footer className="bg-black/50 border-t border-white/10 py-12 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
              <div>
                  <h3 className="text-2xl font-bold text-white">ImageGen</h3>
                  <p className="text-gray-400 mt-2">Your Vision, Instantly Visualized.</p>
              </div>
              <div className="flex space-x-6 mt-8 md:mt-0">
                  <a href="#" className="text-gray-400 hover:text-white transition">Terms</a>
                  <a href="#" className="text-gray-400 hover:text-white transition">Privacy</a>
                  <a href="#" className="text-gray-400 hover:text-white transition">Contact</a>
              </div>
          </div>
          <div className="text-center text-gray-500 mt-12 border-t border-white/10 pt-8">&copy; 2024 ImageGen. All Rights Reserved.</div>
      </footer>
    </div>
  );
};
