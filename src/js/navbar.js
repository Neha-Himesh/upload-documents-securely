// Function to highlight the active navigation link based on the current page
export function highlightActiveNav() {
    // Select all navigation links inside the #navbarNav element
    const navLinks = document.querySelectorAll("#navbarNav .nav-link");

    // Get the current page's file name from the URL (e.g., 'index.html')
    const currentPath = window.location.pathname.split("/").pop();
    console.log(`Current Path: ${currentPath}`);

    // Loop through each nav link to determine if it matches the current page
    navLinks.forEach((link) => {
        // Get the 'href' attribute of the link (e.g., 'about.html')
        const linkPath = link.getAttribute("href");
        console.log(`Link path: ${linkPath}`);

        // Remove '.html' extension for comparison
        const linkPathWithoutExtension = linkPath.endsWith(".html") ? linkPath.slice(0, -5) : linkPath;
        const currentPathWithoutExtension = currentPath.endsWith(".html") ? currentPath.slice(0, -5) : currentPath;

        // If the cleaned-up link path matches the current path, add 'active' class
        if (linkPathWithoutExtension === currentPathWithoutExtension) {
            link.classList.add("active"); // Highlight the matching nav link
        } else {
            link.classList.remove("active"); // Remove highlight from non-matching links
        }
    });
}

