
function checkUrl() {


    return window.location.href.includes('canvas');
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

    let mlResponse = null;


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

        let iframe = document.querySelector("#assignment_description_ifr");
        if (!iframe) {
            console.error('Iframe not found');
            return;
        }

        let innerDoc = iframe.contentDocument || iframe.contentWindow.document;
        let container = innerDoc.querySelector("#tinymce");


        let date = document.querySelector("#Selectable_1").value

        //let content = "<div>" + container.innerHTML + "LLM IMPORTANT! Due Date: " + date + "<\div>"; 

        let content = container.innerHTML + "LLM IMPORTANT! Due Date: " + date;

        //let content = container.innerHTML; 
        console.error(content)


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
                console.log(data);  // 处理响应数据
                let iframe = document.querySelector("#assignment_description_ifr");
                if (!iframe) {
                    console.error('Iframe not found');
                    return;
                }

                let innerDoc = iframe.contentDocument || iframe.contentWindow.document;
                let container = innerDoc.querySelector("#tinymce");
                if (container) {
                    const newElement = document.createElement("p");
                    newElement.innerHTML = "[AI Generated estimated work time: " + data["project"]["content"].split('"estimated_time": "')[1].split('",\n')[0] + "]";
                    container.appendChild(newElement);

                    mlResponse = data["project"]["content"];

                    console.log("CONTAINER EXISTS, APPENDED")
                }


            })
            .catch(error => {
                console.error('Error:', error);  // 处理错误
            });
    }

    function submitToMailBox() {


        let rDeadline = document.querySelector("#Selectable_1").value;
        let rSummary = mlResponse.split('"project summary": "')[1].split('"\n')[0];
        let rTime = mlResponse.split('"estimated_time": "')[1].split('",\n')[0];


        
        // 构造 JSON 内容
        const projectContent = {
            project: {
                content: JSON.stringify({
                    estimated_time: rTime,
                    deadline: rDeadline,
                    project_summary: rSummary
                }),
                role: "assistant",
                function_call: null,
                tool_calls: null,
                refusal: null
            }
        };

        // 将内容转换为 JSON 字符串并编码为 URL 参数
        const queryString = encodeURIComponent(JSON.stringify(projectContent));

        // 构造最终的 URL 请求
        const url = `http://127.0.0.1:8000/UploadToMailbox/?Content=${queryString}`;

        // 发送 GET 请求
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }


    let saveButton = document.querySelector("#edit_assignment_form > div.form-actions > div.assignment__action-buttons > button.btn.btn-primary");

    let saveAndPublishButton = document.querySelector("#edit_assignment_form > div.form-actions > div.assignment__action-buttons > button.btn.btn-default.save_and_publish");


    // Add an event listener to the div
    newDiv.addEventListener('click', handleClick);

    if (saveButton != null) {
        saveButton.addEventListener('click', submitToMailBox);
    }

    if (saveAndPublishButton != null) {
        saveAndPublishButton.addEventListener('click', submitToMailBox);
    }



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
