// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="about_me.html">About Me</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded affix "><li class="part-title">Space Projects</li><li class="chapter-item expanded "><a href="space_projects/3U_CubeSat.html"><strong aria-hidden="true">1.</strong> 3U CubeSat for IoT Applications</a></li><li class="chapter-item expanded "><a href="space_projects/LEO_Ground_Station.html"><strong aria-hidden="true">2.</strong> LEO Ground Station</a></li><li class="chapter-item expanded "><a href="space_projects/CanSat.html"><strong aria-hidden="true">3.</strong> CanSat Design and Fabrication</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded affix "><li class="part-title">Aeronautics Projects</li><li class="chapter-item expanded "><a href="aeronautics_projects/Autopilot.html"><strong aria-hidden="true">4.</strong> Autopilot System</a></li><li class="chapter-item expanded "><a href="aeronautics_projects/Glider.html"><strong aria-hidden="true">5.</strong> Flat Plate Glider</a></li><li class="chapter-item expanded "><a href="aeronautics_projects/UAV.html"><strong aria-hidden="true">6.</strong> An Advertising UAV</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded affix "><li class="part-title">Design Projects</li><li class="chapter-item expanded "><a href="design/cubesat.html"><strong aria-hidden="true">7.</strong> 1U CubeSat Reverse Design</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded affix "><li class="part-title">Experience</li><li class="chapter-item expanded "><a href="experience/EPS.html"><strong aria-hidden="true">8.</strong> EPS Subsystem Team Head</a></li><li class="chapter-item expanded "><a href="experience/Podcast.html"><strong aria-hidden="true">9.</strong> Aerospace Podcast Founder</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded affix "><li class="part-title">Training</li><li class="chapter-item expanded "><a href="training/SGaC.html"><strong aria-hidden="true">10.</strong> SGaC ACHIEVED Academy Space Systems Engineering</a></li><li class="chapter-item expanded "><a href="training/UDC.html"><strong aria-hidden="true">11.</strong> UDC DBF Training and Competition</a></li><li class="chapter-item expanded "><a href="training/SSTL.html"><strong aria-hidden="true">12.</strong> SSTLab CanSat Training</a></li><li class="chapter-item expanded "><a href="training/Shaghaf.html"><strong aria-hidden="true">13.</strong> Shaghaf Internship</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded affix "><a href="Contributions.html">Other Contributions</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
