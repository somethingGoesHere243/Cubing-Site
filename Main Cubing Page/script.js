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
    return newScramble
}

// Function to show a new scramble on page
const displayNewScramble = () => {
    const newScramble = generateNewScramble();
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
    displayNewScramble();
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
        displayNewScramble();
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

// Solver page scripts
const solveBtn = document.getElementById('solve-btn');
const randomScrambleBtn = document.getElementById('random-scramble-btn');
const randomScrambleOutput = document.getElementById('random-scramble-output');
const solutionOutput = document.getElementById('solution-output');

const cubeFaces = document.getElementsByClassName('face');

const colors = ['red', 'white', 'green', 'yellow', 'blue', 'orange'];

// Function to get the current color of a given sticker
const getColor = (sticker) => {
    let classList = [...sticker.classList];
    classList.splice(classList.indexOf('sticker'), 1);
    if (classList.includes('center')) {
        classList.splice(classList.indexOf('center'), 1);
    }
    return classList[0];
}

// Function to retrieve scramble input
const getScramble = () => {
    let scramble = [];
    // Get layout of each face (store index of color in colors array rather than the string)
    colors.forEach(color => {
        const face = document.getElementById(`${color}-face`);
        const faceStickers = face.getElementsByClassName('sticker')
        let faceScramble = []; 
        [...faceStickers].forEach(sticker => {
            const stickerColor = getColor(sticker);
            faceScramble.push(colors.indexOf(stickerColor));
        });
        scramble.push(faceScramble);
    })
    return scramble
}

// Function to retrieve edges of a given face
const getEdges = (face) => {
    return [face[1], face[3], face[5], face[7]];
}

// Function to retrieve corners of a given face
const getCorners = (face) => {
    return [face[0], face[2], face[6], face[8]];
}

// Function to retrieve edge pieces of a given scramble
const getEdgePieces = (scramble) => {
    return [
        '' + scramble[0][1] + scramble[4][1],
        '' + scramble[0][3] + scramble[1][1],
        '' + scramble[0][5] + scramble[3][1],
        '' + scramble[0][7] + scramble[2][1],
        '' + scramble[1][3] + scramble[4][5],
        '' + scramble[1][5] + scramble[2][3],
        '' + scramble[2][5] + scramble[3][3],
        '' + scramble[3][5] + scramble[4][3],
        '' + scramble[5][1] + scramble[2][7],
        '' + scramble[5][3] + scramble[1][7],
        '' + scramble[5][5] + scramble[3][7],
        '' + scramble[5][7] + scramble[4][7],
    ]
}

// Function to retrieve corner pieces of a given scramble
const getCornerPieces = (scramble) => {
    return [
        '' + scramble[0][0] + scramble[1][0] + scramble[4][2],
        '' + scramble[0][2] + scramble[4][0] + scramble[3][2],
        '' + scramble[0][6] + scramble[2][0] + scramble[1][2],
        '' + scramble[0][8] + scramble[3][0] + scramble[2][2],
        '' + scramble[1][6] + scramble[5][6] + scramble[4][8],
        '' + scramble[1][8] + scramble[2][6] + scramble[5][0],
        '' + scramble[2][8] + scramble[3][6] + scramble[5][2],
        '' + scramble[3][8] + scramble[4][6] + scramble[5][8],
    ]
}

// Function to rotate the up face of the cube 90deg clockwise
const rotateU = (scramble) => {
    // Edit up face
    const upFace = scramble[1];
    scramble[1] = [upFace[6], upFace[3], upFace[0], upFace[7], upFace[4], upFace[1], upFace[8], upFace[5], upFace[2]];
    // Store right face
    const rightFace = [...scramble[0]];
    // Edit right face
    scramble[0][0] = scramble[4][8];
    scramble[0][3] = scramble[4][5];
    scramble[0][6] = scramble[4][2];
    // Edit back face
    scramble[4][2] = scramble[5][6];
    scramble[4][5] = scramble[5][3];
    scramble[4][8] = scramble[5][0];
    // Edit left face
    scramble[5][0] = scramble[2][0];
    scramble[5][3] = scramble[2][3];
    scramble[5][6] = scramble[2][6];
    // Edit front face
    scramble[2][0] = rightFace[0];
    scramble[2][3] = rightFace[3];
    scramble[2][6] = rightFace[6];
}

// Function to rotate the down face of the cube 90deg clockwise
const rotateD = (scramble) => {
    // Edit down face
    const downFace = scramble[3];
    scramble[3] = [downFace[6], downFace[3], downFace[0], downFace[7], downFace[4], downFace[1], downFace[8], downFace[5], downFace[2]];
    // Store right face
    const rightFace = [...scramble[0]];
    // Edit right face
    scramble[0][2] = scramble[2][2];
    scramble[0][5] = scramble[2][5];
    scramble[0][8] = scramble[2][8];
    // Edit front face
    scramble[2][2] = scramble[5][2];
    scramble[2][5] = scramble[5][5];
    scramble[2][8] = scramble[5][8];
    // Edit left face
    scramble[5][2] = scramble[4][6];
    scramble[5][5] = scramble[4][3];
    scramble[5][8] = scramble[4][0];
    // Edit back face
    scramble[4][0] = rightFace[8];
    scramble[4][3] = rightFace[5];
    scramble[4][6] = rightFace[2];
}

// Function to rotate the front face of the cube 90deg clockwise
const rotateF = (scramble) => {
    // Edit front face
    const frontFace = scramble[2];
    scramble[2] = [frontFace[6], frontFace[3], frontFace[0], frontFace[7], frontFace[4], frontFace[1], frontFace[8], frontFace[5], frontFace[2]];
    // Store right face
    const rightFace = [...scramble[0]];
    // Edit right face
    scramble[0][6] = scramble[1][8];
    scramble[0][7] = scramble[1][5];
    scramble[0][8] = scramble[1][2];
    // Edit up face
    scramble[1][2] = scramble[5][0];
    scramble[1][5] = scramble[5][1];
    scramble[1][8] = scramble[5][2];
    // Edit left face
    scramble[5][0] = scramble[3][6];
    scramble[5][1] = scramble[3][3];
    scramble[5][2] = scramble[3][0];
    // Edit down face
    scramble[3][0] = rightFace[6];
    scramble[3][3] = rightFace[7];
    scramble[3][6] = rightFace[8];
}

// Function to rotate the back face of the cube 90deg clockwise
const rotateB = (scramble) => {
    // Edit back face
    const backFace = scramble[4];
    scramble[4] = [backFace[6], backFace[3], backFace[0], backFace[7], backFace[4], backFace[1], backFace[8], backFace[5], backFace[2]];
    // Store right face
    const rightFace = [...scramble[0]];
    // Edit right face
    scramble[0][0] = scramble[3][2];
    scramble[0][1] = scramble[3][5];
    scramble[0][2] = scramble[3][8];
    // Edit down face
    scramble[3][2] = scramble[5][8];
    scramble[3][5] = scramble[5][7];
    scramble[3][8] = scramble[5][6];
    // Edit left face
    scramble[5][6] = scramble[1][0];
    scramble[5][7] = scramble[1][3];
    scramble[5][8] = scramble[1][6];
    // Edit up face
    scramble[1][0] = rightFace[2];
    scramble[1][3] = rightFace[1];
    scramble[1][6] = rightFace[0];
}

// Function to rotate the right face of the cube 90deg clockwise
const rotateR = (scramble) => {
    // Edit right face
    const rightFace = scramble[0];
    scramble[0] = [rightFace[6], rightFace[3], rightFace[0], rightFace[7], rightFace[4], rightFace[1], rightFace[8], rightFace[5], rightFace[2]];
    // Store up face
    const upFace = [...scramble[1]];
    // Edit up face
    scramble[1][0] = scramble[2][0];
    scramble[1][1] = scramble[2][1];
    scramble[1][2] = scramble[2][2];
    // Edit front face
    scramble[2][0] = scramble[3][0];
    scramble[2][1] = scramble[3][1];
    scramble[2][2] = scramble[3][2];
    // Edit down face
    scramble[3][0] = scramble[4][0];
    scramble[3][1] = scramble[4][1];
    scramble[3][2] = scramble[4][2];
    // Edit back face
    scramble[4][0] = upFace[0];
    scramble[4][1] = upFace[1];
    scramble[4][2] = upFace[2];
}

// Function to rotate the left face of the cube 90deg clockwise
const rotateL = (scramble) => {
    // Edit left face
    const leftFace = scramble[5];
    scramble[5] = [leftFace[6], leftFace[3], leftFace[0], leftFace[7], leftFace[4], leftFace[1], leftFace[8], leftFace[5], leftFace[2]];
    // Store up face
    const upFace = [...scramble[1]];
    // Edit up face
    scramble[1][6] = scramble[4][6];
    scramble[1][7] = scramble[4][7];
    scramble[1][8] = scramble[4][8];
    // Edit back face
    scramble[4][6] = scramble[3][6];
    scramble[4][7] = scramble[3][7];
    scramble[4][8] = scramble[3][8];
    // Edit down face
    scramble[3][6] = scramble[2][6];
    scramble[3][7] = scramble[2][7];
    scramble[3][8] = scramble[2][8];
    // Edit front face
    scramble[2][6] = upFace[6];
    scramble[2][7] = upFace[7];
    scramble[2][8] = upFace[8];
}

// Function to rotate the M slice 90deg clockwise
const rotateM = (scramble) => {
    // Store up face
    const upFace = [...scramble[1]];
    // Edit up face
    scramble[1][3] = scramble[4][3];
    scramble[1][4] = scramble[4][4];
    scramble[1][5] = scramble[4][5];
    // Edit back face
    scramble[4][3] = scramble[3][3];
    scramble[4][4] = scramble[3][4];
    scramble[4][5] = scramble[3][5];
    // Edit down face
    scramble[3][3] = scramble[2][3];
    scramble[3][4] = scramble[2][4];
    scramble[3][5] = scramble[2][5];
    // Edit front face
    scramble[2][3] = upFace[3];
    scramble[2][4] = upFace[4];
    scramble[2][5] = upFace[5];
}

// Function to rotate the S slice 90deg clockwise
const rotateS = (scramble) => {
    // Store up face
    const upFace = [...scramble[1]];
    // Edit up face
    scramble[1][1] = scramble[5][3];
    scramble[1][4] = scramble[5][4];
    scramble[1][7] = scramble[5][5];
    // Edit left face
    scramble[5][3] = scramble[3][7];
    scramble[5][4] = scramble[3][4];
    scramble[5][5] = scramble[3][1];
    // Edit down face
    scramble[3][1] = scramble[0][3];
    scramble[3][4] = scramble[0][4];
    scramble[3][7] = scramble[0][5];
    // Edit right face
    scramble[0][3] = upFace[7];
    scramble[0][4] = upFace[4];
    scramble[0][5] = upFace[1];
}

// Function to perform a wide rotation on front face of 90deg clockwise
const rotateWideF = (scramble) => {
    rotateF(scramble);
    rotateS(scramble);
}

// Function to perform a wide rotation on right face of 90deg clockwise
const rotateWideR = (scramble) => {
    rotateR(scramble);
    rotateM(scramble);
    rotateM(scramble);
    rotateM(scramble);
}

// Function to perform a wide rotation on left face of 90deg clockwise
const rotateWideL = (scramble) => {
    rotateL(scramble);
    rotateM(scramble);
}

// Function to rotate cube 90deg in x direction
const rotateX = (scramble) => {
    const temp = [...scramble]
    scramble[1] = temp[2];
    scramble[2] = temp[3];
    scramble[3] = temp[4];
    scramble[4] = temp[1];
    const rightFace = [...scramble[0]];
    scramble[0] = [rightFace[6], rightFace[3], rightFace[0], rightFace[7], rightFace[4], rightFace[1], rightFace[8], rightFace[5], rightFace[2]];
    const leftFace = [...scramble[5]];
    scramble[5] = [leftFace[2], leftFace[5], leftFace[8], leftFace[1], leftFace[4], leftFace[7], leftFace[0], leftFace[3], leftFace[6]];
}

// Function to rotate cube 90deg in y direction
const rotateY = (scramble) => {
    const temp = [...scramble]
    const backFace = temp[4];
    scramble[0] = [backFace[8], backFace[7], backFace[6], backFace[5], backFace[4], backFace[3], backFace[2], backFace[1], backFace[0]];
    scramble[2] = temp[0];
    scramble[5] = temp[2];
    const leftFace = temp[5];
    scramble[4] = [leftFace[8], leftFace[7], leftFace[6], leftFace[5], leftFace[4], leftFace[3], leftFace[2], leftFace[1], leftFace[0]];
    const upFace = [...scramble[1]];
    scramble[1] = [upFace[6], upFace[3], upFace[0], upFace[7], upFace[4], upFace[1], upFace[8], upFace[5], upFace[2]];
    const downFace = [...scramble[3]];
    scramble[3] = [downFace[2], downFace[5], downFace[8], downFace[1], downFace[4], downFace[7], downFace[0], downFace[3], downFace[6]];
}

// Function to rotate a given layer of a cube 90deg
const rotateLayer = (layer) => {
    // Rotate face
    const face = [...layer[0]];
    layer[0] = [face[6], face[3], face[0], face[7], face[4], face[1], face[8], face[5], face[2]];
    // Rotate edges of layer
    const storedEdge = layer[1];
    layer[1] = layer[4];
    layer[4] = layer[3];
    layer[3] = layer[2];
    layer[2] = storedEdge;
}

// Function to give all possible color orientations of a given PLL case appearance
const getAllColorOrientations = (appearance) => {
    let orientationOne = '';
    let orientationTwo = '';
    let orientationThree = '';
    let orientationFour = '';
    for (const edge of appearance) {
        for (const sticker of edge) {
            if (sticker === 4) {
                orientationOne += '4,';
                orientationTwo += '5,';
                orientationThree += '2,';
                orientationFour += '0,';
            } else if (sticker === 5) {
                orientationOne += '5,';
                orientationTwo += '2,';
                orientationThree += '0,';
                orientationFour += '4,';
            } else if (sticker === 2) {
                orientationOne += '2,';
                orientationTwo += '0,';
                orientationThree += '4,';
                orientationFour += '5,';
            } else {
                orientationOne += '0,';
                orientationTwo += '4,';
                orientationThree += '5,';
                orientationFour += '2,';
            }
        }
    }
    return [orientationOne, orientationTwo, orientationThree, orientationFour];
}

// Function to perform an inputted algorithm to a given scramble
const performAlg = (scramble, algorithm) => {
    let moves = '';
    // Need to add wide turns, slices and other rotations
    let rotations = {'U': rotateU, 'D': rotateD, 'R': rotateR, 'L': rotateL, 'F': rotateF, 'B': rotateB, 'M': rotateM, 'S': rotateS, 'r': rotateWideR, 'l': rotateWideL, 'f': rotateWideF, 'x': rotateX, 'y': rotateY,};
    for (let i=0; i<algorithm.length; i++) {
        // Check if given character corresponds to a face
        let currMove = algorithm[i];
        let rotation = rotations[currMove]
        if (rotation) {
            rotation(scramble);
            moves += currMove + " ";
            // Check if need to do more than one rotation
            if (algorithm[i+1] === '2') {
                rotation(scramble);
                moves += currMove + " ";
            } else if (algorithm[i+1] === "'") {
                rotation(scramble);
                moves += currMove + " ";
                rotation(scramble);
                moves += currMove + " ";
            }
        }
    }
    return moves;
}

// Function to solve the white cross on a given scramble
const solveCross = (scramble) => {
    solution = '';
    // First get all white edges (number 1) onto the yellow face
    let yellowEdges = getEdges(scramble[3]);
    while (!yellowEdges.every(edge => edge === 1)) {
        // Check red face for white edges
        if (getEdges(scramble[0]).includes(1)) {
            // Move edge onto yellow face
            while (scramble[3][1] === 1) {
                rotateD(scramble);
                solution += 'D ';
            }
            while (scramble[0][7] !== 1) {
                rotateR(scramble);
                solution += 'R ';
            }
            while (scramble[3][3] === 1) {
                rotateD(scramble);
                solution += 'D ';
            }
            rotateF(scramble);
            solution += 'F ';
        }
        // Check Green Face
        else if (getEdges(scramble[2]).includes(1)) {
            while (scramble[3][3] === 1) {
                rotateD(scramble);
                solution += 'D ';
            }
            while (scramble[2][7] !== 1) {
                rotateF(scramble);
                solution += 'F ';
            }
            while (scramble[3][7] === 1) {
                rotateD(scramble);
                solution += 'D ';
            }
            rotateL(scramble);
            solution += 'L ';
        } 
        // Check Blue Face
        else if (getEdges(scramble[4]).includes(1)) {
            while (scramble[3][5] === 1) {
                rotateD(scramble);
                solution += 'D ';
            }
            while (scramble[4][1] !== 1) {
                rotateB(scramble);
                solution += 'B ';
            }
            while (scramble[3][1] === 1) {
                rotateD(scramble);
                solution += 'D ';
            }
            rotateR(scramble);
            solution += 'R ';
        } 
        // Check Orange Face
        else if (getEdges(scramble[5]).includes(1)) {
            while (scramble[3][7] === 1) {
                rotateD(scramble);
                solution += 'D ';
            }
            while (scramble[5][7] !== 1) {
                rotateL(scramble);
                solution += 'L ';
            }
            while (scramble[3][5] === 1) {
                rotateD(scramble);
                solution += 'D ';
            }
            rotateB(scramble);
            solution += 'B ';
        } 
        // Check White Face
        else {
            while (scramble[3][3] === 1) {
                rotateD(scramble);
                solution += 'D ';
            }
            while (scramble[1][5] !== 1) {
                rotateU(scramble);
                solution += 'U ';
            }
            rotateF(scramble);
            rotateF(scramble);
            solution += 'F F ';
        }
        yellowEdges = getEdges(scramble[3]);
    }
    // Now rotate all white edges to correct spot on white face
    while (scramble[0][5] !== 0) {
        rotateD(scramble);
        solution += 'D ';
    }
    rotateR(scramble);
    rotateR(scramble);
    solution += 'R R ';
    while (scramble[2][5] !== 2 || scramble[3][3] !== 1) {
        rotateD(scramble);
        solution += 'D ';
    }
    rotateF(scramble);
    rotateF(scramble);
    solution += 'F F ';
    while (scramble[5][5] !== 5 || scramble[3][7] !== 1) {
        rotateD(scramble);
        solution += 'D ';
    }
    rotateL(scramble);
    rotateL(scramble);
    solution += 'L L ';
    while (scramble[4][3] !== 4 || scramble[3][5] !== 1) {
        rotateD(scramble);
        solution += 'D ';
    }
    rotateB(scramble);
    rotateB(scramble);
    solution += 'B B ';

    return solution
}

// Function to move a specified corner out of the bottom layer
const moveCornerToTop = (scramble, corner) => {
    solution = ''
    let cornerPieces = getCornerPieces(scramble);
    cornerIndex = Math.max(cornerPieces.indexOf(corner), cornerPieces.indexOf(corner[1] + corner[2] + corner[0]), cornerPieces.indexOf(corner[2] + corner[0] + corner[1]));
    if (cornerIndex === 1) {
        solution += performAlg(scramble, "R' U' R ");
    } else if (cornerIndex === 3) {
        solution += performAlg(scramble, "R U R' ");
    } else if (cornerIndex === 6) {
        solution += performAlg(scramble, "L' U' L ");
    } else if (cornerIndex === 7) {
        solution += performAlg(scramble, "L U L' ");
    }
    return solution;
}

// Function to finish solving white layer
const solveTopLayer = (scramble) => {
    solution = ''
    let cornerPieces = getCornerPieces(scramble);
    // Check each corner piece and solve if needed
    if (cornerPieces[1] !== '021') {
        // Move corner out of white layer if needed
        solution += moveCornerToTop(scramble, '021');
        cornerPieces = getCornerPieces(scramble);
        let cornerIndex = Math.max(cornerPieces.indexOf('021'), cornerPieces.indexOf('210'), cornerPieces.indexOf('102'));  
        // Place corner into correct place
        while (cornerIndex !== 0) {
            rotateU(scramble);
            solution += 'U '
            cornerPieces = getCornerPieces(scramble);
            cornerIndex = Math.max(cornerPieces.indexOf('021'), cornerPieces.indexOf('210'), cornerPieces.indexOf('102'));
        }
        if (scramble[1][0] === 1) {
            solution += performAlg(scramble, "R' U R U2");
        }
        if (scramble[1][0] === 2) {
            solution += performAlg(scramble,"B U B' ");
        } else if (scramble[1][0] === 0) {
            solution += performAlg(scramble,"R' U' R ");
        }
        cornerPieces = getCornerPieces(scramble);
    }
    if (cornerPieces[3] !== '014') {
        // Move corner out of white layer if needed
        solution += moveCornerToTop(scramble, '014');
        let cornerIndex = Math.max(cornerPieces.indexOf('014'), cornerPieces.indexOf('140'), cornerPieces.indexOf('401'));
        // Place corner into correct place
        while (cornerIndex !== 2) {
            rotateU(scramble);
            solution += 'U '
            cornerPieces = getCornerPieces(scramble);
            cornerIndex = Math.max(cornerPieces.indexOf('014'), cornerPieces.indexOf('140'), cornerPieces.indexOf('401'));
        }
        if (scramble[1][2] === 1) {
            solution += performAlg(scramble, "R U2 R' U' ");
        }
        if (scramble[1][2] === 0) {
            solution += performAlg(scramble, "R U R' ");
        } else if (scramble[1][2] === 4) {
            solution += performAlg(scramble, "F' U' F ");
        }
        cornerPieces = getCornerPieces(scramble);
    }
    if (cornerPieces[6] !== '415') {
        // Move corner out of white layer if needed
        solution += moveCornerToTop(scramble, '415');
        let cornerIndex = Math.max(cornerPieces.indexOf('415'), cornerPieces.indexOf('154'), cornerPieces.indexOf('541'));
        // Place corner into correct place
        while (cornerIndex !== 5) {
            rotateU(scramble);
            solution += 'U '
            cornerPieces = getCornerPieces(scramble);
            cornerIndex = Math.max(cornerPieces.indexOf('415'), cornerPieces.indexOf('154'), cornerPieces.indexOf('541'));
        }
        if (scramble[1][8] === 1) {
            solution += performAlg(scramble, "L' U L U2");
        }
        if (scramble[1][8] === 4) {
            solution += performAlg(scramble, "F U F' ");
        } else if (scramble[1][8] === 5) {
            solution += performAlg(scramble, "L' U' L ");
        }
        cornerPieces = getCornerPieces(scramble);
    }
    if (cornerPieces[7] !== '125') {
        // Move corner out of white layer if needed
        solution += moveCornerToTop(scramble, '125');
        let cornerIndex = Math.max(cornerPieces.indexOf('125'), cornerPieces.indexOf('251'), cornerPieces.indexOf('512'));
        // Place corner into correct place
        while (cornerIndex !== 4) {
            rotateU(scramble);
            solution += 'U '
            cornerPieces = getCornerPieces(scramble);
            cornerIndex = Math.max(cornerPieces.indexOf('125'), cornerPieces.indexOf('251'), cornerPieces.indexOf('512'));;
        }
        if (scramble[1][6] === 1) {
            solution += performAlg(scramble, "L U2 L' U' ");
        }
        if (scramble[1][6] === 2) {
            solution += performAlg(scramble, "B' U' B ");
        } else if (scramble[1][6] === 5) {
            solution += performAlg(scramble, "L U L' ");
        }
    }

    return solution
}

// Function to solve second layer
const solveSecondLayer = (scramble) => {
    solution = '';
    // Store edge index of any edges which have been solved
    const solvedEdges = [];
    // Check if any edges already solved
    const currEdgePieces = getEdgePieces(scramble);
    if (currEdgePieces[0] === '02') {solvedEdges.push(0)};
    if (currEdgePieces[3] === '04') {solvedEdges.push(3)};
    if (currEdgePieces[8] === '54') {solvedEdges.push(8)};
    if (currEdgePieces[11] === '52') {solvedEdges.push(11)};
    // Keep track of number of times top face of cube has been turned since last edge was solved
    let topFaceTurns = 0;
    while (solvedEdges.length < 4) {
        // Check if there are any edges positioned above their respective slot
        // If there are then insert them
        if (scramble[2][3] === 4 && scramble[1][5] !== 3) {
            if (scramble[1][5] === 0) {
                solution += performAlg(scramble, "F U F U F U' F' U' F' ");
                solvedEdges.push(3);
            } else if (scramble[1][5] === 5) {
                solution += performAlg(scramble, "F' U' F' U' F' U F U F ");
                solvedEdges.push(8);
            }
            topFaceTurns = 0;
        } else if (scramble[0][3] === 0 && scramble[1][1] !== 3) {
            if (scramble[1][1] === 2) {
                solution += performAlg(scramble, "R U R U R U' R' U' R' ");
                solvedEdges.push(0);
            } else if (scramble[1][1] === 4) {
                solution += performAlg(scramble, "R' U' R' U' R' U R U R ");
                solvedEdges.push(3);
            }
            topFaceTurns = 0;
        } else if (scramble[4][5] === 2 && scramble[1][3] !== 3) {
            if (scramble[1][3] === 5) {
                solution += performAlg(scramble, "B U B U B U' B' U' B' ");
                solvedEdges.push(11);
            } else if (scramble[1][3] === 0) {
                solution += performAlg(scramble, "B' U' B' U' B' U B U B ");
                solvedEdges.push(0);
            }
            topFaceTurns = 0;
        } else if (scramble[5][3] === 5 && scramble[1][7] !== 3) {
            if (scramble[1][7] === 4) {
                solution += performAlg(scramble, "L U L U L U' L' U' L' ");
                solvedEdges.push(8);
            } else if (scramble[1][7] === 2) {
                solution += performAlg(scramble, "L' U' L' U' L' U L U L ");
                solvedEdges.push(11);
            }
            topFaceTurns = 0;
        } else {
            rotateU(scramble);
            solution += 'U ';
            topFaceTurns += 1;
            // If topFaceTurns reaches 4 then there are currently no middle layer edges in the top layer
            if (topFaceTurns === 4) {
                let unsolvedEdges = [0,3,8,11].filter(num => !solvedEdges.includes(num));
                // Pull one of the (non-yellow) edges up to the top layer
                let edgePieces = getEdgePieces(scramble); 
                if (unsolvedEdges.includes(0) && !edgePieces[0].includes(3)) {
                    solution += performAlg(scramble, "R U R U R U' R' U' R' ");
                } else if (unsolvedEdges.includes(3) && !edgePieces[3].includes(3)) {
                    solution += performAlg(scramble, "R' U' R' U' R' U R U R ");
                } else if (unsolvedEdges.includes(8) && !edgePieces[8].includes(3)) {
                    solution += performAlg(scramble, "L U L U L U' L' U' L' ");
                } else {
                    solution += performAlg(scramble, "L' U' L' U' L' U L U L ");
                }
                topFaceTurns = 0;
            }
        }
    }
    return solution;
}

// Function to Orient Last Layer of cube
const solveOLL = (scramble) => {
    let solution = '';
    // Get locations of all yellow stickers in top layer
    const isYellow = (sticker) => (sticker === 3) ? 1 : 0;
    // Get array representing top layer of cube where 1 = yellow, 0 = non-yellow stickers
    let yellowStickers = [
        [isYellow(scramble[1][0]), isYellow(scramble[1][1]), isYellow(scramble[1][2]), isYellow(scramble[1][3]), isYellow(scramble[1][4]), isYellow(scramble[1][5]), isYellow(scramble[1][6]), isYellow(scramble[1][7]), isYellow(scramble[1][8])],
        [isYellow(scramble[2][0]), isYellow(scramble[2][3]), isYellow(scramble[2][6])],
        [isYellow(scramble[5][0]), isYellow(scramble[5][3]), isYellow(scramble[5][6])],
        [isYellow(scramble[4][8]), isYellow(scramble[4][5]), isYellow(scramble[4][2])],
        [isYellow(scramble[0][0]), isYellow(scramble[0][3]), isYellow(scramble[0][6])],
    ];
    let OLLCase = -1;
    // Keep track of number of up face rotations
    let upFaceRotations = 0;
    while (OLLCase === -1) {
        OLLCase = oneLookOLLAlgorithms.find(alg => '' + alg['appearance'] === '' + yellowStickers) || -1;
        if (OLLCase === -1) {
            rotateLayer(yellowStickers);
            rotateU(scramble);
            solution += 'U ';
            upFaceRotations += 1;
        }
        // If we complete 4 rotations of the up face without finding a oll case our permutation of the cube must be invalid
        if (upFaceRotations === 4) {
            return 'Invalid state'
        }
    }
    rotateU(scramble);
    rotateU(scramble);
    rotateU(scramble);
    return solution + 'U U U ' + performAlg(scramble, OLLCase['algorithm']);
}

// Function to Permute Last Layer of cube
const solvePLL = (scramble) => {
    let solution = '';
    // Get information on colors of stickers on around last layer
    let lastLayerStickers = [
        [scramble[2][0], scramble[2][3], scramble[2][6]],
        [scramble[5][0], scramble[5][3], scramble[5][6]],
        [scramble[4][8], scramble[4][5], scramble[4][2]],
        [scramble[0][0], scramble[0][3], scramble[0][6]],
    ]
    // Find the PLL case whose appearance matches the above
    let PLLCase = -1;
    // Keep track of number of up face rotations
    let upFaceRotations = 0;
    while (PLLCase === -1) {
        PLLCase = oneLookPLLAlgorithms.find(alg => getAllColorOrientations(alg['appearance']).includes('' + lastLayerStickers + ',')) || -1;
        if (PLLCase === -1) {
            lastLayerStickers = [lastLayerStickers[3], lastLayerStickers[0], lastLayerStickers[1], lastLayerStickers[2]];
            rotateU(scramble);
            solution += 'U ';
            upFaceRotations += 1;
        }
        // If we complete 4 rotations of the up face without finding a pll case our permutation of the cube must be invalid
        if (upFaceRotations === 4) {
            return 'Invalid state'
        }
    }
    solution += performAlg(scramble, PLLCase['algorithm']);
    // Correctly orient the final layer to complete solution
    while (scramble[0][3] !== 0) {
        rotateU(scramble);
        solution += 'U ';
    }
    return solution;
}

// Function to correctly format a given algorithm
const formatAlg = (algorithm) => {
    let formattedAlg = '';
    let currentIndex = 0;
    while (currentIndex < algorithm.length) {
        const currentLetter = algorithm[currentIndex];
        let numberOfRepeats = 1;
        // Increment current index by 2 as there should be spaces between each letter
        currentIndex += 2;
        while (currentLetter === algorithm[currentIndex]) {
            numberOfRepeats += 1;
            currentIndex += 2;
        }
        // After 4 of the same move we are repeating ourselves
        numberOfRepeats = numberOfRepeats % 4;
        if (numberOfRepeats === 1) {
            formattedAlg += currentLetter + ' ';
        } else if (numberOfRepeats === 2) {
            formattedAlg += currentLetter + '2 ';
        } else if (numberOfRepeats === 3) {
            formattedAlg += currentLetter + "' ";
        }
    }
    return formattedAlg;
}

// Function to solve a given scramble and output the steps taken to solve in HTML format
const solve = (scramble) => {
    // Check if scramble has right amount of each color/sticker
    const edgeCounts = [0, 0, 0, 0, 0, 0];
    const cornerCounts = [0, 0, 0, 0, 0, 0];
    for (let i=0; i<6; i++) {
        for (const edge of getEdges(scramble[i])) {
            edgeCounts[edge] += 1
        }
        for (const corner of getCorners(scramble[i])) {
            cornerCounts[corner] += 1
        }
    }
    if (!edgeCounts.every(num => num === 4) || !cornerCounts.every(num => num === 4)) {
        return `<p class='solver-error'>Invalid State</p>`;
    } 
    // Check if all pieces of the cube are valid
    const seenEdges = [];
    const seenCorners = [];
    let isValid = true;
    getEdgePieces(scramble).forEach(edge => {
        if (isValid) {
            if (seenEdges.includes(edge)) {
                isValid = false;
            } else if (!validEdges.includes(edge)) {
                isValid = false;
            } else {
                seenEdges.push(edge);
                seenEdges.push(edge[1] + edge[0]);
            }
        }
    })
    getCornerPieces(scramble).forEach(corner => {
        if (isValid) {
            if (seenCorners.includes(corner)) {
                isValid = false;
            } else if (!validCorners.includes(corner)) {
                isValid = false;
            } else {
                seenCorners.push(corner);
                seenCorners.push(corner[1] + corner[2] + corner[0]);
                seenCorners.push(corner[2] + corner[0] + corner[1]);
            }
        }
    })

    if (isValid) {
        // Scramble is valid so begin solving
        const crossSolution = solveCross(scramble);
        rotateX(scramble);
        rotateX(scramble);
        const topLayerSolution = solveTopLayer(scramble);
        const secondLayerSolution = solveSecondLayer(scramble);
        const OLLSolution = solveOLL(scramble);
        // Check if a OLL solution was found
        if (OLLSolution === 'Invalid state') {
            return `<p class='solver-error'>Invalid State</p>`;
        }
        const PLLSolution = solvePLL(scramble);
        // Check if a PLL solution was found
        if (PLLSolution === 'Invalid state') {
            return `<p class='solver-error'>Invalid State</p>`;
        }
        
        // Return solution in HTML form
        return `
            <p><strong>Solution</strong> (Applied with white on top and green in front): </p>
            <p><span class='solution-subheader'>Cross: </span><span class='solution-alg'>${formatAlg(crossSolution)}</span></p>
            <p><span class='solution-subheader'>First Layer: </span><span class='solution-alg'>X2 ${formatAlg(topLayerSolution)}</span></p>
            <p><span class='solution-subheader'>Second Layer: </span><span class='solution-alg'>${formatAlg(secondLayerSolution)}</span></p>
            <p><span class='solution-subheader'>OLL: </span><span class='solution-alg'>${formatAlg(OLLSolution)}</span></p>
            <p><span class='solution-subheader'>PLL: </span><span class='solution-alg'>${formatAlg(PLLSolution)}</span></p>
        `
    } else {
        return `<p class='solver-error'>Invalid State</p>`;
    }
} 

// Function to display 2d net of a given cube permutation to the screen
const display2DCube = (permutation) => {
    // Loop through each face of cube changing classes of stickers to necessary colours
    for (let i = 0; i<6 ; i++) {
        const currFace = cubeFaces[i];
        const currFaceStickers = currFace.querySelectorAll('.sticker')
        const newFace = permutation[i];
        for (let j = 0; j<9; j++) {
            currSticker = currFaceStickers[j]
            currSticker.classList.remove(getColor(currSticker));
            currSticker.classList.add(colors[newFace[j]]);
        }
    }
}

// Flag to check if random scramble should be shown on page
let haveRandomScramble = false;

// Check if on solver page then add appropriate event listeners
if (solveBtn) {
    // Add event listeners to each sticker allowing them to change color when clicked
    [...document.getElementsByClassName('sticker')].forEach(sticker => {
        if (![...sticker.classList].includes('center')) {
            sticker.addEventListener('click', () => {
                // Retrieve current color of sticker
                const currColor = getColor(sticker);
                // Retrieve next color to be given after click
                const newColor = colors[(colors.indexOf(currColor) + 1) % 6];
                // Replace color class on sticker
                sticker.classList.remove(currColor);
                sticker.classList.add(newColor);
            })
        } 
    })

    

    // Add event listener to solve button to read the given scramble then solve it
    solveBtn.addEventListener('click', () => {
        // Check if random scramble output should be hidden
        if (!haveRandomScramble) {
            randomScrambleOutput.classList.add('hidden');
        } else {
            haveRandomScramble = false;
        }

        // Find solution to scramble currently on page
        const currCubePosn = getScramble();
        const solution = solve(currCubePosn);
    
        // Display solution to screen
        solutionOutput.classList.remove('hidden')
        solutionOutput.innerHTML = solution
    })

    // Add event listener to randomise button to generate a random scramble and display on page
    randomScrambleBtn.addEventListener('click', () => {
        haveRandomScramble = true;

        // Hide solution if one is currently being shown
        solutionOutput.classList.add('hidden')

        // Return cube to solved state
        const currCubePosn = [[0,0,0,0,0,0,0,0,0], [1,1,1,1,1,1,1,1,1], [2,2,2,2,2,2,2,2,2], [3,3,3,3,3,3,3,3,3], [4,4,4,4,4,4,4,4,4], [5,5,5,5,5,5,5,5,5]];
        // Generate a random scramble
        let randScramble = generateNewScramble();
        // Apply scramble to cube
        performAlg(currCubePosn , randScramble);
        // Display new scrambled cube on screen
        display2DCube(currCubePosn)
        // Display generated scramble to screen
        randomScrambleOutput.classList.remove('hidden')
        randomScrambleOutput.innerHTML = '<strong>Random Scramble</strong> (Applied with white on top and green in front): ' + randScramble;
    })
}