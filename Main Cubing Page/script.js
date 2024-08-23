// Time Page Script

const clearRecordsBtn = document.getElementById('clear-records-btn')
const newScrambleBtn = document.getElementById('new-scramble-btn');
const removePrevSolveBtn = document.getElementById('remove-prev-solve-btn');
const showOptionsBtn = document.getElementById('show-options-btn');
const hideOptionsBtn = document.getElementById('hide-options-btn');
const hideDuringSolve = document.getElementById('hide-during-solve');

const inspectionTimeInput = document.getElementById('inspection-time'); 

const currentAveragesContainer = document.getElementById('current-averages')
const optionsPage = document.getElementById('options-page-border');
const scrambleContainer = document.getElementById('scramble-container');
const scrambleText = document.getElementById('scramble-text');
const timer = document.getElementById('timer');
const timerContainer = document.getElementById('timer-container');
const userDataContainer = document.getElementById('user-data-container');

const meanOfAllText = document.getElementById('mean-of-all');

const bestTimeText = document.getElementById('best-time');

const currMo3Text = document.getElementById('current-Mo3');
const bestMo3Text = document.getElementById('best-Mo3');

const currAo5Text = document.getElementById('current-Ao5');
const bestAo5Text = document.getElementById('best-Ao5');

const currAo12Text = document.getElementById('current-Ao12');
const bestAo12Text = document.getElementById('best-Ao12');

let optionsShowing = false;
let inspectionTimerRunnning = false;
let timerRunning = false;
let timerStartTime = new Date();

// Count of number of (non-DNF) solves completed so far
let numberOfSolves = parseInt(localStorage.getItem('numberOfSolves')) || 0;
// Array of objects of the form {time, meanOfAll, bestTime, bestMo3, bestAo5, bestAo12}
let previousTimes = JSON.parse(localStorage.getItem('previousTimes')) || [];

// Function to generate a new (random-move) scramble and show it on page
const generateNewScramble = () => {
    // List of possible faces to be turned on next move
    const faces = ['U', 'D', 'F', 'B', 'L', 'R'];
    // List of possible directions to rotate a face
    const directions = [" ", "' ", "2 "];

    let newScramble = '';
    let currentNumberOfMoves = 0;
    let prevFaceIndex = 6;

    // Generate a new scramble 20 moves in length
    while (currentNumberOfMoves < 20) {
        // Choose random elements from list of faces and directions and append to new scramble
        let randomFaceIndex = Math.floor(Math.random() * 6);
        const randomDirectionIndex = Math.floor(Math.random() * 3);

        // Ensure haven't chosen same face as on previous move
        while (randomFaceIndex === prevFaceIndex) {
            randomFaceIndex = Math.floor(Math.random() * 6);
        }
        newScramble += faces[randomFaceIndex] + directions[randomDirectionIndex];

        prevFaceIndex = randomFaceIndex;
        currentNumberOfMoves += 1;
    }
    
    // Update scramble displayed on page
    scrambleText.innerText = newScramble;
}

//Function to properly format time from ms into minutes : seconds . hundredthsOfSeconds
const formatTime = (milliseconds) => {
    const minsPassed = Math.floor(milliseconds / 60000);
    const secondsPassed = Math.floor(milliseconds / 1000) % 60;
    const hundredthsOfSecondsPassed = Math.floor(milliseconds / 10) % 100;
    return `${minsPassed}:${(secondsPassed < 10) ? 0 : ''}${secondsPassed}.${(hundredthsOfSecondsPassed < 10) ? 0 : ''}${hundredthsOfSecondsPassed}`
}

// Function to calculate average (mean value of array with best and worst times removed) of an array
const calcAverage = (arr) => {
    let numberOfDNFs = arr.filter(time => time === 'DNF').length
    // If multiples DNF's in array then average is a DNF
    if (numberOfDNFs > 1) {
        return 'DNF'
    } else if (numberOfDNFs === 1) {
        // Remove DNF from array and replace with infinity
        arr.splice(arr.indexOf('DNF'), 1)
        arr.push(Infinity);
    }
    // Find largest and smallest elements of array and remove them 
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    
    arr.splice(arr.indexOf(min), 1);
    arr.splice(arr.indexOf(max), 1);
    // Calculate average
    const sum = arr.reduce((acc, num) => acc + num, 0);
    return (sum)/(arr.length);
}

