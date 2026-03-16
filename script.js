document.addEventListener("DOMContentLoaded", () => {
    // --- Section Navigations ---
    const homeSection = document.getElementById("home");
    const challengeSection = document.getElementById("challenge");
    const timelineSection = document.getElementById("timeline");
    const finalSection = document.getElementById("final-celebration");

    // --- Buttons ---
    const startBtn = document.getElementById("start-btn");
    const nextGameBtn = document.getElementById("next-game-btn");
    const unlockTimelineBtn = document.getElementById("unlock-timeline-btn");
    const finishBtn = document.getElementById("finish-btn");
    const replayBtn = document.getElementById("replay-btn");

    // Utilities to switch sections
    function switchSection(hideElem, showElem) {
        hideElem.classList.add("hidden");
        hideElem.classList.remove("active");
        showElem.classList.remove("hidden");
        // slight delay to allow display:block to apply before animating opacity
        setTimeout(() => {
            showElem.classList.add("active");
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 50);
    }

    // 1. Start Button Click -> Go to Games
    startBtn.addEventListener("click", () => {
        switchSection(homeSection, challengeSection);
    });

    // 2. Game 1 Logic
    const game1Options = document.querySelectorAll("#game1-options .option-btn");
    const blurImgContainer = document.getElementById("blur-img-container");
    const game1Feedback = document.getElementById("game1-feedback");

    game1Options.forEach(btn => {
        btn.addEventListener("click", function() {
            // Disable other buttons
            game1Options.forEach(b => b.disabled = true);
            
            if (this.dataset.correct === "true") {
                this.classList.add("selected-correct");
                blurImgContainer.classList.add("revealed");
                setTimeout(() => {
                    game1Feedback.classList.remove("hidden");
                }, 500);
            } else {
                this.classList.add("selected-wrong");
                // Allow trying again after wrong guess
                setTimeout(() => {
                    this.classList.remove("selected-wrong");
                    game1Options.forEach(b => b.disabled = false);
                }, 800);
            }
        });
    });

    // 3. Next Challenge Button Click -> Go to Game 2
    const game1 = document.getElementById("game-1");
    const game2 = document.getElementById("game-2");
    const challengeStep = document.getElementById("challenge-step");

    nextGameBtn.addEventListener("click", () => {
        game1.classList.add("hidden");
        game1.classList.remove("active");
        game2.classList.remove("hidden");
        game2.classList.add("active");
        challengeStep.textContent = "2";
    });

    // 4. Game 2 Logic (Quiz)
    const q1 = document.getElementById("q1");
    const q2 = document.getElementById("q2");
    const q1Options = q1.querySelectorAll(".option-btn");
    const q2Options = q2.querySelectorAll(".option-btn");
    const game2Feedback = document.getElementById("game2-feedback");

    function setupQuiz(optionsList, nextStepFn) {
        optionsList.forEach(btn => {
            btn.addEventListener("click", function() {
                optionsList.forEach(b => b.disabled = true);
                if (this.dataset.correct === "true") {
                    this.classList.add("selected-correct");
                    setTimeout(() => {
                        nextStepFn();
                    }, 800);
                } else {
                    this.classList.add("selected-wrong");
                    setTimeout(() => {
                        this.classList.remove("selected-wrong");
                        optionsList.forEach(b => b.disabled = false);
                    }, 800);
                }
            });
        });
    }

    setupQuiz(q1Options, () => {
        q1.classList.add("hidden");
        q2.classList.remove("hidden");
    });

    setupQuiz(q2Options, () => {
        game2Feedback.classList.remove("hidden");
    });

    // 5. Unlock Timeline Click
    unlockTimelineBtn.addEventListener("click", () => {
        switchSection(challengeSection, timelineSection);
        initTimelineObserver(); // start observing timeline items when it's shown
    });

    // 6. Timeline Observer for Scroll Animation
    function initTimelineObserver() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2, // trigger when 20% visible
            rootMargin: "0px 0px -50px 0px" // trigger slightly before bottom
        });

        timelineItems.forEach(item => {
            observer.observe(item);
        });
    }

    // 7. Finish Button -> Final Celebration
    finishBtn.addEventListener("click", () => {
        switchSection(timelineSection, finalSection);
        fireConfetti();
    });

    // Confetti Logic
    function fireConfetti() {
        var duration = 3 * 1000;
        var end = Date.now() + duration;

        (function frame() {
            // launch a few confetti from the left edge
            confetti({
                particleCount: 7,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#dbeafe', '#bfdbfe', '#ffffff', '#93c5fd']
            });
            // and launch a few from the right edge
            confetti({
                particleCount: 7,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#dbeafe', '#bfdbfe', '#ffffff', '#93c5fd']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    // Replay Logic
    replayBtn.addEventListener("click", () => {
        location.reload();
    });
});
