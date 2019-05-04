console.log('hello');

const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const storiesElement = document.querySelector('.stories');
const API_URL = 'http://localhost:5000/stories';

loadingElement.style.display = '';

listAllStories();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');
    
    const story = {
        name,
        content
    }

    form.style.display = 'none';
    loadingElement.style.display = '';

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(story),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
      .then(createdStory => {
          form.reset();
          setTimeout(() => {
            form.style.display = '';
          }, 30000);
          listAllStories();
      });
});

function listAllStories() {
    storiesElement.innerHTML = '';
    fetch(API_URL)
        .then(response => response.json())
        .then(stories => {
            console.log(stories);
            stories.reverse();
            stories.forEach(story => {
                const div = document.createElement('div');

                const header = document.createElement('h3');
                header.textContent = story.name;

                const contents = document.createElement('p');
                contents.textContent = story.content;

                const date = document.createElement('small');
                date.textContent = new Date(story.created);

                div.appendChild(header);
                div.appendChild(contents);
                div.appendChild(date);

                storiesElement.append(div);
            });
            loadingElement.style.display = 'none';
        });
}