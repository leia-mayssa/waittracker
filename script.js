const rightPanel = document.getElementById("right-panel");
const transcript = document.getElementById("transcript");
const output = document.getElementById("output");
const timeDisplay = document.getElementById("time");
const waitRate = document.getElementById("wait-rate");

let isListening = false;
let startTime;
let count = 0;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;

recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = true;

rightPanel.addEventListener("click", toggleListening);

function toggleListening() {
    if (rightPanel.classList.contains("idle") || rightPanel.classList.contains("result")) {
        startTime = Date.now();
        recognition.start();
        isListening = true;
        // transcript.textContent = "..."
        output.textContent = 0;
        count = 0;
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

recognition.onresult = function (event) {
    let text = ""
    for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
    }
    // transcript.textContent = text;

    let modifiedText = text.toLowerCase().replace(/[^a-z\s]/g, " ");
    let words = modifiedText.split(/\s+/);
    count = 0;
    for (let word of words) {
        if (word === "wait") {
            count++;
        }
    }
    output.textContent = count
};
