// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(74, 43, 124, 0.98)'; // Slightly more opaque purple
        navbar.style.boxShadow = '0 2px 15px rgba(74, 43, 124, 0.4)';
    } else {
        navbar.style.backgroundColor = 'var(--sly-purple)';
        navbar.style.boxShadow = '0 2px 15px rgba(74, 43, 124, 0.3)';
    }
});

// Add animation to skills list items
const skills = document.querySelectorAll('.skills li');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
        }
    });
}, { threshold: 0.1 });

skills.forEach(skill => {
    skill.style.opacity = '0';
    skill.style.transform = 'translateX(-20px)';
    skill.style.transition = 'all 0.5s ease-out';
    observer.observe(skill);
});

document.addEventListener('DOMContentLoaded', function() {
    const cane = document.querySelector('.logo img.cane');
    const animations = ['bounce', 'spin', 'glow', 'shake', 'flip'];
    let isAnimating = false;
    
    // Coin counter setup
    const counterSpan = document.querySelector('.coin-counter span');
    const resetButton = document.querySelector('.reset-button');
    const navbar = document.querySelector('.navbar');
    let coinCount = parseInt(localStorage.getItem('coinCount') || '0');
    counterSpan.textContent = coinCount;

    // Check if vaporwave effect should be applied on page load
    if (coinCount >= 5) {
        navbar.classList.add('vaporwave');
    }

    // Reset button functionality
    resetButton.addEventListener('click', function() {
        coinCount = 0;
        localStorage.setItem('coinCount', coinCount);
        counterSpan.textContent = coinCount;
        counterSpan.classList.add('counter-pop');
        navbar.classList.remove('vaporwave');
        
        // Remove counter pop animation
        counterSpan.addEventListener('animationend', () => {
            counterSpan.classList.remove('counter-pop');
        }, { once: true });
    });

    // Determine if we're in a subpage
    const isSubpage = window.location.pathname.includes('/pages/');
    const coinPath = isSubpage ? '../images/sly-coin.png' : 'images/sly-coin.png';

    // Timeline click functionality
    const timelineItems = document.querySelectorAll('.timeline-content');
    timelineItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent.toLowerCase();
            let targetPage = '';
            
            // Map timeline items to their respective pages
            if (title.includes('ibm')) {
                targetPage = isSubpage ? '../pages/ibm.html' : 'pages/ibm.html';
            } else if (title.includes('plug power')) {
                targetPage = isSubpage ? '../pages/plugpower.html' : 'pages/plugpower.html';
            } else if (title.includes('university') || title.includes('college')) {
                targetPage = isSubpage ? '../pages/college.html' : 'pages/college.html';
            }
            
            if (targetPage) {
                window.location.href = targetPage;
            }
        });
    });

    // Cane click handler
    cane.addEventListener('click', function() {
        if (isAnimating) return;
        isAnimating = true;

        // Random animation
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        this.classList.add(randomAnimation);

        // 50% chance for coin collection
        if (Math.random() < 0.5) {
            // Create coin flash animation
            const coinFlash = document.createElement('img');
            coinFlash.src = coinPath;
            coinFlash.className = 'coin-flash';
            document.body.appendChild(coinFlash);

            // Update coin counter
            coinCount++;
            localStorage.setItem('coinCount', coinCount);
            counterSpan.textContent = coinCount;
            counterSpan.classList.add('counter-pop');

            // Check if we've reached 5 coins
            if (coinCount === 5) {
                navbar.classList.add('vaporwave');
            }

            // Remove counter pop animation
            counterSpan.addEventListener('animationend', () => {
                counterSpan.classList.remove('counter-pop');
            }, { once: true });

            // Remove coin flash after animation
            coinFlash.addEventListener('animationend', () => {
                coinFlash.remove();
            }, { once: true });
        }

        // Remove animation class after animation completes
        setTimeout(() => {
            this.classList.remove(randomAnimation);
            isAnimating = false;
        }, 1000);
    });
});

// RAWG API key - Replace with your API key
const RAWG_API_KEY = '9cf3adba449c4fb6b41b215a0122af5a';

// Function to fetch game covers
async function fetchGameCovers() {
    const gameImages = document.querySelectorAll('.game-image');
    
    for (const img of gameImages) {
        const gameName = img.dataset.game;
        try {
            const response = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(gameName)}&page_size=1`);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const game = data.results[0];
                img.src = game.background_image;
                img.style.opacity = '1';
            }
        } catch (error) {
            console.error(`Error fetching cover for ${gameName}:`, error);
        }
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchGameCovers();
}); 