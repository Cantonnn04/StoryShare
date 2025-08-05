let currentOffset = 0;
const storiesPerLoad = 3;

// Form submission
document.getElementById('main-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent page refresh

    // Get data from the form
    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('title', document.getElementById('title').value);
    formData.append('body', document.getElementById('body').value);

    // Send to PHP
    fetch('story_form.php', {
        method: 'POST',
        body: formData
    })
        .then(() => {
            // Reset the form after successful submission
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

            // Add each story to the container
            data.stories.forEach(story => {
                const storyDiv = document.createElement('div');
                storyDiv.className = 'story';
                
                // Format the date
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

            // Update offset for next load
            currentOffset += storiesPerLoad;


            // (I had issues with keeping the same button and this was the easiest solution)
            let showMoreBtn = document.getElementById('show-more-btn');
            
            // Remove existing button if it exists
            if (showMoreBtn) {
                showMoreBtn.remove();
            }
            
            if (data.hasMore) {
                // Create new button and add to bottom
                showMoreBtn = document.createElement('button');
                showMoreBtn.id = 'show-more-btn';
                showMoreBtn.textContent = 'Show More';
                showMoreBtn.addEventListener('click', () => loadStories());
                storiesContainer.appendChild(showMoreBtn);
            }
        })
}



// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Load initial stories when page loads
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