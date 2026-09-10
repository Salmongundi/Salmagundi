function gravityFails(elements, settings = {}) {

    const minDelay = settings.minDelay ?? 5000;
    const maxDelay = settings.maxDelay ?? 15000;
    const fallDistance = settings.fallDistance ?? 200;

    function fail() {

        elements.forEach(element => {

            let y = 0;
            let velocity = 0;

            const gravity =
                (Math.random() * 0.5 + 0.5) *
                (fallDistance / 100);

            const chaos =
                Math.random() * 0.08 + 0.02;

            const direction =
                Math.random() < 0.15 ? -1 : 1;

            let lastTime = performance.now();

            function animate(time) {

                const delta =
                    Math.min((time - lastTime) / 16.67, 3);

                lastTime = time;

                // Gravity
                velocity +=
                    gravity * direction * delta;

                // Random disturbances
                velocity +=
                    (Math.random() - 0.5) *
                    chaos *
                    delta;

                // Movement
                y += velocity * delta;

                // Bounce if it gets too far away
                if (y > fallDistance || y < -fallDistance) {
                    velocity *= -0.7;
                }

                element.style.transform =
                    `translateY(${y}px)`;

                // Keep going while the poem is moving
                if (
                    Math.abs(y) > 2 ||
                    Math.abs(velocity) > 0.1
                ) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.transform = "";
                }
            }

            requestAnimationFrame(animate);
        });

        const nextDelay =
            Math.random() *
            (maxDelay - minDelay) +
            minDelay;

        setTimeout(fail, nextDelay);
    }

    setTimeout(fail, minDelay);
}