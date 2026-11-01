
document.addEventListener("DOMContentLoaded", () => {
    // ---------- DARK / LIGHT MODE ----------
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");

    function updateTheme(isDark) {
        document.body.classList.toggle("dark", isDark);
        themeIcon.textContent = isDark ? "☀" : "☾";
        themeToggle.setAttribute(
            "aria-label",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );
        document.querySelector('meta[name="theme-color"]')
            ?.setAttribute("content", isDark ? "#111923" : "#f8f5ee");
    }

    // Restore the visitor's chosen theme.
    let savedTheme = null;

    try {
        savedTheme = localStorage.getItem("kalam-theme");
    } catch (error) {
        // The website still works if browser storage is unavailable.
    }

    updateTheme(savedTheme === "dark");

    themeToggle.addEventListener("click", () => {
        const isDark = !document.body.classList.contains("dark");
        updateTheme(isDark);

        try {
            localStorage.setItem("kalam-theme", isDark ? "dark" : "light");
        } catch (error) {
            // Theme switching still works for the current page.
        }
    });

    // ---------- MOBILE NAVIGATION ----------
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );
        menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation");
            menuToggle.textContent = "☰";
        });
    });

    // ---------- SCROLL PROGRESS ----------
    const progressBar = document.getElementById("progressBar");

    function updateProgress() {
        const scrollableHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const progress = scrollableHeight > 0
            ? (window.scrollY / scrollableHeight) * 100
            : 0;

        progressBar.style.width = `${progress}%`;
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    // ---------- SCROLL REVEAL ANIMATIONS ----------
    const revealElements = document.querySelectorAll(".reveal");
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if ("IntersectionObserver" in window && !reducedMotion) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12
        });

        revealElements.forEach(element => revealObserver.observe(element));
    } else {
        revealElements.forEach(element => element.classList.add("visible"));
    }

    // ---------- ANIMATED STATISTICS ----------
    const statNumbers = document.querySelectorAll(".stat-number");
    const animatedStats = new WeakSet();

    function animateCounter(element) {
        if (animatedStats.has(element)) return;

        animatedStats.add(element);

        const target = Number(element.dataset.target);
        const duration = 1300;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out effect.
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(target * easedProgress);

            element.textContent = currentValue.toLocaleString("en-IN");

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString("en-IN");
            }
        }

        requestAnimationFrame(updateCounter);
    }

    if ("IntersectionObserver" in window && !reducedMotion) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        statNumbers.forEach(number => statsObserver.observe(number));
    } else {
        statNumbers.forEach(number => {
            number.textContent = Number(number.dataset.target)
                .toLocaleString("en-IN");
        });
    }

    // ---------- INSPIRATIONAL QUOTE GENERATOR ----------
    const quotes = [
        {
            text: "Dream, dream, dream. Dreams transform into thoughts and thoughts result in action.",
            author: "— Dr. A. P. J. Abdul Kalam"
        },
        {
            text: "You have to dream before your dreams can come true.",
            author: "— Dr. A. P. J. Abdul Kalam"
        },
        {
            text: "Excellence is a continuous process and not an accident.",
            author: "— Dr. A. P. J. Abdul Kalam"
        },
        {
            text: "Great dreams of great dreamers are always transcended.",
            author: "— Dr. A. P. J. Abdul Kalam"
        }
    ];

    const quoteText = document.getElementById("quoteText");
    const quoteAuthor = document.querySelector(".quote-author");
    const quoteCounter = document.getElementById("quoteCounter");
    const newQuoteButton = document.getElementById("newQuote");

    let currentQuote = 0;

    newQuoteButton.addEventListener("click", () => {
        // Pick a different quote from the currently displayed one.
        let nextQuote;

        do {
            nextQuote = Math.floor(Math.random() * quotes.length);
        } while (quotes.length > 1 && nextQuote === currentQuote);

        currentQuote = nextQuote;

        quoteText.style.opacity = "0";

        window.setTimeout(() => {
            quoteText.textContent = quotes[currentQuote].text;
            quoteAuthor.textContent = quotes[currentQuote].author;
            quoteCounter.textContent =
                `INSPIRATION ${String(currentQuote + 1).padStart(2, "0")}`;

            quoteText.style.opacity = "1";
        }, 180);
    });

    // ---------- ACTIVE NAVIGATION LINK ----------
    const sections = document.querySelectorAll("main section[id]");
    const navigationLinks = navLinks.querySelectorAll("a");

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                navigationLinks.forEach(link => {
                    const isActive =
                        link.getAttribute("href") === `#${entry.target.id}`;

                    if (isActive) {
                        link.classList.add("active");
                    } else {
                        link.classList.remove("active");
                    }
                });
            });
        }, {
            rootMargin: "-25% 0px -65% 0px"
        });

        sections.forEach(section => sectionObserver.observe(section));
    }

    console.log("Kalam Tribute Website loaded successfully.");
});
