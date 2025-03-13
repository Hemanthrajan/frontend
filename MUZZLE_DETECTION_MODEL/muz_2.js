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

document.querySelector('.ge').addEventListener('click', function () {
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select an image first.');
        return;
    }

    const folderInput = document.querySelector('.embedding input');
    const userFolder = folderInput.value.trim();

    if (!userFolder) {
        alert('Please enter a folder name.');
        return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('user_folder', userFolder);

    // Show "Processing output..." immediately
    let responseContainer = document.getElementById('responseContainer');
    if (!responseContainer) {
        responseContainer = document.createElement('div');
        responseContainer.id = 'responseContainer';
        document.querySelector('.embedding').appendChild(responseContainer);
    }
    responseContainer.textContent = 'Identifying and comparing embeddings in cattle database...';
    responseContainer.style.marginTop = '8px';
    responseContainer.style.fontWeight = 'bold';
    responseContainer.style.color = 'black'; // Processing message in orange

    // Simulate a delay of 2 seconds before sending the fetch request
    setTimeout(() => {
        fetch('http://192.168.5.26:5002/mark_attendance', {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                responseContainer.textContent = data.message || 'Response received successfully!';
                responseContainer.style.color = 'green'; // Response message in green

                let tableContainer = document.getElementById('tableContainer');
                if (!tableContainer) {
                    tableContainer = document.createElement('div');
                    tableContainer.id = 'tableContainer';
                    document.querySelector('.embedding').appendChild(tableContainer);
                }

                // Generate table with cow details
                const tableHTML = `
                    <table border="1" style="margin-top: 10px; border-collapse: collapse; width: 100%;">
                        <tbody>
                            <tr>
                                <td style="font-weight: bold;">cow_id</td>
                                <td>${data.id || 'cow_1'}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;">cow_name</td>
                                <td>${data.name || 'cow'}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;">cow_age</td>
                                <td>${data.age || '12'}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;">cow_district</td>
                                <td>${data.district || 'chennai'}</td>
                            </tr>
                        </tbody>
                    </table>
                `;

                tableContainer.innerHTML = tableHTML;
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while processing your request.');
                responseContainer.textContent = 'Failed to process. Please try again.';
                responseContainer.style.color = 'red';
            });
    }, 2000); // 2-second delay before making the fetch request
});
