document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("startButton");
    const pauseButton = document.getElementById("pauseButton");
    const speedSlider = document.getElementById("speedSlider");
    const displayText = document.getElementById("displayText");
    const backButton = document.getElementById("backButton");
    const forwardButton = document.getElementById("forwardButton");
    const breakToggle = document.getElementById("breakToggle");
    const readingSpeedValue = document.getElementById("readingSpeedValue");
    const readingTimeValue = document.getElementById("readingTimeValue");
    const textInput = document.getElementById("textInput");
    const wordCountValue = document.getElementById("wordCountValue");


    let words = [];
    let currentIndex = 0;
    let intervalId;

    let showBreaks = true;

    pauseButton.addEventListener("click", pauseReading);
    speedSlider.addEventListener("input", updateReadingSpeed);
    backButton.addEventListener("click", goBack);
    forwardButton.addEventListener("click", goForward);
    breakToggle.addEventListener("click", toggleBreaks);
    speedSlider.dispatchEvent(new Event('input'));

    const currentSpeed = parseInt(speedSlider.value);
    document.getElementById("readingSpeedValue").textContent = currentSpeed;

    textInput.addEventListener("input", function () {
        adjustValues()
    });

    function adjustValues() {
        const currentText = textInput.value;
        const currentWordCount = countWords(currentText);
        wordCountValue.textContent = currentWordCount;

        const currentReadingSpeed = parseInt(readingSpeedValue.textContent);
        const readingTimeInSeconds = calculateReadingTime(currentWordCount, currentReadingSpeed);
        const formattedReadingTime = formatTime(readingTimeInSeconds);

        readingTimeValue.textContent = formattedReadingTime;
    }

    function calculateReadingTime(wordCount, readingSpeed) {
        const wordsPerSecond = readingSpeed / 60;
        const timeInSeconds = wordCount / wordsPerSecond;
        return Math.round(timeInSeconds);
    }

    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return `${padZero(hours)}:${padZero(minutes)}:${padZero(remainingSeconds)}`;
    }

    function padZero(number) {
        return number < 10 ? `0${number}` : number;
    }

    function countWords(text) {
        return text.trim().split(/\s+/).filter(word => word !== "").length;
    }

    speedSlider.addEventListener("input", function () {
        const currentSpeed = parseInt(speedSlider.value);
        readingSpeedValue.textContent = currentSpeed;
        adjustValues()
    });

    // Modify the startButton event listener
    startButton.addEventListener("click", function () {
        if (intervalId) {
            pauseReading();
        } else {
            startReading();
        }
    });


    // Function to adjust the reading speed
    function adjustSpeed(change) {
        const currentSpeed = parseInt(speedSlider.value);
        const newSpeed = Math.max(50, Math.min(600, currentSpeed + change)); // Limit the speed between 50 and 600
        speedSlider.value = newSpeed;
        readingSpeedValue.textContent = newSpeed;
        updateReadingSpeed();
    }



    document.addEventListener("keydown", function (event) {
        // Check if the focus is on the text input field
        const activeElement = document.activeElement;
        const isTextInputActive = activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA");

        if (!isTextInputActive) {
            if (event.keyCode === 32) { // Space bar key code
                if (intervalId) {
                    pauseReading();
                } else {
                    startReading();
                }
                event.preventDefault(); // Prevent space bar from scrolling the page
            } else if (event.keyCode === 37) { // Left arrow key code
                goBack();
                event.preventDefault(); // Prevent arrow key from scrolling the page
            } else if (event.keyCode === 39) { // Right arrow key code
                goForward();
                event.preventDefault(); // Prevent arrow key from scrolling the page
            } else if (event.keyCode === 38) { // Up arrow key code
                adjustSpeed(10); // Increase speed by 10
                adjustValues()
                event.preventDefault(); // Prevent arrow key from scrolling the page
            } else if (event.keyCode === 40) { // Down arrow key code
                adjustSpeed(-10); // Decrease speed by 10
                adjustValues()
                event.preventDefault(); // Prevent arrow key from scrolling the page
            } else if (event.keyCode === 66) { // "B" key code
                toggleBreaks();
                event.preventDefault(); // Prevent "B" key from performing default action
            }
        }
    });

    // ... Your existing code ...

    // Function to adjust the reading speed
    function adjustSpeed(change) {
        const currentSpeed = parseInt(speedSlider.value);
        const newSpeed = Math.max(50, Math.min(600, currentSpeed + change)); // Limit the speed between 50 and 600
        speedSlider.value = newSpeed;
        readingSpeedValue.textContent = newSpeed;
        updateReadingSpeed();
    }



    function toggleBreaks() {
        showBreaks = !showBreaks;
        updateBreakButtonStyle();
        startReading();
    }

    function startReading() {

        if (intervalId) {
            clearInterval(intervalId);
        }

        if (currentIndex >= words.length) {
            currentIndex = 0;
        }

        words = getTextWords();
        intervalId = setInterval(showNextWord, calculateWordDuration());

        startButton.disabled = true;
        pauseButton.disabled = false;

    }

    function pauseReading() {
        clearInterval(intervalId);
        intervalId = null;
        currentIndex--;
        startButton.disabled = false;
        pauseButton.disabled = true;
    }


    function updateReadingSpeed() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = setInterval(showNextWord, calculateWordDuration());
        }
        startReading();
    }


    function showNextWord() {
        if (currentIndex < words.length) {
            const currentWord = words[currentIndex];
            displayText.textContent = currentWord;
            currentIndex++;
        } else {
            clearInterval(intervalId);
            startButton.disabled = false;
            pauseButton.disabled = true;
        }
    }

    function goBack() {
        const secondsEquivalent = 5;
        const wordsToGoBack = calculateWordsEquivalent(secondsEquivalent);
        currentIndex = Math.max(currentIndex - wordsToGoBack, 0);
        displayText.textContent = words[currentIndex] || "";

        document.body.classList.add('highlight');
        setTimeout(() => {
            document.body.classList.remove('highlight');
        }, 300);
    }

    function goForward() {
        const secondsEquivalent = 10;
        const wordsToGoForward = calculateWordsEquivalent(secondsEquivalent);
        currentIndex = Math.min(currentIndex + wordsToGoForward, words.length - 1);
        displayText.textContent = words[currentIndex] || "";

        document.body.classList.add('highlight');
        setTimeout(() => {
            document.body.classList.remove('highlight');
        }, 300);
    }

    function calculateWordsEquivalent(seconds) {
        const readingSpeed = parseInt(speedSlider.value);
        const wordsPerSecond = readingSpeed / 60;
        return Math.round(wordsPerSecond * seconds);
    }

    function calculateWordDuration() {
        let readingSpeed = parseInt(speedSlider.value);
        console.log(parseInt(speedSlider.value))
        let currentWord = words[currentIndex];
        let wordLength = currentWord.length;
        let baseMillisecondsPerWord = (60 / readingSpeed) * 1000;

        const wordLengthFactor = 0.15;

        const millisecondsPerWord = baseMillisecondsPerWord + (wordLength * wordLengthFactor);

        return wordLength > 0 ? Math.max(millisecondsPerWord, 100) : 100;
    }

    function updateBreakButtonStyle() {
        if (showBreaks) {
            breakToggle.classList.remove("red");
        } else {
            breakToggle.classList.add("red");
        }
    }

    function getTextWords() {
        const inputText = document.getElementById("textInput").value;
        const paragraphs = inputText.split('\n');
        let words = [];

        for (const paragraph of paragraphs) {
            const paragraphWords = paragraph.trim().split(/\s+/);
            words = words.concat(paragraphWords);

            if (showBreaks) {
                for (var i = 0; i < 5; i++) {
                    words.push(" ".repeat(5));
                }
            }

        }

        return words;
    }
});
