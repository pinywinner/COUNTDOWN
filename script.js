// Ensure the script runs after the entire page is loaded
window.onload = function() {
    // Get the header flipper element
    const flipper = document.getElementById('header-flipper');
    // Get the confetti canvas element
    const confettiCanvas = document.getElementById('confetti-canvas');
    // Create a confetti instance bound to the specific canvas
    const myConfetti = confetti.create(confettiCanvas, { resize: true });

    /**
     * Starts the countdown timer.
     * Calculates and updates the time remaining until the wedding date.
     */
    function startCountdown() {
        // Set the target wedding date and time (October 22, 2025, 6:00 PM)
        const countdownDate = new Date("2025-10-22T18:00:00").getTime();

        // Get references to countdown display elements
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        // Get references to the countdown number boxes for animation
        const daysBox = document.getElementById('days-box');
        const hoursBox = document.getElementById('hours-box');
        const minutesBox = document.getElementById('minutes-box');
        const secondsBox = document.getElementById('seconds-box');

        // Get references to the main countdown container and footer message
        const countdownContainer = document.getElementById('countdown-container');
        const footerMessage = document.getElementById('footer-message');

        // Variables to store previous time values for animation triggering
        let prevDays, prevHours, prevMinutes, prevSeconds;

        // Exit if countdown elements are not found
        if (!daysEl) return;

        // Set up an interval to update the countdown every second
        const interval = setInterval(() => {
            const now = new Date().getTime(); // Get current time
            const distance = countdownDate - now; // Calculate distance to target date

            // If the countdown is finished (distance is negative)
            if (distance < 0) {
                clearInterval(interval); // Stop the interval
                // Update the countdown container to show "The Chuppah has begun."
                countdownContainer.innerHTML = `<div class="col-span-2 bg-white p-6 border-8 border-black brutal-shadow"><h2 class="text-4xl text-[#FF0000]">החופה החלה.</h2></div>`;
                // Update the footer message to "Mazal Tov!"
                if (footerMessage) footerMessage.innerHTML = '<p class="text-xl font-bold bg-black text-yellow-400 inline-block p-4">מזל טוב!</p>'; // Changed text-white to text-yellow-400
                return; // Exit the function
            }

            // Calculate days, hours, minutes, and seconds remaining
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Apply 'pop' animation if the value changes
            if (seconds !== prevSeconds) {
                secondsBox.classList.add('animate-pop');
                setTimeout(() => secondsBox.classList.remove('animate-pop'), 400); // Remove class after animation
            }
            if (minutes !== prevMinutes) {
                minutesBox.classList.add('animate-pop');
                setTimeout(() => minutesBox.classList.remove('animate-pop'), 400);
            }
            if (hours !== prevHours) {
                hoursBox.classList.add('animate-pop');
                setTimeout(() => hoursBox.classList.remove('animate-pop'), 400);
            }
            if (days !== prevDays) {
                daysBox.classList.add('animate-pop');
                setTimeout(() => daysBox.classList.remove('animate-pop'), 400);
            }

            // Store current values for the next comparison
            prevDays = days; prevHours = hours; prevMinutes = minutes; prevSeconds = seconds;

            // Update the display with padded numbers (e.g., 05 instead of 5)
            daysEl.innerText = String(days).padStart(2, '0');
            hoursEl.innerText = String(hours).padStart(2, '0');
            minutesEl.innerText = String(minutes).padStart(2, '0');
            secondsEl.innerText = String(seconds).padStart(2, '0');
        }, 1000); // Update every 1 second
    }

    // --- Welcome Animation Logic ---
    // Check if the user has visited before using sessionStorage
    if (!sessionStorage.getItem('hasVisited')) {
        sessionStorage.setItem('hasVisited', 'true'); // Mark as visited

        // Flip the header to show the welcome message
        flipper.classList.add('is-flipped');

        // Trigger confetti shortly after the flip starts
        setTimeout(() => {
            // Call the confetti instance created earlier
            myConfetti({ particleCount: 150, spread: 90, origin: { y: 0.1 } });
        }, 200);

        // Flip the header back after a delay
        setTimeout(() => {
            flipper.classList.remove('is-flipped');
        }, 1000);

        // Start the countdown after the welcome animation finishes
        setTimeout(startCountdown, 2500);

    } else {
        // If already visited, start countdown immediately
        startCountdown();
    }

    // --- Background Confetti Logic (Canvas Animation) ---
    const ctx = confettiCanvas.getContext('2d'); // Use confettiCanvas instead of canvas
    confettiCanvas.width = window.innerWidth; // Set canvas width to window width
    confettiCanvas.height = window.innerHeight; // Set canvas height to window height
    let particles = []; // Array to hold confetti particles
    const particleCount = 70; // Increased particle count for more density
    const colors = ["rgba(0,0,0,0.3)", "rgba(0,0,0,0.5)", "#FFD700", "#FF69B4", "#8A2BE2"]; // Added more colors

    /**
     * Particle constructor function.
     * @param {number} x - Initial X coordinate.
     * @param {number} y - Initial Y coordinate.
     * @param {number} size - Size of the particle.
     * @param {string} shape - Type of the particle ('square', 'line', 'circle', 'triangle', 'hexagon', 'star', 'diamond').
     * @param {string} color - Color of the particle.
     * @param {number} speed - Vertical speed of the particle.
     */
    function Particle(x, y, size, shape, color, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.shape = shape;
        this.color = color;
        this.speed = speed;
        this.rotation = Math.random() * 360; // Initial random rotation in degrees
    }

    /**
     * Draws the particle on the canvas based on its shape.
     */
    Particle.prototype.draw = function() {
        ctx.save(); // Save current canvas state
        ctx.translate(this.x, this.y); // Move origin to particle's position
        ctx.rotate(this.rotation * Math.PI / 180); // Rotate the particle (convert degrees to radians)
        ctx.fillStyle = this.color; // Set fill color

        switch (this.shape) {
            case 'square':
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                break;
            case 'line':
                ctx.fillRect(-this.size / 2, -1, this.size, 2);
                break;
            case 'circle':
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(0, -this.size / 2);
                ctx.lineTo(this.size / 2, this.size / 2);
                ctx.lineTo(-this.size / 2, this.size / 2);
                ctx.closePath();
                ctx.fill();
                break;
            case 'hexagon':
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI / 3) * i;
                    ctx.lineTo(this.size / 2 * Math.cos(angle), this.size / 2 * Math.sin(angle));
                }
                ctx.closePath();
                ctx.fill();
                break;
            case 'star':
                // Draw a 5-pointed star
                ctx.beginPath();
                const outerRadius = this.size / 2;
                const innerRadius = outerRadius / 2.5; // Adjust for star pointiness
                let angle = Math.PI / 2; // Start from top point
                for (let i = 0; i < 5; i++) {
                    ctx.lineTo(outerRadius * Math.cos(angle), outerRadius * Math.sin(angle));
                    angle += Math.PI / 5; // Move to inner point
                    ctx.lineTo(innerRadius * Math.cos(angle), innerRadius * Math.sin(angle));
                    angle += Math.PI / 5; // Move to next outer point
                }
                ctx.closePath();
                ctx.fill();
                break;
            case 'diamond':
                ctx.beginPath();
                ctx.moveTo(0, -this.size / 2); // Top point
                ctx.lineTo(this.size / 2, 0);   // Right point
                ctx.lineTo(0, this.size / 2);    // Bottom point
                ctx.lineTo(-this.size / 2, 0);  // Left point
                ctx.closePath();
                ctx.fill();
                break;
        }
        ctx.restore(); // Restore canvas state
    };

    /**
     * Updates the particle's position and rotation.
     * Resets particle to top if it goes off screen.
     */
    Particle.prototype.update = function() {
        this.y += this.speed; // Move particle downwards
        this.rotation += this.speed / 2; // Rotate particle
        if (this.y > confettiCanvas.height) { // If particle goes off bottom of screen
            this.y = -this.size; // Reset to top
            this.x = Math.random() * confettiCanvas.width; // Random new X position
        }
    };

    /**
     * Initializes the array of background confetti particles.
     */
    function initParticles() {
        particles = []; // Clear existing particles
        const shapes = ['square', 'line', 'circle', 'triangle', 'hexagon', 'star', 'diamond']; // Added 'star' and 'diamond'
        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * confettiCanvas.width;
            const y = Math.random() * confettiCanvas.height;
            const size = Math.random() * 15 + 5;
            const shape = shapes[Math.floor(Math.random() * shapes.length)]; // Randomly pick a shape
            const color = colors[Math.floor(Math.random() * colors.length)]; // Randomly pick a color
            const speed = Math.random() * 0.5 + 0.1; // Reduced speed range for slower fall
            particles.push(new Particle(x, y, size, shape, color, speed));
        }
    }

    /**
     * Animation loop for the background confetti.
     * Clears canvas, updates and draws each particle.
     */
    function animate() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height); // Clear the entire canvas
        for (let i = 0; i < particles.length; i++) {
            particles[i].update(); // Update particle position
            particles[i].draw(); // Draw particle
        }
        requestAnimationFrame(animate); // Request next animation frame
    }

    // Initialize and start the background confetti animation
    initParticles();
    animate();

    // Handle window resizing to adjust canvas and reinitialize particles
    window.addEventListener('resize', () => {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
        particles = []; // Clear current particles
        initParticles(); // Reinitialize particles for new canvas size
    });

    // --- Music Player Logic ---
    const song = document.getElementById('wedding-song');
    const playPauseButton = document.getElementById('play-pause-button');

    playPauseButton.addEventListener('click', () => {
        if (song.paused) {
            song.play();
            playPauseButton.innerHTML = '⏸️';
        } else {
            song.pause();
            playPauseButton.innerHTML = '▶️';
        }
    });
};
