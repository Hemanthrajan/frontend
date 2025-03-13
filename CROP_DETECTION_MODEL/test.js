document.addEventListener("DOMContentLoaded", () => {
  const imageInput = document.getElementById("imageInput");
  const imageContainer = document.getElementById("imageContainer");
  const detectButton = document.getElementById("detectButton");
  const cropName = document.getElementById("cropName");
  const stage = document.getElementById("stage");
  const resultContainer = document.createElement("div");

  // Ensure all required elements are present
  if (!imageInput || !imageContainer || !detectButton || !cropName || !stage) {
      console.error("One or more elements are missing in the DOM.");
      return;
  }

  // Append the result container below the detectButton
  detectButton.insertAdjacentElement("afterend", resultContainer);

  // Handle Image Preview
  imageInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
              // Set the image in the container
              imageContainer.innerHTML = `<img src="${e.target.result}" alt="Selected Image" style="max-width: 100%; height: auto;">`;
          };
          reader.readAsDataURL(file);
      } else {
          // Reset the container if no file is selected
          imageContainer.innerHTML = "<p>No image chosen</p>";
      }
  });

  // Handle "Detect" Button Click
  detectButton.addEventListener("click", async () => {
      const selectedCropName = cropName.value;
      const selectedStage = stage.value;
      const selectedFile = imageInput.files[0];

      if (!selectedCropName || !selectedStage || !selectedFile) {
          resultContainer.innerHTML = "<p>Please select a crop name, stage, and an image before detecting!</p>";
          return;
      }

      const formData = new FormData();
      formData.append("crop_name", selectedCropName);
      formData.append("crop_stage", selectedStage);
      formData.append("image", selectedFile);

      try {
          const response = await fetch("http://192.168.5.26:9005/ai/classify", {
              method: "POST",
              body: formData,
          });

          if (response.ok) {
              const result = await response.json();

              // Safely access result fields
              const status = result?.status || "Unknown";
              const confidence = result?.result?.confidence || "N/A";
              const className = result?.result?.["class name"] || "N/A";

              // Formatting result with new lines
              const formattedResult = `
                  <p><strong>Status:</strong> ${status}</p>
                  <p><strong>Confidence:</strong> ${confidence}</p>
                  <p><strong>Class Name:</strong> ${className}</p>
              `;
              resultContainer.innerHTML = formattedResult;
          } else {
              const errorText = await response.text();
              resultContainer.innerHTML = `<p>Error: ${errorText || response.statusText}</p>`;
          }
      } catch (error) {
          console.error("Error during detection:", error);
          resultContainer.innerHTML = "<p>An error occurred. Please check your connection and try again.</p>";
      }
  });
});
