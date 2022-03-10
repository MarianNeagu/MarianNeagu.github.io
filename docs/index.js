let postsArrayLength;
let postsArray = [];
let postsContentArray = [];

// EVENT LISTENERES
document.getElementById('sort-posts-by').addEventListener('change', sortPostsBy);
document.getElementById('search-bar').addEventListener('input', searchTextInPosts);


if(localStorage.getItem("postsArrayLength") != null) {
    const postsContainer = document.querySelector("#posts-container");
    postsArrayLength = localStorage.getItem("postsArrayLength");

    // get the conent array from local storage
    postsContentArray = localStorage.getItem('postsContents');
    postsContentArray = JSON.parse(postsContentArray);

    for(let i = 0; i < postsArrayLength; i++)
    {
        const post = createPost(postsContentArray[i]);
        post.id = "post_" + i;
        postsArray.push(post);
    }

    sortPostsBy();
}
else postsArrayLength = 0;


function createPost(postContent) {

    const post = document.createElement("div");

    // post.textContent = postContent;
    post.textContent = convertToPlain(postContent);

    post.setAttribute('style',"background-color:#444");
    
    post.style.color = "#fafafa";
    post.style.marginTop = "10px";
    post.style.borderRadius = "10px";
    post.style.height = "auto";
    post.style.width = "auto";
    post.style.maxWidth = "800px"
    post.style.justifyContent = "center";
    post.style.textAlign = "left";
    post.style.padding = "20px";
    post.style.boxShadow = "4px 4px 10px rgba(22, 22, 22, 0.6)";
    post.classList.add("main-element");

    return post;
}

function addNewPost () {
    const postInputForm = document.getElementById("post-input-form");
    const postContentInput = document.getElementById("post-input").value; // text input from user

    if(postContentInput != "")
    {
        const post = createPost(postContentInput);

        post.id = "post_" + postsArrayLength.toString(); // first post will be 0
        postsArrayLength++;
        localStorage.setItem("postsArrayLength", postsArrayLength);

        postsArray.push(post);
        postsContentArray.push(post.textContent);
        localStorage.setItem("postsContents", JSON.stringify(postsContentArray));

        postInputForm.reset();

        sortPostsBy();
    }
    else alert("No content given for the post.")
}

function removeAllPosts () {
    // remove from local storage
    localStorage.removeItem('postsArrayLength');
    localStorage.removeItem('postsContents');

    // remove from container
    const postsContainer = document.getElementById("posts-container");
    while (postsContainer.firstChild) 
        postsContainer.removeChild(postsContainer.lastChild);

    // empty arrays and length
    postsArrayLength = 0;
    postsArray = [];
    postsContentArray = [];
}

function sortPostsBy() {

    const orderPostsSelector = document.getElementById("sort-posts-by");

    if(postsArrayLength)
    {
        // remove all posts and then add them again in the order selected by input
        const postsContainer = document.getElementById("posts-container");
        while (postsContainer.firstChild) 
            postsContainer.removeChild(postsContainer.lastChild);

        if(orderPostsSelector.options[orderPostsSelector.selectedIndex].value == "newest")
        {
            for(let i = 0; i < postsArray.length - 1; i++)
                for(let j = i + 1; j < postsArray.length; j++)
                    if(postsArray[i].id < postsArray[j].id)
                    {
                        var postAux = postsArray[i];
                        postsArray[i] = postsArray[j];
                        postsArray[j] = postAux;
                    }
        }

        else if(orderPostsSelector.options[orderPostsSelector.selectedIndex].value == "oldest")
        {
            for(let i = 0; i < postsArray.length - 1; i++)
                for(let j = i + 1; j < postsArray.length; j++)
                    if(postsArray[i].id > postsArray[j].id)
                    {
                        var postAux = postsArray[i];
                        postsArray[i] = postsArray[j];
                        postsArray[j] = postAux;
                    }
        }

        else if(orderPostsSelector.options[orderPostsSelector.selectedIndex].value == "alphabetical")
        {
            for(let i = 0; i < postsArray.length - 1; i++)
                for(let j = i + 1; j < postsArray.length; j++)
                    if(postsArray[i].textContent.toLowerCase() > postsArray[j].textContent.toLowerCase())
                    {
                        var postAux = postsArray[i];
                        postsArray[i] = postsArray[j];
                        postsArray[j] = postAux;
                    }
        }


        for(let i = 0; i < postsArray.length; i++)
            postsContainer.append(postsArray[i]);
    }

}

function searchTextInPosts() {
    var searchBarInput = document.getElementById('search-bar').value.toLowerCase();

    if(searchBarInput.value == "")
    {
        for(let i = 0; i < postsContentArray.length; i++)
            postsArray[i].innerHTML = convertToPlain(postContent);
    }

    // search the input given in posts
    // if we find a post that does not contain the input given and it is displayed => we hide it 
    // respectively, if we find a post that contain the input given and its hidden => we display it

    for(let i = 0; i < postsContentArray.length; i++)
    {
        var postContent = postsContentArray[i].toLowerCase();
        if(postContent.includes(searchBarInput))
        {                
            postsArray[i].style.display = "block";
            postsArray[i].innerHTML =  "<span style='color: red'>" + convertToPlain(postContent) + "</span>";
        }        
        else 
        {
            postsArray[i].style.display = "none";
        }
    }

}

function convertToPlain(html){

    // Create a new div element
    var tempDivElement = document.createElement("div");

    // Set the HTML content with the given value
    tempDivElement.innerHTML = html;

    // Retrieve the text property of the element 
    return tempDivElement.textContent || tempDivElement.innerText || "";
}