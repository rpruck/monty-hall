var doors = {
    items: [],
    choice: null,
    open: null,
    switch: null
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
iterationsInput.addEventListener("change", (e) => speedFactor = e.target.value)

const iterationsOutput = document.getElementById("iterationsCounter")
const switchOutput = document.getElementById("switchCounter")
const stayOutput = document.getElementById("stayCounter")

const ctx = document.getElementById("chart")
var chart = new Chart(ctx,
    {
        type: 'bar',
        data: {
            labels: ['Gewechselt', 'Geblieben'],
            datasets: [
                {
                    label: 'Gewonnene Runden',
                    data: [switchWins, stayWins]
                }
            ]
        }
    }
)

async function simulate() {
    disableIterationsButton()
    stayCounter = 0;
    switchCounter = 0;

    stayWins = 0;
    switchWins = 0;

    updateStatistics(0)

    for (i = 0; i < iterationsInput.value; i++) {

        initializeItems()

        chooseDoor()

        openDoor()

        switchDoor()

        solve()
        
        await pause()

        updateStatistics(i)

        await pause()
    }

    console.log(`Ratio for switching is: ${switchWins/switchCounter} and for staying: ${stayWins/stayCounter}`)

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

function pause() {
    return new Promise(resolve => setTimeout(resolve, ((stepTime * 1000) / speedFactor)))
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
        carIndex = doors.items.indexOf("car")
        const choiceIndex = validIndexes.filter(index => index !== carIndex)
        openChoice = choiceIndex[0]
    }
    doors.open = openChoice
}

function switchDoor() {
    validDoors = [...doors.items]
    //remove opened door
    validDoors.splice(doors.openChoice, 1)
    const switchChoice = getRandomInt(2)
    doors.switch = (switchChoice === 1)
}

function solve() {
    let hasWon
    if (!doors.switch) {
        hasWon = (doors.items[doors.choice] === "car")
    } else {
        let validIndexes = [0, 1, 2]
        validIndexes = validIndexes.filter(index => index !== doors.openChoice)
        validIndexes = validIndexes.filter(index => index !== doors.choice)
        let finalIndex = validIndexes[0]
        hasWon = (doors.items[finalIndex] === "car")
    }

    updateScore(hasWon)

    return hasWon
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
}

//max is not included in possible output
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
