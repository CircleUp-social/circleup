function filterBlogs() {
    const searchInput = document.getElementById("search-input").value.toLowerCase();
    const blogPosts = document.querySelectorAll(".blog-card");
  
    blogPosts.forEach((post) => {
      const title = post.getAttribute("data-title").toLowerCase();
      if (title.includes(searchInput)) {
        post.style.display = "block";
      } else {
        post.style.display = "none";
      }
    });
  }
  