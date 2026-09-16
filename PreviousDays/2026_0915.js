const customCursor = document.getElementById("custom-cursor");
const asciiElement = document.getElementById("ascii");
const dialogueElement = document.getElementById("dialogue");
const choiceArea = document.getElementById("choice-area");
const headEmoji = document.getElementById("head-emoji");


/* =========================================================
   TEST MODE

   Leave this as "" for normal gameplay.

   Available test modes:
   "opening"
   "hands"
   "clown"
   "clown-yes"
   "clown-no"
   "apple"
   "kiss"
   "kiss-forehead"
   "kiss-cheek"
   "kiss-lips"
   "kiss-peppermint"
   "monkey"
   "scooter"
   ========================================================= */

const TEST_MODE = "";


const emojiChoices = [
    "🤡",
    "🍎",
    "😘",
    "🙈",
    "👩‍🦼‍➡️"
];


const openingLines = [
    "You reach the gate.",
    "Standing before you is the Headless Horseman.",
    "Headless and on a horse, man.",
    "He reaches down and holds out his hand."
];


function showAscii(art) {
    asciiElement.textContent = art;

    requestAnimationFrame(() => {
        fitAsciiToArea();
        positionHeadOverAscii();
    });
}


function fitAsciiToArea() {
    const area = document.getElementById("ascii-area");

    const availableWidth = area.clientWidth;
    const availableHeight = area.clientHeight;

    const naturalWidth = asciiElement.scrollWidth;
    const naturalHeight = asciiElement.scrollHeight;

    if (!naturalWidth || !naturalHeight) {
        return;
    }

    const widthScale = availableWidth / naturalWidth;
    const heightScale = availableHeight / naturalHeight;

    const scale = Math.min(1, widthScale, heightScale);

    asciiElement.style.transform = `scale(${scale})`;

    requestAnimationFrame(positionHeadOverAscii);
}


function positionHeadOverAscii() {
    if (!asciiElement.textContent || !headEmoji.textContent) {
        return;
    }

    const area = document.getElementById("ascii-area");
    const text = asciiElement.firstChild;

    if (!text) {
        return;
    }

    /*
       The head is positioned directly over the first
       continuous run of @ characters in the ASCII.
    */

    const lines = asciiElement.textContent.split("\n");

    let lineStart = 0;
    let targetLine = -1;
    let targetStart = -1;
    let targetEnd = -1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const firstAt = line.indexOf("@");

        if (firstAt !== -1) {
            let endAt = firstAt;

            while (endAt < line.length && line[endAt] === "@") {
                endAt++;
            }

            targetLine = i;
            targetStart = lineStart + firstAt;
            targetEnd = lineStart + endAt;

            break;
        }

        lineStart += line.length + 1;
    }

    if (targetLine === -1) {
        return;
    }

    const range = document.createRange();

    range.setStart(text, targetStart);
    range.setEnd(text, targetEnd);

    const rect = range.getBoundingClientRect();
    const areaRect = area.getBoundingClientRect();

    const targetX = rect.left + rect.width / 2 - areaRect.left;
    const targetY = rect.top - areaRect.top;

    /*
       These must be zero because targetX/targetY are already
       the correct calculated position. The ghost-head animation
       should only wobble around that position.
    */

    headEmoji.style.setProperty("--head-x", "-70px");
    headEmoji.style.setProperty("--head-y", "-15px");

    headEmoji.style.left = `${targetX}px`;
    headEmoji.style.top = `${targetY}px`;
}


function showLine(text, callback) {
    dialogueElement.innerHTML = "";

    const p = document.createElement("p");
    p.textContent = text;

    dialogueElement.appendChild(p);

    dialogueElement.onclick = callback;
}


function clearDialogue() {
    dialogueElement.innerHTML = "";
    dialogueElement.onclick = null;
}


function clearChoices() {
    choiceArea.innerHTML = "";
    choiceArea.classList.remove("hands");
}


/* =========================================================
   THE END
   ========================================================= */

function showTheEnd() {
    clearDialogue();
    clearChoices();

    const end = document.createElement("div");

    end.textContent = "THE END";
    end.className = "the-end";

    dialogueElement.appendChild(end);
}


/* =========================================================
   OPENING
   ========================================================= */

let openingIndex = 0;


/* =========================================================
   CUSTOM CURSOR
   ========================================================= */

function colorCursorArt(art) {
    return art
        .split("")
        .map(character => {
            if (character === "=") {
                return `<span class="cursor-cyan">=</span>`;
            }

            if (character === " ") {
                return " ";
            }

            return `<span>${character}</span>`;
        })
        .join("");
}


function setCursorArt(art) {
    customCursor.innerHTML = colorCursorArt(art);
}


