export function highlightActiveNav() {
    const navLinks = document.querySelectorAll(".custom-navbar .nav-link");
    const currentPath = window.location.pathname.split("/").pop();
  
    navLinks.forEach((link) => {
      const linkPath = link.getAttribute("href");
      if (linkPath === currentPath || (linkPath === "#" && currentPath.includes("faq"))) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }