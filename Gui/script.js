function fetchData() {
    fetch('https://jsonplaceholder.typicode.com/posts/1')
        .then(response => response.json())
        .then(data => {
            document.getElementById('output').innerHTML = `
                <h3>${data.title}</h3>
                <p>${data.body}</p>
            `;
        })
        .catch(error => {
            document.getElementById('output').innerText = 'Error fetching data';
            console.error('Error:', error);
        });
}
