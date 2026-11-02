
document.addEventListener("DOMContentLoaded", () => {

    // HTML elements
    const welcome = document.getElementById("welcome");
    const wishesPage = document.getElementById("wishes");
    const photosPage = document.getElementById("photos");
    const finalPage = document.getElementById("finalMessage");

    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const music = document.getElementById("music");

    const wishLines = document.getElementById("wishLines");
    const nameLetters = document.getElementById("nameLetters");
    const heading = document.getElementById("birthdayHeading");

    const photoOne = document.getElementById("photoOne");
    const photoTwo = document.getElementById("photoTwo");
    const photoThree = document.getElementById("photoThree");

    const puzzleImage = document.getElementById("puzzleImage");
    const puzzleCanvas = document.getElementById("puzzleCanvas");

    const wait = ms =>
        new Promise(resolve => setTimeout(resolve, ms));

    // NO button moves away from the mouse
    function moveNoButton() {
        const rect = noBtn.getBoundingClientRect();

        const maxX = window.innerWidth - rect.width - 10;
        const maxY = window.innerHeight - rect.height - 10;

        const x = 10 + Math.random() * Math.max(10, maxX);
        const y = 10 + Math.random() * Math.max(10, maxY);

        noBtn.style.position = "fixed";
        noBtn.style.left = `${x}px`;
        noBtn.style.top = `${y}px`;
        noBtn.style.zIndex = "1000";
    }

    noBtn.addEventListener("mouseenter", moveNoButton);

    noBtn.addEventListener("touchstart", event => {
        event.preventDefault();
        moveNoButton();
    });

    noBtn.addEventListener("click", moveNoButton);

    // YES button
    yesBtn.addEventListener("click", async () => {
        yesBtn.disabled = true;

        music.volume = 0.5;
        music.play().catch(error => {
            console.log("Music playback issue:", error);
        });

        welcome.classList.add("hidden");
        wishesPage.classList.remove("hidden");

        await showBirthdayWishes();
    });

    // Birthday wishes animation
    async function showBirthdayWishes() {

        const wishes = [
            "You make even the simplest days feel special.",
            "One of the nicest things is having a friend like you.",
            "Genuine people like you make life a little brighter.",
            "Even difficult days can lead to something beautiful.",
            "Stay happy and keep being your lovely self.",
            "Hope all your dreams come true."
        ];

        wishLines.innerHTML = "";
        nameLetters.innerHTML = "";

        heading.classList.remove("heading-visible");

        const originalLetters = [];

        // STEP 1: Show sentences one by one
        for (const sentence of wishes) {

            const line = document.createElement("div");
            line.className = "wish-line";

            const firstLetter = document.createElement("span");
            firstLetter.className = "wish-first-letter";
            firstLetter.textContent = sentence.charAt(0);

            const remainingText = document.createElement("span");
            remainingText.className = "wish-sentence";
            remainingText.textContent = sentence.substring(1);

            line.appendChild(firstLetter);
            line.appendChild(remainingText);

            wishLines.appendChild(line);

            originalLetters.push(firstLetter);

            await wait(850);
        }

        // STEP 2: Highlight all first letters
        await wait(400);

        originalLetters.forEach(letter => {
            letter.classList.add("letter-highlight");
        });

        // STEP 3: Happy Birthday appears within 2 seconds
        await wait(1200);

        heading.classList.add("heading-visible");

        // STEP 4: Give time to read Happy Birthday
        await wait(1000);

        // STEP 5: Create destination letters below heading
        nameLetters.innerHTML = "";

        const destinationLetters = [];

        originalLetters.forEach(letter => {

            const destination = document.createElement("span");
            destination.textContent = letter.textContent;
            destination.className = "moving-name-letter";

            nameLetters.appendChild(destination);
            destinationLetters.push(destination);
        });

        // Make sure destination positions are calculated
        await new Promise(resolve =>
            requestAnimationFrame(() =>
                requestAnimationFrame(resolve)
            )
        );

        // STEP 6: Move original coloured letters to YOGESH
        const animations = originalLetters.map((letter, index) => {

            const startRect = letter.getBoundingClientRect();
            const endRect = destinationLetters[index].getBoundingClientRect();

            const flyingLetter = document.createElement("span");

            flyingLetter.textContent = letter.textContent;
            flyingLetter.className = "flying-letter";

            flyingLetter.style.left = `${startRect.left}px`;
            flyingLetter.style.top = `${startRect.top}px`;

            document.body.appendChild(flyingLetter);

            // Hide original while the animated letter travels
            letter.style.visibility = "hidden";

            const moveX = endRect.left - startRect.left;
            const moveY = endRect.top - startRect.top;

            const animation = flyingLetter.animate(
                [
                    {
                        transform: "translate(0px, 0px) scale(1)",
                        opacity: 1
                    },
                    {
                        transform: `translate(${moveX}px, ${moveY}px) scale(1)`,
                        opacity: 1
                    }
                ],
                {
                    duration: 1300,
                    delay: index * 150,
                    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                    fill: "forwards"
                }
            );

            return animation.finished.then(() => {

                // Remove the original first letter only
                letter.remove();

                // Remove the temporary moving letter
                flyingLetter.remove();

                // Reveal its final position in YOGESH
                destinationLetters[index].classList.add(
                    "name-letter-visible"
                );
            });
        });

        await Promise.all(animations);

        // STEP 7: Keep wishes, heading and YOGESH visible
        await wait(2500);

        // STEP 8: Continue to photo sequence
        wishesPage.classList.add("hidden");

        await showPhotos();
    }

    // Photo sequence
    async function showPhotos() {

        photosPage.classList.remove("hidden");

        // First photo - sunshine
        photoOne.classList.remove("hidden");
        await wait(5000);

        // Second photo - puzzle
        photoOne.classList.add("hidden");
        photoTwo.classList.remove("hidden");

        await createPuzzleEffect();
        await wait(3500);

        // Third photo - dreamy sunshine
        photoTwo.classList.add("hidden");
        photoThree.classList.remove("hidden");

        await wait(5500);

        // Final birthday message
        photosPage.classList.add("hidden");
        finalPage.classList.remove("hidden");
    }

    // Puzzle animation for second photo
    async function createPuzzleEffect() {

        const image = puzzleImage;
        const canvas = puzzleCanvas;
        const ctx = canvas.getContext("2d");

        if (!image.complete) {
            await new Promise(resolve => {
                image.onload = resolve;
                image.onerror = resolve;
            });
        }

        if (!image.naturalWidth) {
            console.log("Second photo could not load.");
            return;
        }

        const frame = canvas.parentElement;

        const frameWidth = frame.clientWidth - 20;
        const frameHeight = frame.clientHeight - 20;

        canvas.width = frameWidth * 2;
        canvas.height = frameHeight * 2;

        canvas.style.width = frameWidth + "px";
        canvas.style.height = frameHeight + "px";

        const width = canvas.width;
        const height = canvas.height;

        const columns = 4;
        const rows = 4;

        const tileWidth = width / columns;
        const tileHeight = height / rows;

        const scale = Math.min(
            width / image.naturalWidth,
            height / image.naturalHeight
        );

        const drawWidth = image.naturalWidth * scale;
        const drawHeight = image.naturalHeight * scale;

        const offsetX = (width - drawWidth) / 2;
        const offsetY = (height - drawHeight) / 2;

        const tiles = [];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {

                tiles.push({
                    x: col * tileWidth,
                    y: row * tileHeight,
                    startX: (Math.random() - 0.5) * width,
                    startY: (Math.random() - 0.5) * height,
                    delay: Math.random() * 500
                });
            }
        }

        const startTime = performance.now();
        const duration = 1800;

        await new Promise(resolve => {

            function animate(now) {

                const elapsed = now - startTime;

                ctx.clearRect(0, 0, width, height);

                tiles.forEach(tile => {

                    const progress = Math.max(
                        0,
                        Math.min(1, (elapsed - tile.delay) / duration)
                    );

                    const eased = 1 - Math.pow(1 - progress, 3);

                    const x = tile.x + tile.startX * (1 - eased);
                    const y = tile.y + tile.startY * (1 - eased);

                    ctx.save();

                    ctx.beginPath();
                    ctx.rect(
                        x,
                        y,
                        tileWidth + 1,
                        tileHeight + 1
                    );
                    ctx.clip();

                    ctx.drawImage(
                        image,
                        0,
                        0,
                        image.naturalWidth,
                        image.naturalHeight,
                        offsetX,
                        offsetY,
                        drawWidth,
                        drawHeight
                    );

                    ctx.restore();
                });

                if (elapsed < duration + 500) {
                    requestAnimationFrame(animate);
                } else {
                    ctx.clearRect(0, 0, width, height);
                    image.style.opacity = "1";
                    resolve();
                }
            }

            requestAnimationFrame(animate);
        });
    }

});