// Function to calculate averages and update records if needed
const updateAverages = (time) => {
    const previousTime = previousTimes[0] || {'meanOfAll': Infinity, 'bestTime' : Infinity, 'bestMo3': Infinity, 'bestAo5': Infinity, 'bestAo12': Infinity};
    let meanOfAll = previousTime['meanOfAll'] || Infinity;
    let bestTime = previousTime['bestTime'] || Infinity;
    let currMo3 = 'N/A';
    let bestMo3 = previousTime['bestMo3'] || Infinity;
    let currAo5 = 'N/A';
    let bestAo5 = previousTime['bestAo5'] || Infinity;
    let currAo12 = 'N/A';
    let bestAo12 = previousTime['bestAo12'] || Infinity;
    // Update mean of all times so far (only if current time is not DNF)
    if (time !== 'DNF') {
        if (isFinite(meanOfAll)) {
            meanOfAll = (meanOfAll * numberOfSolves + time) / (numberOfSolves + 1)
        } else {
            meanOfAll = time;
        } 
        meanOfAllText.innerText = (isFinite(meanOfAll)) ? formatTime(meanOfAll) : 'N/A';
        numberOfSolves += 1;
    }

    // Check if given time is better than current record
    if (time !== 'DNF' && time < bestTime) {
        bestTime = time;
    }
    bestTimeText.innerText = (isFinite(bestTime)) ? formatTime(bestTime) : 'N/A';

    // Check if most recent Mo3 is better than current record and update current Mo3
    if (previousTimes.length >= 2) {
        currMo3 = (time + previousTimes[0]['time'] + previousTimes[1]['time']) / 3;
        currMo3Text.innerText = (isNaN(currMo3)) ? 'DNF' : formatTime(currMo3);
        if ((!isFinite(bestMo3)) || (!isNaN(currMo3) && currMo3 < bestMo3)) {
            bestMo3 = currMo3;
        }
        bestMo3Text.innerText = (isNaN(bestMo3)) ? 'DNF' : formatTime(bestMo3);    
    } else {
        currMo3Text.innerText = 'N/A';
        bestMo3Text.innerText = 'N/A';
    }

    // Check if most recent Ao5 is better than current record and update current Ao5
    if (previousTimes.length >= 4) {
        let prevFiveTimes = [time];
        previousTimes.slice(0,4).forEach(obj => {prevFiveTimes.push(obj['time'])});
        currAo5 = calcAverage(prevFiveTimes);
        currAo5Text.innerText = (currAo5 === 'DNF') ? 'DNF' : formatTime(currAo5);
        if ((!isFinite(bestAo5)) || currAo5 !== 'DNF' && currAo5 < bestAo5) {
            bestAo5 = currAo5;
        }
        bestAo5Text.innerText = (bestAo5 === 'DNF') ? 'DNF' : formatTime(bestAo5);
    } else {
        currAo5Text.innerText = 'N/A';
        bestAo5Text.innerText = 'N/A';
    }
    
    // Check if most recent Ao12 is better than current record and update current Ao12
    if (previousTimes.length >= 11) {
        let prevTwelveTimes = [time];
        previousTimes.slice(0,11).forEach(obj => {prevTwelveTimes.push(obj['time'])});
        currAo12 = calcAverage(prevTwelveTimes);
        currAo12Text.innerText = (currAo12 === 'DNF') ? 'DNF' : formatTime(currAo12);
        if ((!isFinite(bestAo12)) || currAo12 !=='DNF' && currAo12 < bestAo12) {
            bestAo12 = currAo12;
        }
        bestAo12Text.innerText = (bestAo12 === 'DNF') ? 'DNF' : formatTime(bestAo12);
    } else {
        currAo12Text.innerText = 'N/A';
        bestAo12Text.innerText = 'N/A';
    }
    if (time ==='DNF' || isFinite(time)) {
        previousTimes.unshift({'time': time, 'meanOfAll': meanOfAll, 'bestTime': bestTime, 'bestMo3': bestMo3, 'bestAo5': bestAo5, 'bestAo12': bestAo12});
    }   
}

// Function to remove most recent solve
const removePrevSolve = () => {
    const removedSolve = previousTimes.shift();
    // Lower number of solves count if necessary
    if (removedSolve && removedSolve['time'] !== 'DNF') {
        numberOfSolves -= 1;
    }
    const newMostRecentSolve = previousTimes.shift() || {'time': Infinity};
    updateAverages(newMostRecentSolve['time']);
}

