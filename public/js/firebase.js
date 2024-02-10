const blogSection = document.querySelector('.blogs-section');

// Fetch blogs from the server
fetch('/blogs')
    .then(response => response.json())
    .then(blogs => {
        blogs.forEach(blog => {
            createBlog(blog);
        });
    })
    .catch(error => console.error('Error fetching blogs:', error));

const createBlog = (blog) => {
    blogSection.innerHTML += `
    <div class="blog-card">
        <img src="${blog.bannerImage}" class="blog-image" alt="">
        <h1 class="blog-title">${blog.title.substring(0, 100) + '...'}</h1>
        <p class="blog-overview">${blog.article.substring(0, 200) + '...'}</p>
        <a href="/${blog._id}" class="btn dark">read</a>
    </div>
    `;
};
