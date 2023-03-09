const overview = document.getElementById("code-overview")
const functionCode = document.getElementById("code-function")

overview.innerHTML = `setUp()
updateStatistics(0)
for (i = 0; i < iterationsInput.value; i++) {
    initializeItems()
    chooseDoor()
    openDoor()
    switchDoor()
    solve()
    updateStatistics(i)
}`

function updateSyntaxHighlighting() {
    document.querySelectorAll('div.code').forEach(el => {
        hljs.highlightElement(el)
    })
}

function updateCode() {
    let functionToPrint = initializeItems
    switch (doors.step) {
        case 1:
            functionToPrint = initializeItems
            break;
        case 2:
            functionToPrint = chooseDoor
            break;
        case 3:
            functionToPrint = openDoor
            break;
        case 4:
            functionToPrint = switchDoor
            break;
        case 5:
            functionToPrint = solve
            break;
        default: break;
    }
    functionCode.innerHTML = functionToPrint.toString()
    updateSyntaxHighlighting()
}

updateSyntaxHighlighting()

