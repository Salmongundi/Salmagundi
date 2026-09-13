
asciiFrameAnimation(
    [
        document.querySelector(".words_20260912_ascii.ascii1"),
        document.querySelector(".words_20260912_ascii.ascii2"),
        document.querySelector(".words_20260912_ascii.ascii3"),
        document.querySelector(".words_20260912_ascii.ascii4"),
        document.querySelector(".words_20260912_ascii.ascii5"),
        document.querySelector(".words_20260912_ascii.ascii6"),
        document.querySelector(".words_20260912_ascii.ascii7")
    ],
    {
        frameDuration: 1000,
        reverseAtEnds: true,
        wind: true
    }
);


asciiFrameAnimation(
    [
        document.querySelector(".words_20260912_ascii_right.ascii1"),
        document.querySelector(".words_20260912_ascii_right.ascii2"),
        document.querySelector(".words_20260912_ascii_right.ascii3"),
        document.querySelector(".words_20260912_ascii_right.ascii4"),
        document.querySelector(".words_20260912_ascii_right.ascii5"),
        document.querySelector(".words_20260912_ascii_right.ascii6"),
        document.querySelector(".words_20260912_ascii_right.ascii7")
    ],
    {
        frameDuration: 1000,
        reverseAtEnds: true,
        wind: true
    }
);

/* #region POEM WIND */

const poem = document.querySelector(".words_20260912_poem");

if (poem) {
    const lines = poem.textContent
        .trim()
        .split("\n")
        .map(line => line.trim());

    poem.innerHTML = "";

    let lineIndex = 0;

    lines.forEach(line => {

        if (line === "") {
            const gap = document.createElement("span");
            gap.className = "poem-wind-gap";
            poem.appendChild(gap);
            return;
        }

        const lineElement = document.createElement("span");

        lineElement.className = "poem-wind-line";
        lineElement.textContent = line;

        lineElement.style.setProperty(
            "--poem-wind-delay",
            `${lineIndex * -0.16}s`
        );

        poem.appendChild(lineElement);

        lineIndex++;
    });
}

/* #endregion */

/* #region GRASS / PASTURE */

const grass = document.getElementById("grass");

const grassCharacters = [
    "˄",
    "⌁",
    "ʌ",
    "Y",
    "⋀",
    "╱╲",
    "╲╱"
];

const grassColors = [
    "#315c24",
    "#3f742b",
    "#4f8734",
    "#5d963b",
    "#6fa447",
    "#28551f"
];

for (let i = 0; i < 140; i++) {

    const blade = document.createElement("div");

    blade.className = "grass-blade";

    blade.textContent =
        grassCharacters[
            Math.floor(Math.random() * grassCharacters.length)
        ];

    /*
        Spread the grass throughout the entire pasture
        instead of putting every blade on the bottom edge.
    */
    blade.style.left =
        `${Math.random() * 100}%`;

    blade.style.bottom =
        `${Math.random() * 75}%`;

    blade.style.setProperty(
        "--grass-color",
        grassColors[
            Math.floor(Math.random() * grassColors.length)
        ]
    );

    blade.style.setProperty(
        "--grass-speed",
        `${3 + Math.random() * 4}s`
    );

    blade.style.setProperty(
        "--grass-delay",
        `${Math.random() * -6}s`
    );

    blade.style.fontSize =
        `${10 + Math.random() * 16}px`;

    grass.appendChild(blade);
}


/* #region COWS */

const cowPositions = [
    [8, 18],
    [21, 52],
    [34, 27],
    [47, 65],
    [59, 35],
    [71, 58],
    [83, 22],
    [92, 70]
];

cowPositions.forEach((position, index) => {

    const cow = document.createElement("div");

    cow.className = "cow";
    cow.textContent = "🐄";

    /*
        Position cows within the pasture itself.
        Y is a percentage of the pasture height.
    */
    cow.style.left = `${position[0]}%`;
    cow.style.bottom = `${position[1]}%`;

    /*
        Give every cow its own wandering path.
    */
    cow.style.setProperty(
        "--cow-x1",
        `${-15 + Math.random() * 30}px`
    );

    cow.style.setProperty(
        "--cow-y1",
        `${-8 + Math.random() * 16}px`
    );

    cow.style.setProperty(
        "--cow-x2",
        `${-30 + Math.random() * 60}px`
    );

    cow.style.setProperty(
        "--cow-y2",
        `${-15 + Math.random() * 30}px`
    );

    cow.style.setProperty(
        "--cow-x3",
        `${-20 + Math.random() * 40}px`
    );

    cow.style.setProperty(
        "--cow-y3",
        `${-10 + Math.random() * 20}px`
    );

    cow.style.setProperty(
        "--cow-speed",
        `${7 + Math.random() * 8}s`
    );

    cow.style.setProperty(
        "--cow-delay",
        `${Math.random() * -10}s`
    );

    grass.appendChild(cow);
});

/* #endregion */

/* #endregion */