function moveCustomCursor(event) {
    customCursor.style.left = `${event.clientX}px`;
    customCursor.style.top = `${event.clientY}px`;
}


function cursorDown() {
    setCursorArt(ASCII.ascii_20260915_Cursor_Clicked);
}


function cursorUp() {
    setCursorArt(ASCII.ascii_20260915_Cursor_Unclicked);
}


setCursorArt(ASCII.ascii_20260915_Cursor_Unclicked);

document.addEventListener("mousemove", moveCustomCursor);
document.addEventListener("mousedown", cursorDown);
document.addEventListener("mouseup", cursorUp);


function startGame() {
    showAscii(ASCII.ascii_20260915_Horseman_01);

    headEmoji.textContent = "";
    headEmoji.classList.remove("visible");

    clearChoices();

    if (TEST_MODE) {
        startTestMode();
        return;
    }

    showOpeningLine();
}


function showOpeningLine() {
    showLine(
        openingLines[openingIndex],
        advanceOpening
    );
}


function advanceOpening() {
    openingIndex++;

    if (openingIndex < openingLines.length) {
        showOpeningLine();
    } else {
        showEmojiChoice();
    }
}


/* =========================================================
   TEST MODE
   ========================================================= */

function startTestMode() {
    switch (TEST_MODE) {

        case "opening":
            openingIndex = 0;
            showOpeningLine();
            break;

        case "hands":
            showEmojiChoice();
            break;

        case "clown":
            showTestHead("🤡");
            clownPath();
            break;

        case "clown-yes":
            showTestHead("🤡");
            clownYes();
            break;

        case "clown-no":
            showTestHead("🤡");
            clownNo();
            break;

        case "apple":
            showTestHead("🍎");
            applePath();
            break;

        case "kiss":
            showTestHead("😘");
            kissPath();
            break;

        case "kiss-forehead":
            showTestHead("😘");
            kissForehead();
            break;

        case "kiss-cheek":
            showTestHead("😘");
            kissCheek();
            break;

        case "kiss-lips":
            showTestHead("😘");
            kissLips();
            break;

        case "kiss-peppermint":
            showTestHead("😘");
            kissPeppermint();
            break;

        case "monkey":
            showTestHead("🙈");
            monkeyPath();
            break;

        case "scooter":
            showTestHead("👩‍🦼‍➡️");
            scooterPath();
            break;

        default:
            console.warn("Unknown TEST_MODE:", TEST_MODE);
            showOpeningLine();
            break;
    }
}


function showTestHead(emoji) {
    headEmoji.textContent = emoji;
    headEmoji.classList.add("visible");

    positionHeadOverAscii();

    clearChoices();
}


/* =========================================================
   EMOJI CHOICE
   ========================================================= */

function showEmojiChoice() {
    clearDialogue();
    clearChoices();

    choiceArea.classList.add("hands");

    const hands = document.createElement("pre");

    hands.id = "hands-ascii";
    hands.textContent = ASCII.ascii_20260915_OpenHands_01;

    choiceArea.appendChild(hands);

    const emojiRow = document.createElement("div");

    emojiRow.id = "emoji-row";

    emojiChoices.forEach(emoji => {
        const choice = document.createElement("span");

        choice.className = "emoji-choice";
        choice.textContent = emoji;

        choice.addEventListener("click", () => {
            chooseHead(emoji);
        });

        emojiRow.appendChild(choice);
    });

    choiceArea.appendChild(emojiRow);
}


/* =========================================================
   CHOOSE HEAD
   ========================================================= */

function chooseHead(emoji) {
    headEmoji.textContent = emoji;
    headEmoji.classList.add("visible");

    positionHeadOverAscii();

    clearChoices();

    switch (emoji) {
        case "🤡":
            clownPath();
            break;

        case "🍎":
            applePath();
            break;

        case "😘":
            kissPath();
            break;

        case "🙈":
            monkeyPath();
            break;

        case "👩‍🦼‍➡️":
            scooterPath();
            break;
    }
}


/* =========================================================
   DIALOGUE SEQUENCE
   ========================================================= */

function playLines(lines, finishedCallback) {
    let index = 0;

    function next() {
        if (index >= lines.length) {
            clearDialogue();

            if (finishedCallback) {
                finishedCallback();
            }

            return;
        }

        showLine(lines[index], () => {
            index++;
            next();
        });
    }

    next();
}


/* =========================================================
   YES / NO
   ========================================================= */

function addBinaryChoices(yesCallback, noCallback) {
    clearChoices();

    addBinaryChoice("Y", yesCallback);
    addBinaryChoice("N", noCallback);
}


function addBinaryChoice(text, callback) {
    const button = document.createElement("button");

    button.className = "binary-choice";
    button.textContent = text;

    button.addEventListener("click", () => {
        clearChoices();
        callback();
    });

    choiceArea.appendChild(button);
}


