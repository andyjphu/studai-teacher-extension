
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
                'Content-Type': 'application/json',
                
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
    newDiv.innerHTML = `Estimate Time`;

    newDiv.id = 'button-time';


    function handleClick() {
    // 获取页面中需要传递的内容
    const content = document.querySelector("#assignment_show").innerHTML;

    // 构建请求体，包含需要传递的内容
    const requestData = {
        Content: content
    };

    // 发送 POST 请求到后端
    fetch('http://127.0.0.1:8000/Newproject/', {
        method: 'POST',  // 使用 POST 请求
        headers: {
            'Content-Type': 'application/json'  // 告诉服务器请求体是 JSON 格式
        },
        body: JSON.stringify(requestData)  // 将请求体转换为 JSON 格式
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();  // 假设服务器返回 JSON 响应
    })
    .then(data => {
        console.log('Success:', data);  // 处理响应数据
    })
    .catch(error => {
        console.error('Error:', error);  // 处理错误
    });
}


    // Add an event listener to the div
    newDiv.addEventListener('click', handleClick);



    if (isCanvasAssignmentCreationPage()) {

        const targetElement = document.querySelector('#edit_assignment_header > div.header-bar.assignment-edit-header > div');


        if (targetElement) {
            //targetElement.appendChild(newDiv)
            targetElement.insertBefore(newDiv, targetElement.firstChild);

        } else {
            console.error('1: Target element not found.');
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
