document.addEventListener('DOMContentLoaded', () => {

    // --- Typing Effect for Tagline ---
    const typingElement = document.getElementById('typing-effect');
    const cursorElement = document.querySelector('.cursor');
    const textToType = "Data Engineer | Cloud Architect | AI Enthusiast";
    let charIndex = 0;
    const typingSpeed = 70; // Milliseconds per character
    const initialDelay = 500; // Delay before starting

    function type() {
        if (charIndex < textToType.length && typingElement) {
            typingElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else if (cursorElement) {
            // Ensure cursor continues blinking after typing is done
            cursorElement.style.animation = 'blink 1s step-end infinite';
        }
    }

    if (cursorElement) {
        cursorElement.style.display = 'none'; // Hide cursor initially
    }

    if (typingElement) {
        setTimeout(() => {
            if (cursorElement) {
                cursorElement.style.display = 'inline-block'; // Make cursor visible
            }
            type();
        }, initialDelay);
    }

    // --- Intersection Observer for general section fade-in animations ---
    const sectionFadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // sectionFadeInObserver.unobserve(entry.target); // Optional: unobserve after first time
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    // Observe all <section> elements and the <header> for fade-in
    document.querySelectorAll('section[id], header#home').forEach(el => {
        sectionFadeInObserver.observe(el);
    });


    // --- Sticky navigation visibility ---
    const stickyNav = document.querySelector('.sticky-nav');
    const headerElement = document.querySelector('header#home');

    if (stickyNav && headerElement) {
        const headerObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    // Show nav when header is NOT intersecting AND its bottom is above viewport top
                    if (!entry.isIntersecting && entry.boundingClientRect.bottom < 0) {
                        stickyNav.classList.add('visible');
                    } else {
                        stickyNav.classList.remove('visible');
                    }
                });
            },
            { threshold: 0 } // Trigger when any part of header (top/bottom) crosses viewport edge
        );
        headerObserver.observe(headerElement);
    }

    // --- Smooth scrolling & Active Nav Link ---
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollTrackedSections = Array.from(document.querySelectorAll('header[id], section[id]'));
    const ctaButton = document.querySelector('.cta-button[href="#connect"]');

    const getEffectiveNavHeight = () => (stickyNav ? stickyNav.offsetHeight : 70); // Use actual height or fallback

    function smoothScrollToTarget(targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navOffset = getEffectiveNavHeight();
            // For #home, we might not want an offset if the nav isn't sticky yet.
            // However, scroll-padding-top in CSS handles the final resting spot.
            // The JS scroll should aim for that spot.
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            smoothScrollToTarget(targetId);
        });
    });

    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = ctaButton.getAttribute('href');
            smoothScrollToTarget(targetId);
        });
    }

    // Active nav link highlighting on scroll
    function updateActiveLink() {
        const scrollPosition = window.pageYOffset;
        // This offset determines how early a section is considered "active" when scrolling down.
        // It should be slightly more than nav height to activate when section top passes under nav.
        const activationOffset = getEffectiveNavHeight() + 20; // 20px buffer

        let newActiveSectionId = null;

        scrollTrackedSections.forEach(section => {
            const sectionTop = section.offsetTop; // Absolute top of the section
            const sectionHeight = section.offsetHeight;

            // Section is active if current scroll position is:
            // - Past (sectionTop - activationOffset)
            // - And Before (sectionTop + sectionHeight - activationOffset)
            if (scrollPosition >= (sectionTop - activationOffset) &&
                scrollPosition < (sectionTop + sectionHeight - activationOffset)) {
                newActiveSectionId = section.id;
            }
        });

        // If scrolled to the very bottom of the page, make the last section active
        if ((window.innerHeight + scrollPosition) >= document.body.offsetHeight - 20) { // 20px buffer from bottom
            newActiveSectionId = scrollTrackedSections[scrollTrackedSections.length - 1].id;
        }

        // If at the very top of the page, 'home' should be active
        // (This condition might overlap with the loop's finding for #home, which is fine)
        if (scrollPosition < (scrollTrackedSections[0].offsetTop + scrollTrackedSections[0].offsetHeight - activationOffset) && scrollPosition < 50) {
             newActiveSectionId = scrollTrackedSections[0].id;
        }


        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === `#${newActiveSectionId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Debounce function
    function debounce(func, wait = 15, immediate = false) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    if (navLinks.length > 0 && scrollTrackedSections.length > 0) {
        window.addEventListener('scroll', debounce(updateActiveLink, 50));
        window.addEventListener('resize', debounce(updateActiveLink, 100));
        updateActiveLink(); // Initial check on load

        // Handle hash on load
        if (window.location.hash) {
            const idFromHash = window.location.hash;
            const targetSection = document.querySelector(idFromHash);
            if (targetSection) {
                setTimeout(() => {
                    smoothScrollToTarget(idFromHash);
                    // updateActiveLink will be called by the scroll event,
                    // but an explicit call after scroll ensures correct highlighting.
                    setTimeout(updateActiveLink, 100); // after scroll animation might finish
                }, 100);
            }
        }
    }

}); // End DOMContentLoaded