/* =========================================================
   CLOWN
   ========================================================= */

function clownPath() {
    playLines([
        "I’ve been stuck in clown cars larger than those hands.",
        "Anyways I’ve got to get back to my wife at the Circus Factory.",
        "Want some free tickets to the next show?"
    ], () => {
        addBinaryChoices(clownYes, clownNo);
    });
}


function clownYes() {
    playLines([
        "Beautiful! I don’t have them on me. Didn’t have any pockets while you were holding me hostage in your pockets.",
        "Hop on and we’ll ride to the circus together.",
        "You climb up on the horse and wrap your arms around his clownly waist.",
        "His insides squeak softly as the horse gallops away."
    ], showTheEnd);
}


function clownNo() {
    playLines([
        "No worries, I completely understand.",
        "I can tell you already have an eventful evening planned based on the way you’re dressed.",
        "Honk this nose if you ever need anything."
    ], () => {
        const nose = document.createElement("div");

        nose.textContent = "🔴";
        nose.style.fontSize = "70px";
        nose.style.cursor = "pointer";

        nose.addEventListener("click", showTheEnd);

        choiceArea.appendChild(nose);
    });
}


/* =========================================================
   APPLE
   ========================================================= */

function applePath() {
    playLines([
        "*mmefm mmflph mmmemllff",
        "I’m sorry I didn’t quite catch that, repeat?",
        "*mmefm mmflph mmmemllff",
        "You get the feeling this isn’t going anywhere productive.",
        "You walk away and enjoy the rest of your evening."
    ], showTheEnd);
}


/* =========================================================
   KISS
   ========================================================= */

function kissPath() {
    playLines([
        "What a stallion. My goodness, you’re more handsome than the horse I rode in on. Mayn’t I give you a smoocher to express my gratitude?"
    ], () => {
        addBinaryChoices(kissForehead, kissInitialNo);
    });
}


function kissInitialNo() {
    playLines([
        "Ever-respectful, the Headless Horseman does not kiss your cheek. You two spend the next hour or so playing cooperative games on the pink and green Gameboy Colors he had in the saddle pouch."
    ], showTheEnd);
}


function kissForehead() {
    playLines([
        "The Headless Horseman gives you a respectful, platitudinal kiss on the forehead. Do you request one on the cheek?"
    ], () => {
        addBinaryChoices(kissCheek, kissNo);
    });
}


function kissCheek() {
    playLines([
        "The Headless Horseman gives you a respectful, platitudinal kiss on the cheek. Do you ask for one on the lips?"
    ], () => {
        addBinaryChoices(kissLips, kissPeppermint);
    });
}


function kissNo() {
    playLines([
        "The Headless Horseman respects your boundaries and wishes you a wonderful evening. You and Headless Horseman each galavant your own separate ways, each silently appreciating the respectful encounter you encountered this evening."
    ], showTheEnd);
}


function kissLips() {
    playLines([
        "The Headless Horseman, while appreciative of your enthusiastic offer to smack lips, informs you that he’s not currently interested in romantic entanglements as his most recent relationship ended under less-than-ideal circumstances.",
        "He’s not emotionally ready for lip-to-lip action just yet.",
        "He writes down his phone number, lets you know he does not have a voicemail, and hands it to you kindly. There’s a whimsical cartoon horse drawn next to the phone number."
    ], showTheEnd);
}


function kissPeppermint() {
    playLines([
        "The Headless Horseman offers you a York Peppermint Pattie. Such a thoughtful gift. Reasonable in calories and full of mint flavor. You enjoy the candy and continue on with your evening."
    ], showTheEnd);
}


/* =========================================================
   🙈
   ========================================================= */

function monkeyPath() {
    playLines([
        "My goodness, I don’t know how this happened. My hands are glued to my eyes. If my hands weren’t glued to my eyes, I may have been able to see how my hands got glued to my eyes.",
        "You notice his horse looks thirsty. You can tell from your years of training at the Thirst Institute of Thirstiness. You lead the Headless Horseman’s horse, Horse, to water, but you wouldn’t dare make him drink it."
    ], showTheEnd);
}


/* =========================================================
   MOBILITY SCOOTER
   ========================================================= */

function scooterPath() {
    playLines([
        "Suddenly and without warning, the Headless Horseman’s body is crushed under the weight of a man facing rightwards in a mobility scooter. The man scoots away to enjoy a romantic evening with his wife and girlfriend. The horse, non-plussed, rides away with the Horseman, plussed, crumpled in a crumpled mass upon the uncrumpled horse."
    ], showTheEnd);
}


startGame();

window.addEventListener("resize", fitAsciiToArea);