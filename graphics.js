const door0 = document.getElementById("door0")
const door1 = document.getElementById("door1")
const door2 = document.getElementById("door2")

const item0 = document.getElementById("item0")
const item1 = document.getElementById("item1")
const item2 = document.getElementById("item2")

const statusDiv = document.getElementById("status")

const doorImages = [door0, door1, door2]
const itemImages = [item0, item1, item2]

function updateGraphics() {
    if(stepTime === 0) return;
    switch (doors.step) {
        case 1: 
            setUpGraphics()
            itemImages[doors.items.indexOf("car")].src = "assets/car.png"
            popOutItems()
            break;
        case 2:
            doorImages[doors.choice].classList.add("door-select")
            break;
        case 3:
            doorImages[doors.open].classList.add("door-opaque")
            itemImages[doors.open].classList.remove("item-invisible")
            break;
        case 4:
            deselectDoors()
            if (doors.switch) {
                doorImages[3 - (doors.choice + doors.open)].classList.add("door-final-select")
                statusDiv.innerHTML = "Wechseln"
            } else {
                doorImages[doors.choice].classList.add("door-final-select")
                statusDiv.innerHTML = "Verbleiben"
            }
            break;
        case 5:
            openDoors()
            showItems()
            break;
        case 6:
            reset()
        default:
            break;
    }
}

function setUpGraphics() {
    for (let item of itemImages) {
        item.src = "assets/goat.png"
        item.className = "item"
        item.classList.add("item-invisible")
    }

    for (let door of doorImages) {
        door.className = "door"
    }

    statusDiv.innerHTML = ""
}

function popOutItems() {
    for (let item of itemImages) {
        item.classList.remove("item-invisible")
        item.classList.add("item-popout")
        setTimeout(hideItems, ((stepTime * 500) / speedFactor))
    }
}

function hideItems() {
    for (let item of itemImages) {
        item.classList.add("item-invisible")
        item.classList.remove("item-popout")
    }
}

function showItems() {
    for (let item of itemImages) {
        item.classList.remove("item-invisible")
    }
}

function deselectDoors() {
    for (let door of doorImages) {
        door.classList.remove("door-select")
        door.classList.remove("door-final-select")
    }
}

function openDoors() {
    for (let door of doorImages) {
        door.classList.add("door-opaque")
    }
}

function reset() {
    for (let item of itemImages) {
        item.src = "assets/goat.png"
        item.className = "item"
        item.classList.add("item-invisible")
    }

    for (let door of doorImages) {
        door.className = "door"
    }

    statusDiv.innerHTML = ""
}
