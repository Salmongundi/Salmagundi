// ============================================================
// VISION SETTINGS
// ============================================================

const VISION = {

    // Eye / blur
    maxBlur: 5,
    blurBuildTime: 12,
    blurClearTime: 0.1,

    // Eyelid
    blinkStart: 0.6,
    blinkEnd: 0.8,
    openOpening: 1,
    closedOpening: 0,
    closingCurve: 2.2,
    maxDarkness: 1,
    eyelidSoftness: 8,
    darknessSmoothing: 0.3,

    // Floaters
    floaterCount: 12,
    darkFloaterCount: 5,

    darkFloaterMinSize: 3,
    darkFloaterMaxSize: 9,
    darkFloaterMinOpacity: 0.3,
    darkFloaterMaxOpacity: 0.65,

    floaterMinSize: 10,
    floaterMaxSize: 40,
    floaterMinOpacity: 0.04,
    floaterMaxOpacity: 0.18,

    floaterDriftSpeed: 0.035,
    floaterReactionDistance: 180,

    floaterRepulsion: 1.3,
    darkFloaterRepulsion: 3.5,

    floaterDrag: 0.965,
    floaterMaxSpeed: 0.7,
    darkFloaterMaxSpeed: 2.5
};


// ============================================================
// STATE
// ============================================================

const visionState = {
    blur: 0,
    opening: VISION.openOpening,
    targetOpening: VISION.openOpening,
    lastTime: performance.now(),

    mouseX: window.innerWidth / 2,
    mouseY: window.innerHeight / 2,

    floaters: []
};


const visionOverlay =
    document.getElementById("vision-overlay");


// ============================================================
// MOUSE / EYELID
// ============================================================

document.addEventListener("mousemove", (event) => {

    visionState.mouseX = event.clientX;
    visionState.mouseY = event.clientY;

    const position =
        event.clientY / window.innerHeight;

    const blink =
        Math.min(
            Math.max(
                (position - VISION.blinkStart) /
                (VISION.blinkEnd - VISION.blinkStart),
                0
            ),
            1
        );

    const closing =
        Math.pow(blink, VISION.closingCurve);

    visionState.targetOpening =
        VISION.openOpening -
        (
            VISION.openOpening -
            VISION.closedOpening
        ) * closing;
});


function updateEyelid() {

    visionState.opening +=
        (
            visionState.targetOpening -
            visionState.opening
        ) * VISION.darknessSmoothing;
}


// ============================================================
// BLUR
// ============================================================

function updateBlur(deltaTime) {

    const closed =
        visionState.opening <=
        VISION.closedOpening + 0.05;

    const rate =
        VISION.maxBlur /
        (
            closed
                ? VISION.blurClearTime
                : VISION.blurBuildTime
        );

    visionState.blur +=
        (
            closed
                ? -rate
                : rate
        ) * deltaTime;

    visionState.blur =
        Math.max(
            0,
            Math.min(
                visionState.blur,
                VISION.maxBlur
            )
        );
}


// ============================================================
// FLOATER SHAPES
// ============================================================

function createFloaterShape(element, floater) {

    const shape = Math.random();

    if (floater.isDark) {

        // Hollow irregular small floaters.
        element.style.background = "transparent";

        element.style.border =
            `${0.7 + Math.random() * 1.1}px solid rgba(0, 0, 0, ${floater.opacity})`;

        if (shape < 0.3) {

            element.style.borderRadius =
                "58% 42% 67% 33% / 42% 61% 39% 58%";

        } else if (shape < 0.55) {

            element.style.borderRadius =
                "72% 28% 44% 56% / 36% 63% 37% 64%";

        } else if (shape < 0.78) {

            element.style.borderRadius =
                "80% 20% 70% 30% / 50%";

        } else {

            element.style.borderRadius =
                "47% 53% 38% 62% / 61% 39% 58% 42%";
        }

        return;
    }


    // --------------------------------------------------------
    // LARGE BLURRY FLOATERS
    // --------------------------------------------------------

    element.style.background =
        `rgba(0, 0, 0, ${floater.opacity})`;

    element.style.border = "none";


    if (shape < 0.25) {

        element.style.borderRadius =
            "50% 50% 47% 53% / 53% 46% 54% 47%";

    } else if (shape < 0.5) {

        element.style.borderRadius =
            "57% 43% 52% 48% / 45% 55% 47% 53%";

    } else if (shape < 0.75) {

        element.style.borderRadius =
            "46% 54% 59% 41% / 52% 48% 43% 57%";

    } else {

        element.style.borderRadius =
            "54% 46% 44% 56% / 48% 52% 57% 43%";
    }
}


// ============================================================
// BUBBLY TEXT
// ============================================================

