// export function highlightActiveNav() {
//     const navLinks = document.querySelectorAll("#navbarNav .nav-link");
//     const currentPath = window.location.pathname.split("/").pop();
// 	console.log(`Current Path: ${currentPath}`);
	
//     navLinks.forEach((link) => {
//       const linkPath = link.getAttribute("href");
// 	  console.log(`Link path: ${linkPath}`);
//       if (linkPath === currentPath || (linkPath === "#" && currentPath.includes("faq"))) {
//         link.classList.add("active");
//       } else {
//         link.classList.remove("active");
//       }
//     });
// }

export function highlightActiveNav() {
    const navLinks = document.querySelectorAll("#navbarNav .nav-link");
    const currentPath = window.location.pathname.split("/").pop();
    console.log(`Current Path: ${currentPath}`);

    navLinks.forEach((link) => {
        const linkPath = link.getAttribute("href");
        console.log(`Link path: ${linkPath}`);

        // Split the .html extension from linkPath
        const linkPathWithoutExtension = linkPath.endsWith(".html") ? linkPath.slice(0, -5) : linkPath;
        const currentPathWithoutExtension = currentPath.endsWith(".html") ? currentPath.slice(0, -5) : currentPath;

        if (linkPathWithoutExtension === currentPathWithoutExtension) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}