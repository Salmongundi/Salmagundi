function asciiFrameAnimation(elements, settings = {}) {

    const frameDuration = settings.frameDuration ?? 1000;
    const reverseAtEnds = settings.reverseAtEnds ?? true;

    // Load ASCII artwork
    elements.forEach(element => {

        const name = element.dataset.ascii;
        element.textContent = ASCII[name];

        // If this element has a panic canvas,
        // the canvas will handle visibility instead.
        if (!element.dataset.panicCanvas) {
            element.style.visibility = "hidden";
        }
    });


    let startTime = performance.now();


    function animate() {

        const elapsed = performance.now() - startTime;
        const step = Math.floor(elapsed / frameDuration);

        let activeIndex;


        if (reverseAtEnds) {

            const cycleLength = elements.length * 2 - 2;
            const position = step % cycleLength;

            if (position < elements.length) {
                activeIndex = position;
            } else {
                activeIndex = cycleLength - position;
            }

        } else {

            activeIndex = step % elements.length;

        }


        elements.forEach((element, index) => {

            const visible = index === activeIndex;


            if (element.dataset.panicCanvas) {

                element.dataset.panicVisible =
                    visible ? "visible" : "hidden";

            } else {

                element.style.visibility =
                    visible ? "visible" : "hidden";

            }

        });


        requestAnimationFrame(animate);
    }


    animate();
}



function asciiMousePanic(
    element,
    size = 10,
    effectRadius = 150,
    force = 2.5,
    chaos = 2,
    rotationChaos = 0.3,
    damping = 0.80
) {

    // Load the ASCII specified by this element
    const name = element.dataset.ascii;
    element.textContent = ASCII[name];


    // Get the ASCII text
    const text = element.textContent.replace(/\r/g, "");
    const color = getComputedStyle(element).color;


    // Create canvas
    const canvas = document.createElement("canvas");
    canvas.className = "ascii-canvas";

    document.body.appendChild(canvas);


    // Tell frame animation that this element
    // is represented by a canvas
    element.dataset.panicCanvas = "true";


    const ctx = canvas.getContext("2d");


    // Character sizing
    const fontSize = size;
    const lineHeight = size;
    const charWidth = size * 0.6;


    const lines = text.split("\n");


    const width = Math.ceil(
        Math.max(...lines.map(line => line.length)) *
        charWidth
    );


    const height =
        lines.length * lineHeight;


    canvas.width = width;
    canvas.height = height;


    canvas.style.width =
        width + "px";

    canvas.style.height =
        height + "px";


    ctx.font =
        size + "px monospace";

    ctx.textBaseline =
        "top";


    // Turn ASCII into individual characters
    const characters = [];


    lines.forEach((line, row) => {

        for (
            let col = 0;
            col < line.length;
            col++
        ) {

            const char = line[col];

            if (char === " ") continue;


            characters.push({

                char: char,

                x: col * charWidth,
                y: row * lineHeight,

                offsetX: 0,
                offsetY: 0,

                velocityX: 0,
                velocityY: 0,

                rotation: 0

            });

        }

    });


    // Mouse position
    let mouseX = -1000;
    let mouseY = -1000;


    document.addEventListener(
        "mousemove",
        e => {

            mouseX = e.clientX;
            mouseY = e.clientY;

        }
    );


    // Hide the original <pre> permanently
    element.style.visibility = "hidden";


    // Start hidden
    canvas.style.visibility = "hidden";


    // Animation
    function animate() {

        // Follow frame animation visibility
        canvas.style.visibility =
            element.dataset.panicVisible === "visible"
                ? "visible"
                : "hidden";


        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle = color;

        ctx.font =
            size + "px monospace";

        ctx.textBaseline =
            "top";


        characters.forEach(c => {

            const screenX =
                50 +
                c.x +
                c.offsetX;


            const screenY =
                50 +
                c.y +
                c.offsetY;


            const dx =
                screenX - mouseX;

            const dy =
                screenY - mouseY;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                distance < effectRadius &&
                distance > 0
            ) {

                const panic =
                    (effectRadius - distance) /
                    effectRadius;


                c.velocityX +=
                    (dx / distance) *
                    panic *
                    force;


                c.velocityY +=
                    (dy / distance) *
                    panic *
                    force;


                c.velocityX +=
                    (Math.random() - 0.5) *
                    panic *
                    chaos;


                c.velocityY +=
                    (Math.random() - 0.5) *
                    panic *
                    chaos;


                c.rotation +=
                    (Math.random() - 0.5) *
                    panic *
                    rotationChaos;

            }


            // Movement
            c.offsetX += c.velocityX;
            c.offsetY += c.velocityY;


            c.velocityX *= damping;
            c.velocityY *= damping;

            c.offsetX *= damping;
            c.offsetY *= damping;

            c.rotation *= 0.90;


            // Draw character
            ctx.save();


            ctx.translate(
                c.x + c.offsetX,
                c.y + c.offsetY
            );


            ctx.rotate(c.rotation);


            ctx.fillText(
                c.char,
                0,
                0
            );


            ctx.restore();

        });


        requestAnimationFrame(animate);
    }


    animate();
}