/* Alexander Stefanov — alexanderstefanov.com
 * Progressive enhancement: every feature below is additive. If this file fails
 * to load, `index.html` still renders completely (see the .no-js/.js switch). */
(() => {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    /* --- Typing effect for the tagline ---
     * The full tagline ships in the HTML (so it is present for crawlers, screen
     * readers and no-JS visitors); here we rewind it and type it back in. */
    const initTypingEffect = () => {
        const typingElement = document.getElementById('typing-effect');
        const cursorElement = document.querySelector('.cursor');
        if (!typingElement) return;

        const textToType = typingElement.textContent.trim();
        if (prefersReducedMotion.matches || !textToType) return;

        const typingSpeed = 70;
        const initialDelay = 500;
        let charIndex = 0;

        typingElement.textContent = '';
        if (cursorElement) cursorElement.style.visibility = 'hidden';

        const type = () => {
            typingElement.textContent = textToType.slice(0, ++charIndex);
            if (charIndex < textToType.length) {
                window.setTimeout(type, typingSpeed);
            }
        };

        window.setTimeout(() => {
            if (cursorElement) cursorElement.style.visibility = '';
            type();
        }, initialDelay);
    };

    /* --- Reveal sections as they scroll into view --- */
    const initSectionReveals = () => {
        const targets = document.querySelectorAll('section[id], header#home');

        if (!('IntersectionObserver' in window)) {
            targets.forEach(el => el.classList.add('visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Reveal once; don't re-hide on scroll up.
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

        targets.forEach(el => observer.observe(el));
    };

    /* --- Sticky nav, smooth scrolling, active link --- */
    const initNavigation = () => {
        const stickyNav = document.querySelector('.sticky-nav');
        const headerElement = document.querySelector('header#home');
        const navLinks = Array.from(document.querySelectorAll('.nav-link'));
        const sections = Array.from(document.querySelectorAll('header[id], section[id]'));
        if (!navLinks.length || !sections.length) return;

        const navHeight = () => (stickyNav ? stickyNav.offsetHeight : 70);

        // Show the nav once the hero has scrolled away.
        const updateNavVisibility = () => {
            if (!stickyNav || !headerElement) return;
            const scrolledPastHero = headerElement.getBoundingClientRect().bottom <= 0;
            stickyNav.classList.toggle('visible', scrolledPastHero);
        };

        const scrollToTarget = (targetId) => {
            const target = document.querySelector(targetId);
            if (!target) return;

            // #home sits at the top of the document; anything else needs to clear the nav.
            const top = targetId === '#home'
                ? 0
                : target.getBoundingClientRect().top + window.pageYOffset - navHeight();

            window.scrollTo({
                top: Math.max(0, top),
                behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
            });
        };

        const setActiveLink = (sectionId) => {
            navLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${sectionId}`;
                link.classList.toggle('active', isActive);
                if (isActive) {
                    link.setAttribute('aria-current', 'true');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        };

        // The active section is the last one whose top has passed just under the nav.
        const updateActiveLink = () => {
            const scrollPosition = window.pageYOffset;
            const activationLine = scrollPosition + navHeight() + 20;
            const atBottom = (window.innerHeight + scrollPosition) >= document.documentElement.scrollHeight - 2;

            let activeId = sections[0].id;

            if (atBottom) {
                activeId = sections[sections.length - 1].id;
            } else {
                for (const section of sections) {
                    if (section.offsetTop <= activationLine) activeId = section.id;
                }
            }

            setActiveLink(activeId);
        };

        // --- Back to top ---
        const backToTop = document.getElementById('back-to-top');
        const updateBackToTop = () => {
            if (!backToTop) return;
            backToTop.classList.toggle('visible', window.pageYOffset > window.innerHeight);
        };

        // rAF-throttle so scroll handling stays on the browser's paint cadence.
        let ticking = false;
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(() => {
                updateActiveLink();
                updateNavVisibility();
                updateBackToTop();
                ticking = false;
            });
        };

        if (backToTop) {
            backToTop.addEventListener('click', () => {
                scrollToTarget('#home');
                // Hand focus back to the top of the document for keyboard users.
                const heading = document.getElementById('main-heading');
                if (heading) {
                    heading.setAttribute('tabindex', '-1');
                    heading.focus({ preventScroll: true });
                }
            });
        }

        document.querySelectorAll('a[href^="#"]:not([href="#"]):not(.skip-link)').forEach(link => {
            link.addEventListener('click', (event) => {
                const targetId = link.getAttribute('href');
                if (!document.querySelector(targetId)) return;
                event.preventDefault();
                scrollToTarget(targetId);
                if (history.replaceState) history.replaceState(null, '', targetId);
            });
        });

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });

        updateActiveLink();
        updateNavVisibility();
        updateBackToTop();

        // Re-align a deep link now that fonts/layout have settled.
        if (window.location.hash && document.querySelector(window.location.hash)) {
            window.setTimeout(() => scrollToTarget(window.location.hash), 120);
        }
    };

    /* --- Footer year --- */
    const initYear = () => {
        const year = document.getElementById('year');
        if (year) year.textContent = new Date().getFullYear();
    };

    const init = () => {
        initTypingEffect();
        initSectionReveals();
        initNavigation();
        initYear();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
