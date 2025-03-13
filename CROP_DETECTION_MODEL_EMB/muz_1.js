document.getElementById('imageInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            const container = document.getElementById('imageContainer');
            container.innerHTML = ''; // Clear existing content
            container.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});

document.querySelector('.detect').addEventListener('click', function () {
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select an image first.');
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    fetch('http://192.168.5.26:5002/getbbox', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            let resultContainer = document.getElementById('resultContainer');

            // If the container doesn't exist, create it
            if (!resultContainer) {
                resultContainer = document.createElement('div');
                resultContainer.id = 'resultContainer';
                document.querySelector('.zindex').appendChild(resultContainer);
            }

            // Update the result text
            resultContainer.textContent = data.message;
            resultContainer.style.marginTop = '20px';
            resultContainer.style.fontWeight = 'bold';
            resultContainer.style.color = 'red'; // Set the text color to red
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

document.querySelector('.ge').addEventListener('click', function () {
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select an image first.');
        return;
    }

    // Get the desired file name from the input field
    const fileName = document.querySelector('.embedding input').value.trim();
    if (!fileName) {
        alert('Please provide a folder name.');
        return;
    }

    const formData = new FormData();
    formData.append('user_folder', fileName); // Append the desired folder name

    // Make the POST request to rename the file on the server
    fetch('http://192.168.5.26:5002/generate_embeddings', {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP error! Status: ${response.status}');
            }
            return response.json(); // Parse the JSON response
        })
        .then(data => {
            // Display success message below the image
            let resultContainer = document.getElementById('resultContainer');
            if (!resultContainer) {
                resultContainer = document.createElement('div');
                resultContainer.id = 'resultContainer';
                document.querySelector('.zindex').appendChild(resultContainer);
            }

            resultContainer.textContent = data.message || 'File renamed successfully!';
            resultContainer.style.marginTop = '20px';
            resultContainer.style.fontWeight = 'bold';
            resultContainer.style.color = 'green'; // Success message in green
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while renaming the file.');
        });
});
