let currentOffset = 0;
const storiesPerLoad = 3;

// Form submission
document.getElementById('main-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent page refresh upon submit (note to prof: normally after a form submit it refreshed the page which I did not like)

    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('title', document.getElementById('title').value);
    formData.append('body', document.getElementById('body').value);

    fetch('story_form.php', {
        method: 'POST',
        body: formData
    })
        .then(() => {
            document.getElementById('main-form').reset();
        });
});

// Load stories function
function loadStories(reset = false) {
    if (reset) {
        currentOffset = 0;
        document.getElementById('stories').innerHTML = '';
    }

    fetch(`story_form.php?action=get_stories&offset=${currentOffset}`)
        .then(response => response.json())
        .then(data => {
            const storiesContainer = document.getElementById('stories');

            data.stories.forEach(story => {
                const storyDiv = document.createElement('div');
                storyDiv.className = 'story';
                
                const date = new Date(story.submitted_at);
                const formattedDate = date.toLocaleString();
                
                storyDiv.innerHTML = `
                    <h3>${escapeHtml(story.title)}</h3>
                    <p>${escapeHtml(story.body)}</p>
                    <p><strong>Author:</strong> ${escapeHtml(story.anonymous_name)}</p>
                    <p><strong>Time:</strong> ${formattedDate}</p>
                    <hr>
                `;
                
                storiesContainer.appendChild(storyDiv);
            });

            currentOffset += storiesPerLoad;


            // (I had issues with keeping the same button and this was the easiest solution (removing the button and adding in a new one each time instead of updating the current button))
            let showMoreBtn = document.getElementById('show-more-btn');
            
            if (showMoreBtn) {
                showMoreBtn.remove();
            }
            
            if (data.hasMore) {
                showMoreBtn = document.createElement('button');
                showMoreBtn.id = 'show-more-btn';
                showMoreBtn.textContent = 'Show More';
                showMoreBtn.addEventListener('click', () => loadStories());
                storiesContainer.appendChild(showMoreBtn);
            }
        })
}



function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// This loads the original 3 stories as someones enters the page, I did not want there to be user input to get the first stories from the database
document.addEventListener('DOMContentLoaded', function() {
    loadStories();
});


// Back to top button
const backToTopButton = document.getElementById("backToTop");

backToTopButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});