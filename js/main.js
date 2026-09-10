// Loop through each ASCII image to create a gif effect.
asciiFrameAnimation(
    [
        document.querySelector(".ascii1"),
        document.querySelector(".ascii2"),
        document.querySelector(".ascii3"),
        document.querySelector(".ascii4"),
        document.querySelector(".ascii5")
    ],
    {
        frameDuration: 1000,
        reverseAtEnds: true
    }
);


// Apply the panic effect to each ASCII element.
[
    document.querySelector(".ascii1"),
    document.querySelector(".ascii2"),
    document.querySelector(".ascii3"),
    document.querySelector(".ascii4"),
    document.querySelector(".ascii5")
].forEach(element => {

    asciiMousePanic(
        element,
        10,     // font size
        150,    // effectRadius
        4,      // force
        2,      // chaos
        0.2,    // rotationChaos
        0.80    // damping
    );

});


// Apply the gravity fall effect to the poem.
gravityFails(
    [
        document.querySelector(".gravity-poem-1")
    ],
    {
        minDelay: 5000,
        maxDelay: 15000,
        fallDistance: 200
    }
);