
document.addEventListener("DOMContentLoaded", () => {
    const tabList = document.getElementById("tab-list");
    const searchInput = document.getElementById("search-tabs");

    function updateTabList(query = "") {
        chrome.tabs.query({}, (tabs) => {
            tabList.innerHTML = "";
            tabs.forEach((tab) => {
                if (query && !tab.title.toLowerCase().includes(query.toLowerCase())) {
                    return;
                }

                const tabItem = document.createElement("li");
                tabItem.classList.add("tab-item");

                // Tab Icon
                const tabIcon = document.createElement("img");
                tabIcon.src = tab.favIconUrl ? tab.favIconUrl : "icon1.jpg";
                tabIcon.classList.add("tab-icon");

                // Handle cases where favicon fails to load
                tabIcon.onerror = function () {
                    this.src = "icon1.jpg"; // Set default icon if error occurs
                };

                // Tab Title
                const tabTitle = document.createElement("span");
                tabTitle.textContent = tab.title;
                tabTitle.classList.add("tab-title");

                // Close Button
                const closeButton = document.createElement("button");
                closeButton.innerHTML = "&#10006;"; // Unicode X symbol
                closeButton.classList.add("close-btn");

                closeButton.addEventListener("click", (e) => {
                    e.stopPropagation();
                    chrome.tabs.remove(tab.id, () => {
                        tabItem.remove();
                    });
                });

                tabItem.addEventListener("click", () => {
                    chrome.tabs.update(tab.id, { active: true });
                });

                tabItem.appendChild(tabIcon);
                tabItem.appendChild(tabTitle);
                tabItem.appendChild(closeButton);
                tabList.appendChild(tabItem);
            });
        });
    }

    // Update tab list when search input changes
    searchInput.addEventListener("input", () => updateTabList(searchInput.value));

    // Load all tabs on startup
    updateTabList();
});


