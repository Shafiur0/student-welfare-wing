/**
 * SQAT Student Welfare Wing Website Interactivity & Core Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. LOADING SCREEN
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    window.addEventListener("load", () => {
      loadingScreen.classList.add("fade-out");
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 500);
    });
    // Fallback: hide loader after 3 seconds in case window load is delayed
    setTimeout(() => {
      if (loadingScreen.style.display !== "none") {
        loadingScreen.classList.add("fade-out");
        setTimeout(() => {
          loadingScreen.style.display = "none";
        }, 500);
      }
    }, 3000);
  }

  // 2. THEME SWITCHER (DARK/LIGHT MODE)
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const currentTheme = localStorage.getItem("theme") || "light";
  
  // Set initial theme
  document.documentElement.setAttribute("data-theme", currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const activeTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = activeTheme === "dark" ? "light" : "dark";
      
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }

  // 3. RESPONSIVE MOBILE NAVIGATION MENU
  const menuToggleBtn = document.getElementById("menu-toggle-btn");
  const navMenu = document.getElementById("nav-menu");
  
  if (menuToggleBtn && navMenu) {
    menuToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      navMenu.classList.toggle("active");
      const icon = menuToggleBtn.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-xmark");
      }
    });

    // Close menu when clicking outside or clicking links
    document.addEventListener("click", (e) => {
      if (navMenu.classList.contains("active") && !navMenu.contains(e.target) && !menuToggleBtn.contains(e.target)) {
        navMenu.classList.remove("active");
        const icon = menuToggleBtn.querySelector("i");
        if (icon) {
          icon.classList.add("fa-bars");
          icon.classList.remove("fa-xmark");
        }
      }
    });

    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        const icon = menuToggleBtn.querySelector("i");
        if (icon) {
          icon.classList.add("fa-bars");
          icon.classList.remove("fa-xmark");
        }
      });
    });
  }

  // 4. SCROLL PROGRESS BAR & BACK TO TOP BUTTON
  const scrollProgressBar = document.getElementById("scroll-progress-bar");
  const backToTopBtn = document.getElementById("back-to-top");
  
  window.addEventListener("scroll", () => {
    const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Progress bar
    if (height > 0) {
      const scrolled = (windowScroll / height) * 100;
      if (scrollProgressBar) {
        scrollProgressBar.style.width = scrolled + "%";
      }
    }
    
    // Back to top visible trigger
    if (backToTopBtn) {
      if (windowScroll > 400) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // 5. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  const revealElements = document.querySelectorAll(".reveal");
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target); // Reveal once
      }
    });
  }, {
    threshold: 0.01,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 6. STATISTICS COUNTER ANIMATION
  const statNums = document.querySelectorAll(".stat-num");
  
  const animateCounters = (elements) => {
    elements.forEach(element => {
      const target = parseInt(element.getAttribute("data-target"), 10);
      const duration = 2000; // 2 seconds
      const stepTime = Math.max(Math.floor(duration / target), 15);
      let start = 0;
      
      const timer = setInterval(() => {
        start += Math.ceil(target / (duration / stepTime));
        if (start >= target) {
          element.textContent = target + "+";
          clearInterval(timer);
        } else {
          element.textContent = start + "+";
        }
      }, stepTime);
    });
  };

  const statsGrid = document.querySelector(".stats-grid");
  if (statsGrid && statNums.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters(statNums);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    statsObserver.observe(statsGrid);
  }

  // 7. MOUSE GLOW CARD COORDINATES TRACKER
  const initCardGlowEvents = () => {
    const glowCards = document.querySelectorAll(".glow-card, .animated-border-card");
    glowCards.forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      });
    });
  };
  initCardGlowEvents();

  // 8. DYNAMIC WING MEMBERS GRID, SEARCH, & FILTERS
  const membersTargetGrid = document.getElementById("members-grid-target");
  const memberSearchInput = document.getElementById("member-search");
  const filterDeptSelect = document.getElementById("filter-dept");
  const filterSessionSelect = document.getElementById("filter-session");

  // View Profile Modal references
  const profileModal = document.getElementById("profile-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalImg = document.getElementById("modal-user-img");
  const modalName = document.getElementById("modal-user-name");
  const modalPos = document.getElementById("modal-user-pos");
  const modalDept = document.getElementById("modal-user-dept");
  const modalSession = document.getElementById("modal-user-session");
  const modalSocials = document.getElementById("modal-socials-wrapper");

  const renderMembers = (filteredMembers) => {
    if (!membersTargetGrid) return;
    membersTargetGrid.innerHTML = "";

    if (filteredMembers.length === 0) {
      membersTargetGrid.innerHTML = `<div class="no-results">No wing members found matching the criteria.</div>`;
      return;
    }

    filteredMembers.forEach(member => {
      const card = document.createElement("div");
      card.className = "board-card glow-card reveal visible"; // Force reveal visible for dynamic render
      card.innerHTML = `
        <div class="board-img-wrapper">
          <img src="${member.image}" alt="${member.name}" class="board-img" loading="lazy">
        </div>
        <div class="board-info">
          <h4>${member.name}</h4>
          <div class="board-pos">${member.position}</div>
          <div class="board-detail">${member.department}</div>
        </div>
        <button class="btn btn-secondary btn-view-profile" style="padding: 6px 16px; font-size: 0.8rem; margin-top: 12px; width: auto;">
          View Profile
        </button>
      `;

      // Event listener for profile modal open
      const viewProfileBtn = card.querySelector(".btn-view-profile");
      viewProfileBtn.addEventListener("click", () => {
        openProfileModal(member);
      });

      membersTargetGrid.appendChild(card);
    });

    // Reinitialize mouse glow tracking coordinates for newly created cards
    initCardGlowEvents();
  };

  const openProfileModal = (member) => {
    if (!profileModal) return;
    
    modalImg.src = member.image;
    modalImg.alt = member.name;
    modalName.textContent = member.name;
    modalPos.textContent = member.position;
    modalDept.textContent = member.department;
    modalSession.textContent = member.session;

    // Social Links
    modalSocials.innerHTML = `
      <a href="${member.facebook}" target="_blank" rel="noopener" class="social-btn" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
      <a href="${member.linkedin}" target="_blank" rel="noopener" class="social-btn" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
    `;

    profileModal.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent background scroll
  };

  const closeProfileModal = () => {
    if (profileModal) {
      profileModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeProfileModal);
  }
  if (profileModal) {
    profileModal.addEventListener("click", (e) => {
      if (e.target === profileModal) {
        closeProfileModal();
      }
    });
  }

  // Filter functionality
  const performFiltering = () => {
    if (!window.SQAT_MEMBERS) return;
    
    const searchVal = memberSearchInput ? memberSearchInput.value.toLowerCase().trim() : "";
    const selectedDept = filterDeptSelect ? filterDeptSelect.value : "all";
    const selectedSession = filterSessionSelect ? filterSessionSelect.value : "all";

    const filtered = window.SQAT_MEMBERS.filter(member => {
      const matchSearch = member.name.toLowerCase().includes(searchVal) || member.position.toLowerCase().includes(searchVal);
      const matchDept = selectedDept === "all" || member.department === selectedDept;
      const matchSession = selectedSession === "all" || member.session === selectedSession;
      return matchSearch && matchDept && matchSession;
    });

    renderMembers(filtered);
  };

  if (memberSearchInput) memberSearchInput.addEventListener("input", performFiltering);
  if (filterDeptSelect) filterDeptSelect.addEventListener("change", performFiltering);
  if (filterSessionSelect) filterSessionSelect.addEventListener("change", performFiltering);

  // Initial render of members
  if (window.SQAT_MEMBERS) {
    renderMembers(window.SQAT_MEMBERS);
  }

  // 9. DYNAMIC GALLERY RENDERING & LIGHTBOX
  const galleryGridTarget = document.getElementById("gallery-grid-target");
  const galleryTabs = document.querySelectorAll(".gallery-tab");
  const galleryLightbox = document.getElementById("gallery-lightbox");
  const lightboxCloseBtn = document.getElementById("lightbox-close-btn");
  const lightboxTargetImg = document.getElementById("lightbox-target-img");
  const lightboxTargetCaption = document.getElementById("lightbox-target-caption");

  const renderGallery = (itemsToRender) => {
    if (!galleryGridTarget) return;
    galleryGridTarget.innerHTML = "";

    itemsToRender.forEach(item => {
      const el = document.createElement("div");
      el.className = "gallery-item reveal visible";
      el.setAttribute("data-category", item.category);
      el.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="gallery-item-img" loading="lazy">
        <div class="gallery-item-overlay">
          <div class="gallery-item-cat">${item.category}</div>
          <h4 class="gallery-item-title">${item.title}</h4>
        </div>
      `;

      el.addEventListener("click", () => {
        openLightbox(item);
      });

      galleryGridTarget.appendChild(el);
    });
  };

  const openImageLightbox = (src, alt, captionText) => {
    if (!galleryLightbox) return;
    lightboxTargetImg.src = src;
    lightboxTargetImg.alt = alt || "Enlarged Image";
    lightboxTargetCaption.textContent = captionText || alt || "";
    galleryLightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const openLightbox = (item) => {
    openImageLightbox(item.image, item.title, `${item.title} - ${item.date} (${item.description})`);
  };

  const closeLightbox = () => {
    if (galleryLightbox) {
      galleryLightbox.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener("click", closeLightbox);
  }
  if (galleryLightbox) {
    galleryLightbox.addEventListener("click", (e) => {
      if (e.target === galleryLightbox || e.target.classList.contains("lightbox-content")) {
        closeLightbox();
      }
    });
  }

  // Handle click on Convener, Co-Convener, Executive, Secretarial, or Wing Leadership member images
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("spotlight-img") || e.target.classList.contains("board-img")) {
      const card = e.target.closest(".spotlight-card, .board-card, .secretary-card");
      let name = e.target.alt || "";
      let position = "";
      if (card) {
        const h4 = card.querySelector("h4");
        const pos = card.querySelector(".spotlight-position, .board-pos");
        if (h4) name = h4.textContent;
        if (pos) position = pos.textContent;
      }
      const caption = position ? `${name} - ${position}` : name;
      openImageLightbox(e.target.src, name, caption);
    }
  });

  // Tab Filtering
  galleryTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      galleryTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      const filterValue = tab.getAttribute("data-filter");
      if (!window.SQAT_GALLERY) return;

      if (filterValue === "all") {
        renderGallery(window.SQAT_GALLERY);
      } else {
        const filtered = window.SQAT_GALLERY.filter(item => item.category === filterValue);
        renderGallery(filtered);
      }
    });
  });

  // Initial render of gallery
  if (window.SQAT_GALLERY) {
    renderGallery(window.SQAT_GALLERY);
  }

  // Close modals on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeProfileModal();
      closeLightbox();
    }
  });

  // 11. DYNAMIC SQA & TESTING RESOURCES
  const resourcesGridTarget = document.getElementById("resources-grid-target");
  const resourceSearchInput = document.getElementById("resource-search");
  const filterResourceCatSelect = document.getElementById("filter-resource-cat");

  // Resource Viewer Modal references
  const resourceModal = document.getElementById("resource-modal");
  const resourceModalCloseBtn = document.getElementById("resource-modal-close-btn");
  const resourceModalCloseActionBtn = document.getElementById("resource-modal-close-action-btn");
  const resourceModalCopyBtn = document.getElementById("resource-modal-copy-btn");
  
  const resourceModalIcon = document.getElementById("resource-modal-icon");
  const resourceModalTitle = document.getElementById("resource-modal-title");
  const resourceModalCategory = document.getElementById("resource-modal-category");
  const resourceModalContent = document.getElementById("resource-modal-content");

  let activeResourceData = ""; // Plain text for clipboard copies

  const renderResources = (filteredResources) => {
    if (!resourcesGridTarget) return;
    resourcesGridTarget.innerHTML = "";

    if (filteredResources.length === 0) {
      resourcesGridTarget.innerHTML = `<div class="no-results">No resources found matching the criteria.</div>`;
      return;
    }

    filteredResources.forEach(res => {
      const card = document.createElement("div");
      card.className = "board-card glow-card reveal visible"; // Force visible
      card.innerHTML = `
        <div class="contact-icon" style="margin-bottom: 16px; width: 56px; height: 56px; border-radius: var(--radius-md); font-size: 1.5rem; background-color: var(--border-subtle); color: var(--primary); display: flex; align-items: center; justify-content: center;"><i class="${res.icon}"></i></div>
        <div class="board-info" style="flex-grow: 1; display: flex; flex-direction: column; width: 100%;">
          <h4 style="margin-bottom: 8px;">${res.title}</h4>
          <div class="board-pos" style="font-size: 0.8rem; margin: 0 0 8px; text-transform: uppercase;">${res.category}</div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; flex-grow: 1; text-align: center;">${res.desc}</p>
        </div>
        <button class="btn btn-secondary btn-view-resource" style="padding: 8px 20px; font-size: 0.85rem; margin-top: 16px; width: 100%;">
          Open Vault
        </button>
      `;

      const viewBtn = card.querySelector(".btn-view-resource");
      viewBtn.addEventListener("click", () => {
        openResourceModal(res);
      });

      resourcesGridTarget.appendChild(card);
    });

    // Reinitialize mouse glow coordinates
    initCardGlowEvents();
  };

  const openResourceModal = (res) => {
    if (!resourceModal) return;

    resourceModalIcon.className = res.icon;
    resourceModalTitle.textContent = res.title;
    resourceModalCategory.textContent = res.category;

    // Render content depending on format type
    let htmlContent = "";
    let plainText = "";

    if (res.content.type === "code") {
      htmlContent = `<pre style="font-family: monospace; white-space: pre-wrap; font-size: 0.85rem; color: var(--primary); overflow-x: auto; background: rgba(var(--primary-rgb), 0.05); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-light);">${escapeHtml(res.content.data)}</pre>`;
      plainText = res.content.data;
    } else if (res.content.type === "table") {
      let tableHtml = `<table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;"><thead><tr style="border-bottom: 2px solid var(--border-glass);">`;
      
      res.content.data.headers.forEach(h => {
        tableHtml += `<th style="padding: 8px; text-align: left; font-weight: 700;">${h}</th>`;
      });
      tableHtml += `</tr></thead><tbody>`;

      res.content.data.rows.forEach(row => {
        tableHtml += `<tr style="border-bottom: 1px solid var(--border-light);">`;
        row.forEach(cell => {
          tableHtml += `<td style="padding: 8px; vertical-align: top; white-space: pre-line;">${cell}</td>`;
        });
        tableHtml += `</tr>`;
      });
      tableHtml += `</tbody></table>`;
      htmlContent = tableHtml;

      // Generate markdown representation for copy
      plainText = "| " + res.content.data.headers.join(" | ") + " |\n";
      plainText += "| " + res.content.data.headers.map(() => "---").join(" | ") + " |\n";
      res.content.data.rows.forEach(row => {
        plainText += "| " + row.map(cell => cell.replace(/\n/g, " ")).join(" | ") + " |\n";
      });
    } else {
      // Standard parsed text layout
      let parsedText = res.content.data
        .replace(/### (.*)/g, '<h4 style="font-size: 1.1rem; color: var(--primary); margin: 16px 0 8px;">$1</h4>')
        .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
        .replace(/\* (.*)/g, '<li style="margin-left: 16px; list-style-type: disc; margin-bottom: 6px;">$1</li>');
      
      htmlContent = `<div>${parsedText}</div>`;
      plainText = res.content.data;
    }

    resourceModalContent.innerHTML = htmlContent;
    activeResourceData = plainText;

    // Reset copy button status
    resourceModalCopyBtn.innerHTML = `<i class="fa-regular fa-copy"></i> Copy Content`;

    resourceModal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeResourceModal = () => {
    if (resourceModal) {
      resourceModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  const escapeHtml = (text) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  if (resourceModalCloseBtn) resourceModalCloseBtn.addEventListener("click", closeResourceModal);
  if (resourceModalCloseActionBtn) resourceModalCloseActionBtn.addEventListener("click", closeResourceModal);
  
  if (resourceModal) {
    resourceModal.addEventListener("click", (e) => {
      if (e.target === resourceModal) {
        closeResourceModal();
      }
    });
  }

  if (resourceModalCopyBtn) {
    resourceModalCopyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(activeResourceData).then(() => {
        resourceModalCopyBtn.innerHTML = `<i class="fa-solid fa-check" style="color: var(--accent);"></i> Copied!`;
        setTimeout(() => {
          resourceModalCopyBtn.innerHTML = `<i class="fa-regular fa-copy"></i> Copy Content`;
        }, 2000);
      }).catch(err => {
        console.error("Failed to copy text: ", err);
      });
    });
  }

  // Filter & Search SQA Resources
  const performResourceFiltering = () => {
    if (!window.SQAT_RESOURCES) return;

    const searchVal = resourceSearchInput ? resourceSearchInput.value.toLowerCase().trim() : "";
    const selectedCat = filterResourceCatSelect ? filterResourceCatSelect.value : "all";

    const filtered = window.SQAT_RESOURCES.filter(res => {
      const matchSearch = res.title.toLowerCase().includes(searchVal) || res.desc.toLowerCase().includes(searchVal);
      const matchCat = selectedCat === "all" || res.category === selectedCat;
      return matchSearch && matchCat;
    });

    renderResources(filtered);
  };

  if (resourceSearchInput) resourceSearchInput.addEventListener("input", performResourceFiltering);
  if (filterResourceCatSelect) filterResourceCatSelect.addEventListener("change", performResourceFiltering);

  // Initial render of SQA resources
  if (window.SQAT_RESOURCES) {
    renderResources(window.SQAT_RESOURCES);
  }

  // 10. SCROLL LINK HIGHLIGHTING & NAVIGATION OBSERVER
  const sections = document.querySelectorAll("section[id]");
  
  const scrollActiveLinkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        const correspondingLink = document.querySelector(`.nav-link[href="#${id}"]`);
        
        if (correspondingLink) {
          document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
          correspondingLink.classList.add("active");
        }
      }
    });
  }, {
    threshold: 0,
    rootMargin: "-20% 0px -60% 0px"
  });

  sections.forEach(s => scrollActiveLinkObserver.observe(s));
});
