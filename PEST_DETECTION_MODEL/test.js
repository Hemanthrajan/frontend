// DOM Elements
const imageInput = document.getElementById("imageInput");
const imageContainer = document.getElementById("imageContainer");
const detectButton = document.querySelector(".detect");
const outputImage = document.getElementById("outputImage");
const resultContainer = document.querySelector(".output-container");

// Variable to store the selected image file
let selectedImage = null;

// Handle Image Upload and Preview
imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imageContainer.innerHTML = `<img src="${e.target.result}" 
                alt="Selected Image" style="max-width: 100%; border-radius: 10px;">`;
        };
        reader.readAsDataURL(file);
        selectedImage = file;  // Store the image file for upload
    } else {
        imageContainer.innerHTML = "<p>No image chosen</p>";
        selectedImage = null;
    }
});

// Handle Detect Pests Button Click
detectButton.addEventListener("click", async () => {
    if (!selectedImage) {
        alert("Please select an image first!");
        return;
    }

    // Clear any previous results
    resultContainer.innerHTML = ""; // Clear output container
    const previousResults = document.querySelectorAll(".detect-result");
    previousResults.forEach((el) => el.remove()); // Remove previous result elements

    // Prepare the form data with 'image' key
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
        // Display loading message
        outputImage.style.display = "none";
        resultContainer.innerHTML = "<p style='color: green;'>Processing...</p>";
        
       

        // Send the POST request to the backend
        const response = await fetch("http://192.168.5.26:9004/ai/classify", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data)

            // Check if valid data is returned
            if (data.file_name) {

                // Update the processed image inside the output container
                 resultContainer.innerHTML = ""
                
                const imageUrl = `https://192.168.5.26:9004/${data.file_name}`;
                console.log(imageUrl)
                outputImage.src = imageUrl;
                outputImage.style.display = "block";
                resultContainer.appendChild(outputImage);

                // Move result below the detect button
                const resultText = `
                    <div class="detect-result" style="margin-top: 20px;">
                      <p style="font-weight: bold; margin:0;">Result:</p>             
                      <p style="font-weight: bold; margin:0;">Confidence: ${data.result.confidence}</p>
                      <p style="font-weight: bold; margin:0;">Classname: ${data.result.class_name}</p>
                     </div>
                    
                `;
                detectButton.insertAdjacentHTML("afterend", resultText);
                
            } else {
                resultContainer.innerHTML = "<p style='color: red;'>Unexpected response.</p>";
            }
        } else {
            resultContainer.innerHTML = "<p style='color: red;'>Failed to process the image.</p>";
        }
    } catch (error) {
        console.error("Error:", error);
        resultContainer.innerHTML = "<p style='color: red;'>An error occurred.</p>";
    }
});
