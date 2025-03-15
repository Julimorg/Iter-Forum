const POSTS_API = 'http://localhost:3000/posts';

const getJSON = async (url: string) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    }catch(error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

//? Fetch all posts
export const fetchPost = async function() {
    return await getJSON(POSTS_API);
}

console.log(fetchPost());