// Function to reset users records (clears local storage)
const resetRecords = () => {
    previousTimes = [];
    numberOfSolves = 0;
    meanOfAllText.innerText = 'N/A';
    bestTimeText.innerText = 'N/A';
    bestMo3Text.innerText = 'N/A';
    currMo3Text.innerText = 'N/A';
    bestAo5Text.innerText = 'N/A';
    currAo5Text.innerText = 'N/A';
    bestAo12Text.innerText = 'N/A';
    currAo12Text.innerText = 'N/A';
}

// Function to stop timer and record an attempted solve as a DNF
const recordDNF = () => {
    timerRunning = false;
    inspectionTimerRunnning = false;
    timer.innerText = 'DNF';
    timer.style.color = 'rgb(255,0,0)';

    updateAverages('DNF')
}

// Function to start and run inspection timer
const startInspectionTime = () => {
    inspectionTimerRunnning = true;
    let remainingInspectionTime = 15;
    timer.innerText = '15s'
    const decrementInspectionTime = setInterval(() => {
        if (remainingInspectionTime > 0 && inspectionTimerRunnning) {
            remainingInspectionTime -= 1;
            timer.innerText = `${remainingInspectionTime}s`;
        } else if (remainingInspectionTime === 0 && inspectionTimerRunnning) {
            recordDNF();
            clearInterval(decrementInspectionTime);
        } else {
            clearInterval(decrementInspectionTime);
        }
    }, 1000)
}

// Function to start timer running
const timerStart = () => {
    // Check if user wishes to hide ui elements whilst timer is running
    if (hideDuringSolve.checked) {
        scrambleContainer.classList.add('hidden');
        currentAveragesContainer.classList.add('hidden');
        userDataContainer.classList.add('hidden');
        // Move timer to center of page
        timerContainer.classList.add('centered');
    }
    // Check if user wishes to use inspection time and that timer hasnt already been started
    if (inspectionTimeInput.value === '15s' && !inspectionTimerRunnning) {
        startInspectionTime()
    } else {
        inspectionTimerRunnning = false;
        timerRunning = true;

        timerStartTime = new Date();
        timer.innerText = '0:00.00';
        updateTimer()
    }
}

// Function to update timer whilst it is running
const updateTimer = () => {
    if (timerRunning) {
        const currentTime = new Date();
        // Compare current time to time at which timer was started
        const timePassed = currentTime - timerStartTime;
        // Update time displayed on page
        timer.innerText = formatTime(timePassed);
        requestAnimationFrame(updateTimer)
    }
}

// Function to stop timer running
const timerEnd = () => {
    // Check if user had hidden ui elements whilst timer running
    if (hideDuringSolve.checked) {
        scrambleContainer.classList.remove('hidden');
        currentAveragesContainer.classList.remove('hidden');
        userDataContainer.classList.remove('hidden');
        // Return timer to initial position
        timerContainer.classList.remove('centered');
    }
    timerRunning = false;
    // Add time achieved to list of previous times and update all averages
    const finalTime = new Date();
    const timeAchieved = finalTime - timerStartTime;
    // Update time displayed on page
    timer.innerText = formatTime(timeAchieved);
    updateAverages(timeAchieved);
    // Generate new scramble ready for next solve
    generateNewScramble();
}

// Check if on timer page then perform necessary start up functions
if (clearRecordsBtn) {
    // Get an intial scramble to display on page
    generateNewScramble();
    // Display current averages and records from local storage
    let mostRecentTime = previousTimes.shift() || {'time': Infinity}
    numberOfSolves -= 1;
    updateAverages(mostRecentTime['time']);

    // Add necessary event listeners to buttons on page
    clearRecordsBtn.addEventListener('click', () => {
        resetRecords();
        clearRecordsBtn.blur();
    });

    newScrambleBtn.addEventListener('click', () => {
        generateNewScramble();
        newScrambleBtn.blur();
    });

    removePrevSolveBtn.addEventListener('click', () => {
        removePrevSolve();
        removePrevSolveBtn.blur();
    })

    showOptionsBtn.addEventListener('click', () => {
        if (optionsShowing) {
            optionsPage.style.display = 'none';
            optionsShowing = false;
        } else {
            optionsPage.style.display = 'block';
            optionsShowing = true;
        }
        showOptionsBtn.blur();
    });

    hideOptionsBtn.addEventListener('click', () => {
        optionsPage.style.display = 'none';
        optionsShowing = false;
        hideOptionsBtn.blur();
    });

    // Add event listener to change timer colour when timer is about to be started, or end timer if it is already running
    document.addEventListener('keydown', (key) => {
        if (!optionsShowing && key.code === 'Space'){
            if (timerRunning) {
                timerEnd()
            } else {
                timer.style.color = '#dd6342';
            }
        }
    })

    // Add event listener to start timer and reset timer colour
    document.addEventListener('keyup', (key) => {
        if (!optionsShowing && key.code === 'Space') {
            // Check timer is trying to start
            if (timer.style.color === 'rgb(221, 99, 66)') {
                timerStart();
            }
            timer.style.color = '#000000';
        }
    })

    // Add event listener to update local storage when page is closed/refreshed
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('numberOfSolves', numberOfSolves);
        localStorage.setItem('previousTimes', JSON.stringify(previousTimes));
    })

    // Add event listener to show/hide user data on smaller screens
    const showUserDataBtn = document.getElementById('show-user-data-btn');
    let userDataIsShowing = true;
    showUserDataBtn.addEventListener('click', () => {
        if (userDataIsShowing) {
            userDataContainer.classList.add('hidden-media');
            showUserDataBtn.innerHTML = 'Show User Data';
            userDataIsShowing = false;
        } else if (!optionsShowing) {
            userDataContainer.classList.remove('hidden-media');
            showUserDataBtn.innerHTML = 'Hide User Data';
            userDataIsShowing = true;
        } 
    })
}


