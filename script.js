(() => {
    const initializeStorage = () => {
        if (localStorage.getItem("turns_counter") === null) {
            localStorage.setItem("turns_counter", 0);
        }
        if (localStorage.getItem("boops_counter") === null) {
            localStorage.setItem("boops_counter", 0);
        }
    };

    const video = document.getElementById("video");
    let turnIntervals = [];
    let boopTimeout = null;

    const startLoading = async () => {
        document.querySelectorAll(".turns-counter").forEach(v =>
            v.innerText = localStorage.getItem("turns_counter"));
        document.querySelectorAll(".boops-counter").forEach(v =>
            v.innerText = localStorage.getItem("boops_counter"));

        const loadingTitle = document.querySelector(".loading-text .loading-title");
        
        try {
            const response = await fetch('video.mp4');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const reader = response.body.getReader();
            const contentLength = +response.headers.get('Content-Length');
            
            let receivedLength = 0;
            let chunks = [];
            
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;
                
                chunks.push(value);
                receivedLength += value.length;
                
                const percent = (receivedLength / contentLength) * 100;
                loadingTitle.innerText = `Loading ${Math.round(percent)}%`;
            }
            
            const blob = new Blob(chunks, { type: 'video/mp4' });
            const videoUrl = URL.createObjectURL(blob);
            
            video.src = videoUrl;
            video.loop = true;
            
            // Set up event listeners before playing
            setupVideoListeners();
            
            stopLoading();
        } catch (error) {
            console.error('Error downloading video:', error);
            loadingTitle.innerText = "Error loading video";
        }
    };

    const stopLoading = () => {
        const loadingTitle = document.querySelector(".loading-text .loading-title");
        loadingTitle.innerText = "Click to start";
        
        document.querySelector(".loading-view").onclick = () => {
            document.querySelector(".main-container").style.display = "flex";
            document.querySelector(".loading-view").style.display = "none";
            video.play();
        };
    };

    const setupVideoListeners = () => {
        // This will trigger on initial play AND when video loops and continues playing
        video.addEventListener("playing", () => {
            console.log('Video playing event - starting cycles');
            startTurnCycle();
            startBoopCycle();
        });
    };

    const clearAllTurnIntervals = () => {
        turnIntervals.forEach(interval => clearInterval(interval));
        turnIntervals = [];
    };

    const startBoopCycle = () => {
        // Clear any existing boop timeout
        if (boopTimeout) {
            clearTimeout(boopTimeout);
        }
        
        // Schedule boop at 42.290 seconds
        boopTimeout = setTimeout(() => {
            addBoop();
            console.log('Boop triggered at 42.290s');
        }, 42290);
    };

    const startTurnCycle = () => {
        clearAllTurnIntervals();
        
        const phase1 = setInterval(() => {
            addTurn();
        }, 200);
        turnIntervals.push(phase1);
        setTimeout(() => clearInterval(phase1), 30060);
        
        setTimeout(() => {
            const phase2 = setInterval(() => {
                addTurn();
            }, 800);
            turnIntervals.push(phase2);
            setTimeout(() => clearInterval(phase2), 4060);
        }, 30060);
        
        setTimeout(() => {
            const phase3 = setInterval(() => {
                addTurn();
            }, 100);
            turnIntervals.push(phase3);
            setTimeout(() => clearInterval(phase3), 5930);
        }, 33240);
        
        setTimeout(() => {
            const phase4 = setInterval(() => {
                addTurn();
            }, 100);
            turnIntervals.push(phase4);
            setTimeout(() => clearInterval(phase4), 2230);
        }, 34000);
        
        setTimeout(() => {
            const phase5 = setInterval(() => {
                addTurn();
            }, 200);
            turnIntervals.push(phase5);
            setTimeout(() => clearInterval(phase5), 2980);
        }, 37030);
    };

    const addTurn = () => {
        const currentTurns = parseInt(document.querySelector(".turns-counter").innerText);
        if (currentTurns % 100 == 0) {
            localStorage.setItem("turns_counter", currentTurns + 1);
        }
        document.querySelectorAll(".turns-counter").forEach(v =>
            v.innerText = currentTurns + 1);
    };
    
    const addBoop = () => {
        const currentBoops = parseInt(document.querySelector(".boops-counter").innerText);
        localStorage.setItem("boops_counter", currentBoops + 1);
        document.querySelectorAll(".boops-counter").forEach(v =>
            v.innerText = currentBoops + 1);
    };

    document.addEventListener('DOMContentLoaded', () => {
        initializeStorage();
        startLoading();
    });
})();