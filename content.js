
function checkUrl() {


    return window.location.href.includes ('canvas');
}

function isCanvasAssignmentCreationPage() {

    console.log("WENT THROUGH ASSIGNMENT CREATION PAGE")
    console.log(window.location.href.includes('/assignments'))
    console.log(window.location.href.includes('/edit'))
    console.log(window.location.href.includes('/new'))

    return window.location.href.includes('/assignments') && (window.location.href.includes('/new') || (window.location.href.includes('/edit')));


}

function isCanvasAssignmentViewPage() {
    return window.location.href.includes("/assignments") && (!window.location.href.endsWith('/assignments'));

}

async function backendRequest(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                
            },
            mode: 'no-cors', // This is the key setting

            body: new URLSearchParams(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.text();
        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error;  // Re-throw the error if needed
    }
}

// // Example usage
// backendRequest('https://www.example.com/api', { key1: 'value1', key2: 'value2' })
//     .then(result => console.log(result))
//     .catch(error => console.error('Request failed:', error));







function main() {




    if (!checkUrl()) {
        console.error('This is not a Canvas assignment creation page.');
        return;
    }


    // Create a new div element with your content
    const newDiv = document.createElement('div');
    newDiv.innerHTML = `
        <div id="button-time">Estimate Time</div>
    `;


    function handleClick() {
        alert('Div clicked!');
        backendRequest('https://google.com', { key1: 'value1', key2: 'value2' })
            .then(result => console.log(result))
            .catch(error => console.error('Request failed:', error));
        // You can also add other functionality here
    }

    // Add an event listener to the div
    newDiv.addEventListener('click', handleClick);



    if (isCanvasAssignmentCreationPage()) {

        newDiv.id = 'studai-canvas-button-2';
        const targetElement = document.querySelector('#edit_assignment_header > div.header-bar.assignment-edit-header > div');


        //console.error("ELEMENT LOADED")
        //console.error(targetElement)


        //console.error(document.documentElement.outerHTML);

        if (targetElement) {
            targetElement.appendChild(newDiv)
            //targetElement.insertBefore(newDiv, targetElement.firstChild);

        } else {
            console.error('1: Target element not found.');
        }
    }
    else if (isCanvasAssignmentViewPage()) {
        
        newDiv.id = 'studai-canvas-button-3';
        const targetElement = document.querySelector('#assignment_show > div.assignment-title > div.assignment-buttons');


        // Check if the target element exists before appending
        if (targetElement) {
            // Get the second-to-last child of the target element
            const children = targetElement.children;
            const secondToLastChild = children[children.length - 2];

            // Check if there is at least two children
            if (secondToLastChild) {
                // Insert the new element before the second-to-last child
                targetElement.insertBefore(newDiv, secondToLastChild);
            } else {
                // If there are fewer than two children, append to the end
                targetElement.appendChild(newDiv);
            }
        } else {
            console.error('2: Target element not found.');
        }
    }
    else {
        console.error('all cases passed, no match');
        return;
    }




}


console.log("running?")
window.addEventListener('load', main);


console.log("ran?")