// Algorithm pages Script

const twoLookOLLContainer = document.getElementById('2-look-oll');
const twoLookPLLContainer = document.getElementById('2-look-pll');
const oneLookOLLContainer = document.getElementById('1-look-oll');
const oneLookPLLContainer = document.getElementById('1-look-pll');

let typesToDisplay = [];

// Function to take a list of algorithms and display them in the given container
const displayAlgs = (container, algs) => {
    container.innerHTML = '';
    algs.forEach(({name, type, src, algorithm}) => {
        if (typesToDisplay.includes(type)) {
            container.innerHTML += `
                <div class='algorithm-card'>
                    <img class='algorithm-img' src=${src} alt=${name}>
                    <div class='algorithm-text'>
                        <p class='algorithm-name'>Name: ${name}</p>
                        <p class='algorithm'>Algorithm:</p>
                        <p class='algorithm'>${algorithm}</p>
                    </div>
                </div>
            `
        }
    })
}

// Check which algorithm page is open then load necessary algorithms to DOM
if (twoLookOLLContainer) {
    displayAlgs(twoLookOLLContainer, twoLookOLLAlgorithms); 
    // Add event listeners to filter system
    twoLookOLLAlgorithmsTypes.forEach(type => {
        const checkBox = document.getElementById(type);
        checkBox.addEventListener('click' , () => {
            if (checkBox.checked) {
                typesToDisplay.unshift(type);
            } else {
                typesToDisplay.splice(typesToDisplay.indexOf(type), 1);
            }
            displayAlgs(twoLookOLLContainer, twoLookOLLAlgorithms);
        })
    }) 
}

if (twoLookPLLContainer) {
    displayAlgs(twoLookPLLContainer, twoLookPLLAlgorithms); 
    // Add event listeners to filter system
    twoLookPLLAlgorithmsTypes.forEach(type => {
        const checkBox = document.getElementById(type);
        checkBox.addEventListener('click' , () => {
            if (checkBox.checked) {
                typesToDisplay.unshift(type);
            } else {
                typesToDisplay.splice(typesToDisplay.indexOf(type), 1);
            }
            displayAlgs(twoLookPLLContainer, twoLookPLLAlgorithms);
        })
    }) 
}

if (oneLookOLLContainer) {
    displayAlgs(oneLookOLLContainer, oneLookOLLAlgorithms); 
    // Add event listeners to filter system
    oneLookOLLAlgorithmsTypes.forEach(type => {
        const checkBox = document.getElementById(type);
        checkBox.addEventListener('click' , () => {
            if (checkBox.checked) {
                typesToDisplay.unshift(type);
            } else {
                typesToDisplay.splice(typesToDisplay.indexOf(type), 1);
            }
            displayAlgs(oneLookOLLContainer, oneLookOLLAlgorithms);
        })
    }) 
}

if (oneLookPLLContainer) {
    displayAlgs(oneLookPLLContainer, oneLookPLLAlgorithms); 
    // Add event listeners to filter system
    oneLookPLLAlgorithmsTypes.forEach(type => {
        const checkBox = document.getElementById(type);
        checkBox.addEventListener('click' , () => {
            if (checkBox.checked) {
                typesToDisplay.unshift(type);
            } else {
                typesToDisplay.splice(typesToDisplay.indexOf(type), 1);
            }
            displayAlgs(oneLookPLLContainer, oneLookPLLAlgorithms);
        })
    }) 
}