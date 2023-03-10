var doors = {
    items: [],
    choice: null,
    open: null,
    switch: null,
    step: 0
}

var stepTime = 2
var speedFactor = 1

var stayCounter = 0;
var switchCounter = 0;
var stayWins = 0;
var switchWins = 0;

const stepTimeInput = document.getElementById("stepTime")
const speedFactorInput = document.getElementById("speedFactor")
const iterationsInput = document.getElementById("iterations")

stepTimeInput.addEventListener("change", (e) => stepTime = e.target.value)
speedFactorInput.addEventListener("change", (e) => speedFactor = e.target.value)

const iterationsOutput = document.getElementById("iterationsCounter")
const switchOutput = document.getElementById("switchCounter")
const stayOutput = document.getElementById("stayCounter")
const switchRatioOutput = document.getElementById("switchRatio")
const stayRatioOutput = document.getElementById("stayRatio")

const ctx = document.getElementById("chart")
var chart = new Chart(ctx,
    {
        type: 'bar',
        data: {
            labels: ['Gewechselt', 'Verblieben'],
            datasets: [
                {
                    label: 'Gewonnene Runden',
                    data: [switchWins, stayWins],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.4)',
                        'rgba(255, 99, 132, 0.4)'
                    ]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    }
)

async function simulate() {
    disableIterationsButton()

    setUp()

    updateStatistics(0)

    for (i = 0; i < iterationsInput.value; i++) {
        doors.step = 0

        initializeItems()
        await updateAndPause()

        chooseDoor()
        await updateAndPause()

        openDoor()
        await updateAndPause()

        switchDoor()
        await updateAndPause()

        solve()
        await updateAndPause()

        updateStatistics(i)
        await updateAndPause()

    }

    enableIterationsButton()
}

function disableIterationsButton() {
    const iterations = document.getElementById("iterations")
    iterations.disabled = true
}

function enableIterationsButton() {
    const iterations = document.getElementById("iterations")
    iterations.disabled = false
}

function updateAndPause() {
    doors.step++
    updateGraphics()
    updateCode()
    return new Promise(resolve => setTimeout(resolve, ((stepTime * 1000) / speedFactor)))
}

function setUp() {
    doors = {
        items: [],
        choice: null,
        open: null,
        switch: null,
        step: 0
    }

    stayCounter = 0;
    switchCounter = 0;

    stayWins = 0;
    switchWins = 0;
}

function initializeItems() {
    doors.items = ["goat", "goat", "goat"]
    const carIndex = getRandomInt(3);
    doors.items[carIndex] = "car"
}

function chooseDoor() {
    doors.choice = getRandomInt(3);
}

function openDoor() {
    const validIndexes = [0, 1, 2]
    //remove index that has been chosen
    validIndexes.splice(doors.choice, 1)

    let openChoice = null

    //if car is chosen by player, choose on of two available doors by random
    if (doors.items[doors.choice] === "car") {
        openChoice = validIndexes[getRandomInt(2)]
    }

    //if goat is chosen by player, choose to show other goat
    else {
        openChoice = 3 - (doors.items.indexOf("car") + doors.choice)
    }
    doors.open = openChoice
}

function switchDoor() {
    const switchChoice = getRandomInt(2)
    doors.switch = (switchChoice === 1)
}

function solve() {
    let hasWon
    if (!doors.switch) {
        hasWon = (doors.items[doors.choice] === "car")
    } else {
        let finalIndex = 3 - (doors.open + doors.choice)
        hasWon = (doors.items[finalIndex] === "car")
    }

    updateScore(hasWon)
}

function updateScore(hasWon) {
    if (hasWon && doors.switch) { switchWins++ }

    if (hasWon && !doors.switch) { stayWins++ }

    if (doors.switch) { switchCounter++ }

    if (!doors.switch) { stayCounter++ }
}

function updateStatistics(iterations) {
    chart.data.datasets[0].data = [switchWins, stayWins]
    chart.update()

    iterationsOutput.innerHTML = iterations + 1
    switchOutput.innerHTML = switchCounter
    stayOutput.innerHTML = stayCounter
    switchRatioOutput.innerHTML = (switchWins / switchCounter * 100).toFixed(2)+ "%"
    stayRatioOutput.innerHTML = (stayWins / stayCounter * 100).toFixed(2) + "%"
}

//max is not included in possible output
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
