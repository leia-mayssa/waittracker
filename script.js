const rightPanel = document.getElementById("right-panel");
const transcript = document.getElementById("transcript");
const output = document.getElementById("output");
const timeDisplay = document.getElementById("time");
const waitRate = document.getElementById("wait-rate");
const iosPopup = document.getElementById("ios-popup");
const closeIosPopup = document.getElementById("close-ios-popup");
const androidPopup = document.getElementById("android-popup");
const closeAndroidPopup = document.getElementById("close-android-popup");
const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isAndroid = /Android/.test(navigator.userAgent);

let isListening = false;
let startTime;
let count = 0;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("your browser does not support speech recognition.")
}

let recognition;

recognition = new SpeechRecognition();

if (isAndroid) {
    recognition.continuous = false;
    recognition.interimResults = false;
} else {
    recognition.continuous = true;
    recognition.interimResults = true;
}

recognition.lang = "en-US";

rightPanel.addEventListener("click", toggleListening);

function toggleListening() {
    if (isIos) {
        iosPopup.classList.add("show");
        return;
    }

    if (rightPanel.classList.contains("idle") || rightPanel.classList.contains("result")) {
        if (rightPanel.classList.contains("idle") && isAndroid) {
            androidPopup.classList.add("show");
        }

        startTime = Date.now();
        count = 0;
        recognition.start();
        isListening = true;
        // transcript.textContent = "..."
        output.textContent = 0;
        setState("recording");
    } else if (rightPanel.classList.contains("recording")) {
        recognition.stop();
        isListening = false;
        let time = (Date.now() - startTime)/1000;
        let waitsPerMin = count / (time/60);
        timeDisplay.textContent = time.toFixed(2);
        waitRate.textContent = waitsPerMin.toFixed(2);
        setState("result");
    }
}

function setState(state) {
    rightPanel.classList.remove("idle", "recording", "result");
    rightPanel.classList.add(state);
}

recognition.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
        if (!event.results[i].isFinal) {
            continue;
        }

        const text = event.results[i][0].transcript.toLowerCase().replace(/[^a-z\s]/g, " ");
        const words = text.split(/\s+/);

        for (let word of words) {
            if (word === "wait") {
                count++;
            }
        }
    }

    output.textContent = count;
};

recognition.onend = () => {
    if (isListening && isAndroid) {
        setTimeout(() => {
            try {
                recognition.start();
            } catch (err) {
                alert("error, please try again.");
                isListening = false;
                setState("idle");
            }
        }, 200);
    }
};


closeIosPopup.addEventListener("click", () => {
  iosPopup.classList.remove("show");
});

closeAndroidPopup.addEventListener("click", () => {
  androidPopup.classList.remove("show");
});