function makeBubblyText(element, settings = {}) {

    const amplitude =
        settings.amplitude ?? 3;

    const rotationAmount =
        settings.rotationAmount ?? 2;

    const speed =
        settings.speed ?? 0.8;

    const words = [];

    const walker =
        document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT
        );

    const textNodes = [];

    while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
    }

    textNodes.forEach((textNode) => {

        const parts =
            textNode.textContent.split(/(\s+)/);

        const fragment =
            document.createDocumentFragment();

        parts.forEach((part) => {

            if (/^\s+$/.test(part)) {

                fragment.appendChild(
                    document.createTextNode(part)
                );

                return;
            }

            if (part === "") return;

            const span =
                document.createElement("span");

            span.textContent = part;

            Object.assign(span.style, {
                display: "inline-block",
                position: "relative",
                willChange: "transform"
            });

            const word = {

                element: span,

                phase:
                    Math.random() *
                    Math.PI * 2,

                speed:
                    speed *
                    (0.65 + Math.random() * 0.7),

                amplitude:
                    amplitude *
                    (0.55 + Math.random() * 0.9),

                rotation:
                    rotationAmount *
                    (Math.random() - 0.5),

                drift:
                    Math.random() *
                    Math.PI * 2
            };

            words.push(word);

            fragment.appendChild(span);
        });

        textNode.parentNode.replaceChild(
            fragment,
            textNode
        );
    });

    return words;
}


