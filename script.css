document.addEventListener('DOMContentLoaded', () => {

    // --- Typing Effect for Tagline ---
    const typingElement = document.getElementById('typing-effect');
    const cursorElement = document.querySelector('.cursor'); // Get cursor element
    // --- Text for typing effect --- (Adjust as desired)
    const textToType = "Data Engineer | Cloud Architect | AI Enthusiast";
    let charIndex = 0;
    const typingSpeed = 70; // Milliseconds per character (faster)
    const initialDelay = 500; // Delay before starting

    function type() {
        if (charIndex < textToType.length && typingElement) {
            typingElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            // Keep cursor blinking after typing is done
            if(cursorElement) cursorElement.style.display = 'inline-block';
        }
    }

    // Hide cursor initially until typing starts
    if(cursorElement) cursorElement.style.display = 'none';

    // Start typing effect after initial delay
    if (typingElement) {
        // Make cursor visible just before typing starts
        setTimeout(() => {
             if(cursorElement) cursorElement.style.display = 'inline-block';
             type();
        }, initialDelay);
    }


    // --- Intersection Observer for fade-in animations ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                 // Optional: Unobserve after first time for performance
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });


    // --- Sticky navigation visibility ---
    const stickyNav = document.querySelector('.sticky-nav');
    const header = document.querySelector('header'); // Target the header element

    if (stickyNav && header) { // Check if elements exist
        const headerObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    // Show nav when header is NOT intersecting (scrolled past)
                    if (!entry.isIntersecting && entry.boundingClientRect.bottom < 0) {
                         stickyNav.classList.add('visible');
                    } else {
                         stickyNav.classList.remove('visible');
                    }
                });
            },
            // Trigger when the header bottom goes out of view or comes back in
            { threshold: 0, rootMargin: "0px 0px 0px 0px" }
        );

        headerObserver.observe(header);
    }


    // --- Smooth scrolling for navigation links ---
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = stickyNav ? stickyNav.offsetHeight : 60; // Estimate nav height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;


                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- THEME SWITCHING LOGIC REMOVED ---

}); // End DOMContentLoaded