// assets/js/signup.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signup-form");
    const modal = document.getElementById("dialogue-box");
    const closeButton = document.querySelector(".close-button");
    const message = document.getElementById("dialogue-message");
  
    form.addEventListener("submit", function (event) {
      event.preventDefault();
  
      // Simulate account creation
      message.textContent = "Account created successfully!";
      modal.style.display = "flex";
    });
  
    closeButton.addEventListener("click", () => {
      modal.style.display = "none";
    });
  
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  });
  