function updateBubblyText(words, currentTime) {

    const time =
        currentTime / 1000;

    words.forEach((word) => {

        const t =
            time *
            word.speed +
            word.phase;

        const x =
            Math.sin(
                t * 0.73 +
                word.drift
            ) *
            word.amplitude;

        const y =
            Math.cos(
                t +
                word.drift
            ) *
            word.amplitude;

        const rotation =
            Math.sin(
                t * 0.61 +
                word.drift
            ) *
            word.rotation;

        word.element.style.transform =
            `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
    });
}


// ============================================================
// CREATE FLOATER
// ============================================================
//
// Normal floaters:
//
//     createFloater();
//
// Existing elements:
//
//     createFloater(element, {
//         maxSpeed: 1.5,
//         reactionDistance: 300,
//         repulsion: 5,
//         directRepulsion: true,
//         rotationSpeed: 0.01,
//         wheelSensitivity: 0.15,
//         keepOnScreen: true
//     });
//
// ============================================================

function createFloater(element = null, settings = {}) {

    const existingElement =
        element !== null;

    const isDark =
        !existingElement &&
        visionState.floaters.length < VISION.darkFloaterCount;


    // --------------------------------------------------------
    // CREATE ELEMENT IF NEEDED
    // --------------------------------------------------------

    if (!existingElement) {

        element =
            document.createElement("div");
    }


    // --------------------------------------------------------
    // GENERATED FLOATER APPEARANCE
    // --------------------------------------------------------

    let opacity = 1;


    if (!existingElement) {

        let width;
        let height;
        let blur;


        if (isDark) {

            const size =
                VISION.darkFloaterMinSize +
                Math.random() *
                (
                    VISION.darkFloaterMaxSize -
                    VISION.darkFloaterMinSize
                );

            width =
                size *
                (0.65 + Math.random() * 1.5);

            height =
                size *
                (0.45 + Math.random() * 0.8);

            opacity =
                VISION.darkFloaterMinOpacity +
                Math.random() *
                (
                    VISION.darkFloaterMaxOpacity -
                    VISION.darkFloaterMinOpacity
                );

            blur =
                Math.random() * 0.8;

        } else {

            const size =
                VISION.floaterMinSize +
                Math.random() *
                (
                    VISION.floaterMaxSize -
                    VISION.floaterMinSize
                );

            width =
                size *
                (0.75 + Math.random() * 0.8);

            height =
                size *
                (0.65 + Math.random() * 0.75);

            opacity =
                VISION.floaterMinOpacity +
                Math.random() *
                (
                    VISION.floaterMaxOpacity -
                    VISION.floaterMinOpacity
                );

            blur =
                1.5 + Math.random() * 3.5;
        }


        Object.assign(element.style, {
            position: "fixed",
            width: `${width}px`,
            height: `${height}px`,
            background: `rgba(0, 0, 0, ${opacity})`,
            pointerEvents: "none",
            zIndex: "10000",
            filter: `blur(${blur}px)`
        });


        document.body.appendChild(element);

        createFloaterShape(element, {
            opacity,
            isDark
        });
    }


    // --------------------------------------------------------
    // FLOATER OBJECT
    // --------------------------------------------------------

    const floater = {

        element,

        x:
            settings.x ??
            Math.random() * window.innerWidth,

        y:
            settings.y ??
            Math.random() * window.innerHeight,

        velocityX:
            settings.velocityX ??
            (Math.random() - 0.5) * 0.15,

        velocityY:
            settings.velocityY ??
            (Math.random() - 0.5) * 0.15,

        opacity,

        isDark,

        phase:
            settings.phase ??
            Math.random() * Math.PI * 2,

        driftSpeed:
            settings.driftSpeed ??
            (0.4 + Math.random() * 1.2),

        rotation:
            settings.rotation ??
            Math.random() * 360,

        rotationSpeed:
            settings.rotationSpeed ??
            (Math.random() - 0.5) * 0.08,

        wheelRotation:
            settings.wheelRotation ??
            0,

        wheelSensitivity:
            settings.wheelSensitivity ??
            0,

        reactionDistance:
            settings.reactionDistance ??
            VISION.floaterReactionDistance,

        repulsion:
            settings.repulsion ??
            (
                isDark
                    ? VISION.darkFloaterRepulsion
                    : VISION.floaterRepulsion
            ),

        maxSpeed:
            settings.maxSpeed ??
            (
                isDark
                    ? VISION.darkFloaterMaxSpeed
                    : VISION.floaterMaxSpeed
            ),

        drag:
            settings.drag ??
            VISION.floaterDrag,

        directRepulsion:
            settings.directRepulsion ??
            isDark,

        keepOnScreen:
            settings.keepOnScreen ??
            false,

        originalFilter:
            existingElement
                ? getComputedStyle(element).filter
                : null,

        bubblyText:
            settings.bubblyText
                ? makeBubblyText(
                    element,
                    settings.bubblyText
                )
                : null
    };


    visionState.floaters.push(floater);

    return floater;
}


// ============================================================
// CREATE FLOATERS
// ============================================================

function createFloaters() {

    for (
        let i = 0;
        i < VISION.floaterCount;
        i++
    ) {
        createFloater();
    }
}


// ============================================================
// WHEEL ROTATION
// ============================================================

document.addEventListener("wheel", (event) => {

    visionState.floaters.forEach((floater) => {

        if (floater.wheelSensitivity !== 0) {

            floater.wheelRotation +=
                event.deltaY *
                floater.wheelSensitivity;
        }
    });
});


// ============================================================
// KEEP FLOATER ON SCREEN
// ============================================================

function keepFloaterOnScreen(floater) {

    floater.element.style.transform =
        `translate(${floater.x}px, ${floater.y}px) ` +
        `rotate(${floater.rotation + floater.wheelRotation}deg)`;


    const rect =
        floater.element.getBoundingClientRect();


    let correctionX = 0;
    let correctionY = 0;


    if (rect.left < 0) {
        correctionX = -rect.left;
    }

    if (rect.right > window.innerWidth) {
        correctionX =
            window.innerWidth -
            rect.right;
    }

    if (rect.top < 0) {
        correctionY = -rect.top;
    }

    if (rect.bottom > window.innerHeight) {
        correctionY =
            window.innerHeight -
            rect.bottom;
    }


    floater.x += correctionX;
    floater.y += correctionY;


    if (
        correctionX !== 0 ||
        correctionY !== 0
    ) {

        floater.element.style.transform =
            `translate(${floater.x}px, ${floater.y}px) ` +
            `rotate(${floater.rotation + floater.wheelRotation}deg)`;
    }
}


// ============================================================
// FLOATER MOVEMENT
// ============================================================

function updateFloaters(deltaTime, currentTime) {

    const time =
        currentTime / 1000;

    visionState.floaters.forEach((floater) => {

        // ----------------------------------------------------
        // Natural drifting motion
        // ----------------------------------------------------

        const drift =
            time *
            VISION.floaterDriftSpeed *
            floater.driftSpeed +
            floater.phase;

        floater.velocityX +=
            Math.cos(drift) *
            0.002 *
            deltaTime *
            60;

        floater.velocityY +=
            Math.sin(drift * 0.73) *
            0.002 *
            deltaTime *
            60;


        // ----------------------------------------------------
        // Distance from cursor
        // ----------------------------------------------------

        const dx =
            floater.x -
            visionState.mouseX;

        const dy =
            floater.y -
            visionState.mouseY;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        // ----------------------------------------------------
        // Cursor repulsion
        // ----------------------------------------------------

        if (
            distance > 0 &&
            distance < floater.reactionDistance
        ) {

            const proximity =
                1 -
                distance /
                floater.reactionDistance;

            const force =
                proximity *
                proximity *
                floater.repulsion;


            if (floater.directRepulsion) {

                floater.x +=
                    (dx / distance) *
                    force *
                    deltaTime *
                    60;

                floater.y +=
                    (dy / distance) *
                    force *
                    deltaTime *
                    60;

            } else {

                floater.velocityX +=
                    (dx / distance) *
                    force *
                    deltaTime;

                floater.velocityY +=
                    (dy / distance) *
                    force *
                    deltaTime;
            }
        }


        // ----------------------------------------------------
        // Limit speed
        // ----------------------------------------------------

        const speed =
            Math.sqrt(
                floater.velocityX ** 2 +
                floater.velocityY ** 2
            );

        if (speed > floater.maxSpeed) {

            floater.velocityX =
                floater.velocityX /
                speed *
                floater.maxSpeed;

            floater.velocityY =
                floater.velocityY /
                speed *
                floater.maxSpeed;
        }


        // ----------------------------------------------------
        // Move
        // ----------------------------------------------------

        floater.x +=
            floater.velocityX *
            deltaTime *
            60;

        floater.y +=
            floater.velocityY *
            deltaTime *
            60;


        // ----------------------------------------------------
        // Lose momentum
        // ----------------------------------------------------

        const drag =
            Math.pow(
                floater.drag,
                deltaTime * 60
            );

        floater.velocityX *= drag;
        floater.velocityY *= drag;


        // ----------------------------------------------------
        // Rotation
        // ----------------------------------------------------

        floater.rotation +=
            floater.rotationSpeed *
            deltaTime *
            60;


        // ----------------------------------------------------
        // Screen boundaries
        // ----------------------------------------------------

        if (floater.keepOnScreen) {

            keepFloaterOnScreen(floater);

        } else {

            const padding = 100;

            if (floater.x < -padding)
                floater.x =
                    window.innerWidth +
                    padding;

            if (floater.x >
                window.innerWidth + padding)
                floater.x = -padding;

            if (floater.y < -padding)
                floater.y =
                    window.innerHeight +
                    padding;

            if (floater.y >
                window.innerHeight + padding)
                floater.y = -padding;
        }


        // ----------------------------------------------------
        // Preserve vision blur on page-element floaters
        // ----------------------------------------------------

        if (floater.originalFilter !== null) {

            floater.element.style.filter =
                floater.originalFilter === "none"
                    ? `blur(${visionState.blur}px)`
                    : `${floater.originalFilter} blur(${visionState.blur}px)`;
        }


        // ----------------------------------------------------
        // Bubbly individual words
        // ----------------------------------------------------

        if (floater.bubblyText) {

            updateBubblyText(
                floater.bubblyText,
                currentTime
            );
        }


        // ----------------------------------------------------
        // Draw normal floaters
        // ----------------------------------------------------

        if (!floater.keepOnScreen) {

            floater.element.style.transform =
                `translate(${floater.x}px, ${floater.y}px) ` +
                `rotate(${floater.rotation + floater.wheelRotation}deg)`;
        }
    });
}


// ============================================================
// RENDER VISION
// ============================================================

function applyVisionEffects() {

    const opening =
        visionState.opening;

    const edge =
        Math.min(
            VISION.eyelidSoftness,
            opening * 50
        );

    const topEdge =
        50 -
        opening * 50;

    const bottomEdge =
        50 +
        opening * 50;


    visionOverlay.style.backdropFilter =
        `blur(${visionState.blur}px)`;

    visionOverlay.style.webkitBackdropFilter =
        `blur(${visionState.blur}px)`;


    visionOverlay.style.background = `
        linear-gradient(
            to bottom,
            rgba(0, 0, 0, ${VISION.maxDarkness}) 0%,
            rgba(0, 0, 0, ${VISION.maxDarkness}) ${Math.max(0, topEdge - edge)}%,
            rgba(0, 0, 0, 0) ${topEdge}%,
            rgba(0, 0, 0, 0) ${bottomEdge}%,
            rgba(0, 0, 0, ${VISION.maxDarkness}) ${Math.min(100, bottomEdge + edge)}%,
            rgba(0, 0, 0, ${VISION.maxDarkness}) 100%
        )
    `;
}


// ============================================================
// ANIMATION
// ============================================================

function animateVision(currentTime) {

    const deltaTime =
        (
            currentTime -
            visionState.lastTime
        ) / 1000;

    visionState.lastTime =
        currentTime;

    updateEyelid();
    updateBlur(deltaTime);
    updateFloaters(
        deltaTime,
        currentTime
    );
    applyVisionEffects();

    requestAnimationFrame(
        animateVision
    );
}


// ============================================================
// START
// ============================================================

createFloaters();


// ------------------------------------------------------------
// PAGE ELEMENT FLOATERS
// ------------------------------------------------------------

document
    .querySelectorAll(".words_20260910_beef")
    .forEach((element) => {

        createFloater(
            element,
            {
                maxSpeed: 1.5,
                reactionDistance: 300,
                repulsion: 5,
                directRepulsion: true,
                rotationSpeed: 0.01,
                wheelSensitivity: 0.15,
                keepOnScreen: true,

                bubblyText: {
                    amplitude: 3,
                    rotationAmount: 2.5,
                    speed: 0.7
                }
            }
        );
    });


requestAnimationFrame(
    animateVision
);