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

  // 12. CLIENT-SIDE FAQ CHATBOT ASSISTANT LOGIC
  const chatbotLauncher = document.getElementById("chatbot-launcher");
  const chatbotWindow = document.getElementById("chatbot-window");
  const chatCloseBtn = document.getElementById("chat-close-btn");
  const chatMessages = document.getElementById("chat-messages");
  const chatSuggestions = document.getElementById("chat-suggestions");
  const chatInput = document.getElementById("chat-input");
  const chatSendBtn = document.getElementById("chat-send-btn");
  const chatbotBadge = document.querySelector(".chatbot-badge");

  if (chatbotLauncher && chatbotWindow) {
    const CHAT_KNOWLEDGE = [
      {
        id: "waiver",
        suggestion: "Waiver Requirements",
        keywords: ["waiver", "scholarship", "financial", "discount", "fees", "gpa", "cgpa"],
        response: "To apply for waiver support:<br>• Maintain a minimum <strong>CGPA of 3.00</strong>.<br>• Submit the online Waiver Form through your student portal.<br>• For validation or queries, visit the Welfare Desk or message <strong>Liza Akter</strong> (Student Welfare Secretary)."
      },
      {
        id: "secretary",
        suggestion: "Contact Secretaries",
        keywords: ["secretary", "liza", "contact", "facebook", "linkedin", "officers", "board"],
        response: "Here are details for our key secretaries:<br>• <strong>Student Welfare:</strong> Liza Akter (<a href='https://www.facebook.com/Lizaaaaaa85' target='_blank' rel='noopener'>Facebook Profile</a>)<br>• <strong>Women Welfare:</strong> Tasfia Jahan Nisha<br>• <strong>Office & Org:</strong> Rukaiya Akter Trisha<br>Click 'View Profile' under their cards in the Secretarial section for details."
      },
      {
        id: "join",
        suggestion: "Join SQAT Club",
        keywords: ["join", "membership", "apply", "recruit", "registration", "member", "sqat"],
        response: "SQAT Club membership recruitment opens at the start of each semester! Keep an eye on campus announcements or fill out the pre-registration inquiry on our <a href='#contact'>Contact Form</a>."
      },
      {
        id: "resources",
        suggestion: "Study Vault Resources",
        keywords: ["study", "vault", "resources", "cheatsheet", "template", "test cases", "interview"],
        response: "Explore our curated <strong>Study Vault</strong> under the <a href='#resources'>Resources section</a> of this page. It lists testing cheatsheets (Selenium, Postman, JMeter), QA documentation templates, and interview prep guides."
      },
      {
        id: "location",
        suggestion: "Office Location",
        keywords: ["location", "office", "room", "floor", "where", "campus", "address"],
        response: "The SQAT Club Office and Welfare Wing desk is located at:<br>• <strong>DIU Main Campus, Dhaka</strong><br>• <strong>Academic Building 4, Floor 4, Room 402</strong><br>Office hours: 9:00 AM - 5:00 PM (Sunday to Thursday)."
      }
    ];

    let welcomeSent = false;

    const addMessage = (sender, text) => {
      const bubble = document.createElement("div");
      bubble.className = `message-bubble ${sender}`;
      bubble.innerHTML = text;
      chatMessages.appendChild(bubble);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return bubble;
    };

    const showTypingIndicator = () => {
      const bubble = document.createElement("div");
      bubble.className = "message-bubble typing";
      bubble.innerHTML = `
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      `;
      chatMessages.appendChild(bubble);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return bubble;
    };

    const hideTypingIndicator = (indicator) => {
      if (indicator && indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
      }
    };

    const renderSuggestions = () => {
      if (!chatSuggestions) return;
      chatSuggestions.innerHTML = "";
      CHAT_KNOWLEDGE.forEach(item => {
        const chip = document.createElement("button");
        chip.className = "chat-chip";
        chip.textContent = item.suggestion;
        chip.addEventListener("click", () => {
          // Send user request visual bubble
          addMessage("user", item.suggestion);
          
          // Reply with bot response
          triggerBotResponse(item.response);
        });
        chatSuggestions.appendChild(chip);
      });
    };

    const triggerBotResponse = (responseText) => {
      const indicator = showTypingIndicator();
      setTimeout(() => {
        hideTypingIndicator(indicator);
        addMessage("bot", responseText);
      }, 1000 + Math.random() * 500);
    };

    const processUserInput = () => {
      const rawText = chatInput.value.trim();
      if (!rawText) return;

      chatInput.value = "";
      addMessage("user", rawText);

      const text = rawText.toLowerCase();
      let matchedIntent = null;

      // Simple keyword matching
      for (const item of CHAT_KNOWLEDGE) {
        if (item.keywords.some(keyword => text.includes(keyword))) {
          matchedIntent = item;
          break;
        }
      }

      if (matchedIntent) {
        triggerBotResponse(matchedIntent.response);
      } else {
        const fallbackText = "I am not sure I understand that. Please try choosing one of the popular topics below, or rephrase your question about waivers, secretaries, joining, or resources.";
        triggerBotResponse(fallbackText);
      }
    };

    // Toggle Chat Window
    chatbotLauncher.addEventListener("click", () => {
      chatbotWindow.classList.toggle("active");
      if (chatbotWindow.classList.contains("active")) {
        // Clear badge on open
        if (chatbotBadge) {
          chatbotBadge.style.display = "none";
        }
        
        // Focus input
        setTimeout(() => chatInput.focus(), 150);

        // Welcome message
        if (!welcomeSent) {
          welcomeSent = true;
          const welcomeIndicator = showTypingIndicator();
          setTimeout(() => {
            hideTypingIndicator(welcomeIndicator);
            addMessage("bot", "Hello! 👋 I am your SQAT Student Welfare Assistant. How can I help you today?");
            renderSuggestions();
          }, 600);
        }
      }
    });

    // Close Chat Window
    if (chatCloseBtn) {
      chatCloseBtn.addEventListener("click", () => {
        chatbotWindow.classList.remove("active");
      });
    }

    // Input handlers
    if (chatSendBtn) {
      chatSendBtn.addEventListener("click", processUserInput);
    }

    if (chatInput) {
      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          processUserInput();
        }
      });
    }
  }

  // 13. DYNAMIC EVENT TIMELINE & SCROLL-DRAWING LOGIC
  const timelineTarget = document.getElementById("timeline-target");
  const timelineToggleBtns = document.querySelectorAll(".timeline-toggle-btn");
  const timelineScrollPath = document.getElementById("timeline-scroll-path");
  const timelineContainer = document.querySelector(".timeline-container");

  // Event modal references
  const eventModal = document.getElementById("event-modal");
  const eventModalCloseBtn = document.getElementById("event-modal-close-btn");
  const eventModalCloseActionBtn = document.getElementById("event-modal-close-action-btn");
  const eventModalImg = document.getElementById("event-modal-img");
  const eventModalDate = document.getElementById("event-modal-date");
  const eventModalTitle = document.getElementById("event-modal-title");
  const eventModalLoc = document.getElementById("event-modal-loc");
  const eventModalDesc = document.getElementById("event-modal-desc");

  if (timelineTarget) {
    const openEventModal = (act) => {
      if (!eventModal) return;
      eventModalImg.src = act.img;
      eventModalImg.alt = act.title;
      eventModalDate.textContent = act.date;
      eventModalTitle.textContent = act.title;
      eventModalLoc.textContent = act.location;
      eventModalDesc.textContent = act.details;

      eventModal.classList.add("active");
      document.body.style.overflow = "hidden";
    };

    const closeEventModal = () => {
      if (eventModal) {
        eventModal.classList.remove("active");
        document.body.style.overflow = "";
      }
    };

    if (eventModalCloseBtn) eventModalCloseBtn.addEventListener("click", closeEventModal);
    if (eventModalCloseActionBtn) eventModalCloseActionBtn.addEventListener("click", closeEventModal);
    if (eventModal) {
      eventModal.addEventListener("click", (e) => {
        if (e.target === eventModal) closeEventModal();
      });
    }

    const updateTimelineScrollDraw = () => {
      if (!timelineScrollPath || !timelineContainer) return;
      const rect = timelineContainer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      const triggerTop = viewportHeight * 0.75;
      const totalDist = rect.height;
      const currentDist = triggerTop - rect.top;
      
      let progress = currentDist / totalDist;
      progress = Math.max(0, Math.min(1, progress));
      
      const offset = 100 - (progress * 100);
      timelineScrollPath.style.strokeDashoffset = offset;
    };

    const renderTimeline = (type) => {
      timelineTarget.innerHTML = "";
      timelineTarget.className = "timeline-item-wrapper";

      if (!window.SQAT_ACTIVITIES) return;

      const filtered = window.SQAT_ACTIVITIES.filter(act => act.type === type);

      filtered.forEach((act, index) => {
        const item = document.createElement("div");
        const isLeft = index % 2 === 0;
        item.className = `timeline-item ${isLeft ? 'left' : 'right'} reveal`;
        
        item.innerHTML = `
          <div class="timeline-node" data-id="${act.id}"></div>
          <div class="timeline-card glow-card" data-id="${act.id}">
            <div class="timeline-card-img-wrapper">
              <img src="${act.img}" alt="${act.title}" class="timeline-card-img" loading="lazy">
            </div>
            <div class="timeline-card-date">${act.date}</div>
            <h4 class="timeline-card-title">${act.title}</h4>
            <p class="timeline-card-desc">${act.desc}</p>
            <div class="timeline-card-more">
              <i class="fa-solid fa-circle-info"></i> Read Details
            </div>
          </div>
        `;

        const card = item.querySelector(".timeline-card");
        const node = item.querySelector(".timeline-node");
        
        card.addEventListener("click", () => openEventModal(act));
        node.addEventListener("click", () => openEventModal(act));

        timelineTarget.appendChild(item);

        // Observe for scroll reveal animation
        if (typeof revealObserver !== "undefined") {
          revealObserver.observe(item);
        }
      });

      // Update scroll draw path immediately
      updateTimelineScrollDraw();
    };

    // Toggle handler
    timelineToggleBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        timelineToggleBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const type = btn.getAttribute("data-type");
        renderTimeline(type);
      });
    });

    // Window scroll event listener for SVG drawing path
    window.addEventListener("scroll", () => {
      window.requestAnimationFrame(updateTimelineScrollDraw);
    });

    // Initial render
    renderTimeline("past");
    
    // Close modal on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeEventModal();
      }
    });
  }

  // 14. MULTI-STEP FEEDBACK FORM & CONFETTI LOGIC
  const welfareForm = document.getElementById("welfare-form");
  const formSteps = document.querySelectorAll(".form-step-content");
  const progressSteps = document.querySelectorAll(".progress-step");
  const progressLines = document.querySelectorAll(".progress-line");
  const btnPrevStep = document.getElementById("btn-prev-step");
  const btnNextStep = document.getElementById("btn-next-step");
  const btnSubmitForm = document.getElementById("btn-submit-form");
  const formSuccessOverlay = document.getElementById("form-success-overlay");
  const btnResetForm = document.getElementById("btn-reset-form");
  const fileInput = document.getElementById("form-attachment");
  const fileNameDisplay = document.getElementById("file-name-display");

  // Inputs
  const inputName = document.getElementById("student-name");
  const inputId = document.getElementById("student-id");
  const inputEmail = document.getElementById("student-email");
  const selectCategory = document.getElementById("form-category");
  const inputSubject = document.getElementById("form-subject");
  const inputMessage = document.getElementById("form-message");
  const checkboxAgree = document.getElementById("form-agree");

  if (welfareForm) {
    let currentStep = 1;

    const showStep = (step) => {
      formSteps.forEach(el => {
        el.classList.remove("active");
        if (parseInt(el.getAttribute("data-step"), 10) === step) {
          el.classList.add("active");
        }
      });

      // Update progress stepper active state
      progressSteps.forEach(el => {
        const stepNum = parseInt(el.getAttribute("data-step"), 10);
        if (stepNum < step) {
          el.classList.add("completed");
          el.classList.remove("active");
        } else if (stepNum === step) {
          el.classList.add("active");
          el.classList.remove("completed");
        } else {
          el.classList.remove("active", "completed");
        }
      });

      progressLines.forEach(el => {
        const stepNum = parseInt(el.getAttribute("data-step"), 10);
        if (stepNum < step) {
          el.classList.add("completed");
        } else {
          el.classList.remove("completed");
        }
      });

      // Show/Hide navigation buttons
      if (step === 1) {
        btnPrevStep.style.display = "none";
        btnNextStep.style.display = "block";
        btnSubmitForm.style.display = "none";
        btnNextStep.style.width = "100%";
      } else if (step === 2) {
        btnPrevStep.style.display = "block";
        btnNextStep.style.display = "block";
        btnSubmitForm.style.display = "none";
        btnNextStep.style.width = "auto";
        btnNextStep.style.flexGrow = "1";
      } else if (step === 3) {
        btnPrevStep.style.display = "block";
        btnNextStep.style.display = "none";
        btnSubmitForm.style.display = "block";
      }
    };

    const showError = (inputEl, errorId) => {
      const group = inputEl.closest(".form-group");
      if (group) {
        group.classList.add("has-error");
      }
      const errEl = document.getElementById(errorId);
      if (errEl) {
        errEl.style.display = "block";
      }
    };

    const clearError = (inputEl, errorId) => {
      const group = inputEl.closest(".form-group");
      if (group) {
        group.classList.remove("has-error");
      }
      const errEl = document.getElementById(errorId);
      if (errEl) {
        errEl.style.display = "none";
      }
    };

    const validateStep = (step) => {
      let isValid = true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (step === 1) {
        // Name check
        if (!inputName.value.trim()) {
          showError(inputName, "err-student-name");
          isValid = false;
        } else {
          clearError(inputName, "err-student-name");
        }

        // ID check
        if (!inputId.value.trim()) {
          showError(inputId, "err-student-id");
          isValid = false;
        } else {
          clearError(inputId, "err-student-id");
        }

        // Email check
        if (!inputEmail.value.trim() || !emailRegex.test(inputEmail.value.trim())) {
          showError(inputEmail, "err-student-email");
          isValid = false;
        } else {
          clearError(inputEmail, "err-student-email");
        }
      } else if (step === 2) {
        // Category check
        if (!selectCategory.value) {
          showError(selectCategory, "err-form-category");
          isValid = false;
        } else {
          clearError(selectCategory, "err-form-category");
        }

        // Subject check
        if (!inputSubject.value.trim()) {
          showError(inputSubject, "err-form-subject");
          isValid = false;
        } else {
          clearError(inputSubject, "err-form-subject");
        }

        // Message check
        if (!inputMessage.value.trim()) {
          showError(inputMessage, "err-form-message");
          isValid = false;
        } else {
          clearError(inputMessage, "err-form-message");
        }
      } else if (step === 3) {
        // Agreement check
        if (!checkboxAgree.checked) {
          const errEl = document.getElementById("err-form-agree");
          if (errEl) errEl.style.display = "block";
          isValid = false;
        } else {
          const errEl = document.getElementById("err-form-agree");
          if (errEl) errEl.style.display = "none";
        }
      }

      return isValid;
    };

    // Live validation input event listeners to clear errors once user starts typing
    inputName.addEventListener("input", () => clearError(inputName, "err-student-name"));
    inputId.addEventListener("input", () => clearError(inputId, "err-student-id"));
    inputEmail.addEventListener("input", () => clearError(inputEmail, "err-student-email"));
    selectCategory.addEventListener("change", () => clearError(selectCategory, "err-form-category"));
    inputSubject.addEventListener("input", () => clearError(inputSubject, "err-form-subject"));
    inputMessage.addEventListener("input", () => clearError(inputMessage, "err-form-message"));
    checkboxAgree.addEventListener("change", () => {
      const errEl = document.getElementById("err-form-agree");
      if (checkboxAgree.checked && errEl) {
        errEl.style.display = "none";
      }
    });

    // Navigation buttons clicks
    btnNextStep.addEventListener("click", () => {
      if (validateStep(currentStep)) {
        currentStep++;
        showStep(currentStep);
      }
    });

    btnPrevStep.addEventListener("click", () => {
      currentStep--;
      showStep(currentStep);
    });

    // File name display tracker
    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
          const filename = e.target.files[0].name;
          fileNameDisplay.innerHTML = `<i class="fa-solid fa-circle-check"></i> Selected file: <strong>${filename}</strong>`;
        } else {
          fileNameDisplay.innerHTML = "";
        }
      });
    }

    // Canvas Confetti Engine
    let cancelConfetti = null;
    const triggerConfetti = () => {
      const canvas = document.getElementById("confetti-canvas");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      
      const colors = ["#0F5FFF", "#2ECC71", "#FFD700", "#FF4D4D", "#9B59B6", "#1ABC9C"];
      const particles = [];
      const particleCount = 75;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: canvas.width / 2,
          y: canvas.height / 2 - 20,
          r: Math.random() * 5 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.75) * 12 - 3,
          gravity: 0.25,
          fade: Math.random() * 0.012 + 0.005,
          alpha: 1
        });
      }

      let animationId;
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;
        
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.alpha -= p.fade;
          
          if (p.alpha > 0) {
            alive = true;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
          }
        });

        ctx.globalAlpha = 1.0;
        if (alive) {
          animationId = requestAnimationFrame(animate);
        }
      };

      animate();
      cancelConfetti = () => cancelAnimationFrame(animationId);
    };

    // Form Submit (AJAX Formspree Submission)
    welfareForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      if (validateStep(3)) {
        // Change submit button to show loading spinner state
        const submitBtnText = btnSubmitForm.innerHTML;
        btnSubmitForm.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Submitting...`;
        btnSubmitForm.disabled = true;

        // Build FormData
        const formData = new FormData();
        formData.append("Name", inputName.value.trim());
        formData.append("StudentID", inputId.value.trim());
        formData.append("Email", inputEmail.value.trim());
        formData.append("Category", selectCategory.value);
        formData.append("Subject", inputSubject.value.trim());
        formData.append("Message", inputMessage.value.trim());

        if (fileInput.files && fileInput.files[0]) {
          formData.append("Attachment", fileInput.files[0]);
        }

        const endpoint = welfareForm.getAttribute("action") || "https://formspree.io/f/xykaoqvy";
        
        fetch(endpoint, {
          method: "POST",
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        })
        .then(response => {
          btnSubmitForm.innerHTML = submitBtnText;
          btnSubmitForm.disabled = false;
          
          if (response.ok) {
            if (formSuccessOverlay) {
              formSuccessOverlay.classList.add("active");
              triggerConfetti();
            }
          } else {
            alert("Oops! There was a problem submitting your form. Please verify your Formspree settings or try again.");
          }
        })
        .catch(error => {
          btnSubmitForm.innerHTML = submitBtnText;
          btnSubmitForm.disabled = false;
          alert("Network error occurred. Please check your internet connection and try again.");
        });
      }
    });

    // Reset Form
    if (btnResetForm) {
      btnResetForm.addEventListener("click", () => {
        if (cancelConfetti) cancelConfetti();
        
        // Reset inputs
        welfareForm.reset();
        fileNameDisplay.innerHTML = "";
        currentStep = 1;
        showStep(currentStep);

        // Hide errors
        clearError(inputName, "err-student-name");
        clearError(inputId, "err-student-id");
        clearError(inputEmail, "err-student-email");
        clearError(selectCategory, "err-form-category");
        clearError(inputSubject, "err-form-subject");
        clearError(inputMessage, "err-form-message");
        const errAgree = document.getElementById("err-form-agree");
        if (errAgree) errAgree.style.display = "none";

        // Remove overlay
        if (formSuccessOverlay) {
          formSuccessOverlay.classList.remove("active");
        }
      });
    }

    // Initialize Step 1
    showStep(currentStep);
  }

  // 14. ALUMNI SUCCESS STORIES & 3D TESTIMONIALS CAROUSEL
  const testiTrack = document.getElementById("testimonial-track-target");
  const testiIndicators = document.getElementById("testimonial-indicators-target");
  const testiPrevBtn = document.getElementById("testimonial-prev-btn");
  const testiNextBtn = document.getElementById("testimonial-next-btn");
  const testimonialsWrapper = document.querySelector(".testimonials-carousel-wrapper");

  if (testiTrack && window.SQAT_TESTIMONIALS && window.SQAT_TESTIMONIALS.length > 0) {
    const testimonials = window.SQAT_TESTIMONIALS;
    let currentIndex = 0;
    let autoplayTimer = null;
    const autoplayDelay = 5000;

    // A. Render Cards & Dots
    testiTrack.innerHTML = "";
    if (testiIndicators) testiIndicators.innerHTML = "";

    testimonials.forEach((testi, index) => {
      // Create Card
      const card = document.createElement("div");
      card.className = `testimonial-card-3d`;
      card.setAttribute("data-index", index);
      card.innerHTML = `
        <span class="testimonial-tag">${testi.tag}</span>
        <div class="testimonial-quote-icon">“</div>
        <p class="testimonial-quote">"${testi.quote}"</p>
        <div class="testimonial-author-block">
          <div class="testimonial-profile">
            <div class="testimonial-avatar-wrapper">
              <img src="${testi.avatar}" alt="${testi.name}" class="testimonial-avatar" loading="lazy">
            </div>
            <div class="testimonial-meta">
              <h4>${testi.name}</h4>
              <p>${testi.role}</p>
            </div>
          </div>
          <div class="company-chip" style="background-color: ${testi.companyBg || 'var(--primary)'}">
            <i class="fa-solid fa-briefcase" style="font-size: 0.7rem;"></i>
            <span>${testi.company}</span>
          </div>
        </div>
      `;
      testiTrack.appendChild(card);

      // Create Dot
      if (testiIndicators) {
        const dot = document.createElement("span");
        dot.className = "carousel-indicator-dot";
        dot.setAttribute("data-index", index);
        testiIndicators.appendChild(dot);
      }
    });

    const cards = testiTrack.querySelectorAll(".testimonial-card-3d");
    const dots = testiIndicators ? testiIndicators.querySelectorAll(".carousel-indicator-dot") : [];

    // B. Update Layout State
    const updateCarousel = () => {
      cards.forEach((card, index) => {
        card.classList.remove("active", "prev", "next");
        
        let diff = index - currentIndex;
        // Circular math
        if (diff < -Math.floor(testimonials.length / 2)) diff += testimonials.length;
        if (diff > Math.floor(testimonials.length / 2)) diff -= testimonials.length;

        if (diff === 0) {
          card.classList.add("active");
        } else if (diff === -1) {
          card.classList.add("prev");
        } else if (diff === 1) {
          card.classList.add("next");
        }
      });

      // Update dots
      dots.forEach((dot, index) => {
        if (index === currentIndex) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
      
      // Initialize mouse glow coordinates tracker for cards
      const glowCards = testiTrack.querySelectorAll(".testimonial-card-3d");
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

    // C. Controls & Actions
    const goToSlide = (index) => {
      currentIndex = (index + testimonials.length) % testimonials.length;
      updateCarousel();
      resetAutoplay();
    };

    const nextSlide = () => {
      goToSlide(currentIndex + 1);
    };

    const prevSlide = () => {
      goToSlide(currentIndex - 1);
    };

    // D. Bind Event Listeners
    if (testiPrevBtn) testiPrevBtn.addEventListener("click", prevSlide);
    if (testiNextBtn) testiNextBtn.addEventListener("click", nextSlide);

    dots.forEach(dot => {
      dot.addEventListener("click", () => {
        const targetIndex = parseInt(dot.getAttribute("data-index"), 10);
        goToSlide(targetIndex);
      });
    });

    cards.forEach(card => {
      card.addEventListener("click", () => {
        if (card.classList.contains("prev")) {
          prevSlide();
        } else if (card.classList.contains("next")) {
          nextSlide();
        }
      });
    });

    // E. Autoplay Mechanics
    const startAutoplay = () => {
      if (!autoplayTimer) {
        autoplayTimer = setInterval(nextSlide, autoplayDelay);
      }
    };

    const stopAutoplay = () => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    const resetAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    if (testimonialsWrapper) {
      testimonialsWrapper.addEventListener("mouseenter", stopAutoplay);
      testimonialsWrapper.addEventListener("mouseleave", startAutoplay);
    }

    // F. Touch & Drag Swipe Gesture Handling
    let startX = 0;
    let isDragging = false;

    const handleDragStart = (xPos) => {
      startX = xPos;
      isDragging = true;
    };

    const handleDragEnd = (endX) => {
      if (!isDragging) return;
      const deltaX = endX - startX;
      if (deltaX > 60) {
        prevSlide();
      } else if (deltaX < -60) {
        nextSlide();
      }
      isDragging = false;
    };

    // Touch events
    testiTrack.addEventListener("touchstart", (e) => {
      handleDragStart(e.touches[0].clientX);
    }, { passive: true });

    testiTrack.addEventListener("touchend", (e) => {
      handleDragEnd(e.changedTouches[0].clientX);
    }, { passive: true });

    // Mouse drag events
    testiTrack.addEventListener("mousedown", (e) => {
      handleDragStart(e.clientX);
    });

    testiTrack.addEventListener("mouseup", (e) => {
      handleDragEnd(e.clientX);
    });

    // Initial render call
    updateCarousel();
    startAutoplay();
  }

  // 15. SQA INTERACTIVE SKILL ASSESSMENT QUIZ GAME
  const quizStartView = document.getElementById("quiz-start-view");
  const quizPlayView = document.getElementById("quiz-play-view");
  const quizResultView = document.getElementById("quiz-result-view");
  const btnStartQuiz = document.getElementById("btn-start-quiz");
  const btnRestartQuiz = document.getElementById("btn-restart-quiz");
  const btnNextQuestion = document.getElementById("btn-next-question");
  
  const currentQNumSpan = document.getElementById("quiz-current-q-num");
  const totalQNumSpan = document.getElementById("quiz-total-q-num");
  const timerTextSpan = document.getElementById("quiz-timer-text");
  const timerWrapper = document.getElementById("quiz-timer-wrapper");
  const progressBarIndicator = document.getElementById("quiz-progress-indicator");
  const questionTextH3 = document.getElementById("quiz-question-text");
  const optionsWrapper = document.getElementById("quiz-options-wrapper");
  
  const feedbackContainer = document.getElementById("quiz-feedback-container");
  const feedbackStatusStrong = document.getElementById("quiz-feedback-status");
  const feedbackIconSpan = document.getElementById("quiz-feedback-icon-target");
  const feedbackDescTarget = document.getElementById("quiz-feedback-desc-target");
  
  const scorePercentSpan = document.getElementById("quiz-score-percent");
  const scoreRatioSpan = document.getElementById("quiz-score-ratio");
  const resultMessageP = document.getElementById("quiz-result-message");
  const resultBadgeIcon = document.getElementById("quiz-result-badge-icon");
  const reviewListTarget = document.getElementById("quiz-review-list-target");

  if (quizStartView && window.SQAT_QUIZ_QUESTIONS && window.SQAT_QUIZ_QUESTIONS.length > 0) {
    const questions = window.SQAT_QUIZ_QUESTIONS;
    let currentQuestionIndex = 0;
    let score = 0;
    let timeLeft = 15;
    let timerInterval = null;
    let selectedOption = null;
    let userAnswers = []; // Records { correct: boolean, chosenOption: number, timeout: boolean }

    // --- Native Web Audio Synthesis Module ---
    let audioCtx = null;
    const initAudio = () => {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    };

    const playQuizSound = (type) => {
      try {
        initAudio();
        if (!audioCtx) return;
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        const now = audioCtx.currentTime;

        if (type === 'click') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(650, now);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
        } else if (type === 'correct') {
          // Play a C major chord C4 - E4 - G4
          const playNote = (freq, delay, dur) => {
            const o = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            o.connect(g);
            g.connect(audioCtx.destination);
            o.type = 'triangle';
            o.frequency.setValueAtTime(freq, now + delay);
            g.gain.setValueAtTime(0.06, now + delay);
            g.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);
            o.start(now + delay);
            o.stop(now + delay + dur);
          };
          playNote(261.63, 0, 0.18); // C4
          playNote(329.63, 0.04, 0.22); // E4
          playNote(392.00, 0.08, 0.3); // G4
        } else if (type === 'incorrect') {
          // Play a low dissonant buzz
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(160, now);
          osc.frequency.linearRampToValueAtTime(140, now + 0.35);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.start(now);
          osc.stop(now + 0.35);
        } else if (type === 'tick') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1000, now);
          gain.gain.setValueAtTime(0.015, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.start(now);
          osc.stop(now + 0.04);
        } else if (type === 'victory') {
          // Melodic victory sequence
          const playNote = (freq, delay, dur) => {
            const o = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            o.connect(g);
            g.connect(audioCtx.destination);
            o.type = 'sine';
            o.frequency.setValueAtTime(freq, now + delay);
            g.gain.setValueAtTime(0.06, now + delay);
            g.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);
            o.start(now + delay);
            o.stop(now + delay + dur);
          };
          playNote(261.63, 0, 0.12); // C4
          playNote(329.63, 0.12, 0.12); // E4
          playNote(392.00, 0.24, 0.12); // G4
          playNote(523.25, 0.36, 0.45); // C5
        } else if (type === 'defeat') {
          // Descending sad minor chord
          const playNote = (freq, delay, dur) => {
            const o = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            o.connect(g);
            g.connect(audioCtx.destination);
            o.type = 'sine';
            o.frequency.setValueAtTime(freq, now + delay);
            g.gain.setValueAtTime(0.05, now + delay);
            g.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);
            o.start(now + delay);
            o.stop(now + delay + dur);
          };
          playNote(220.00, 0, 0.22); // A3
          playNote(196.00, 0.18, 0.22); // G3
          playNote(174.61, 0.36, 0.45); // F3
        }
      } catch (err) {
        console.warn("Web Audio API disabled or blocked: ", err);
      }
    };

    // --- Dynamic Confetti Sprayer ---
    const triggerQuizConfetti = () => {
      let canvas = document.getElementById("quiz-confetti-canvas");
      if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "quiz-confetti-canvas";
        canvas.style.position = "absolute";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.pointerEvents = "none";
        canvas.style.zIndex = "5";
        
        const mainCard = document.getElementById("quiz-main-card");
        if (mainCard) {
          mainCard.style.position = "relative";
          mainCard.appendChild(canvas);
        }
      }

      const ctx = canvas.getContext("2d");
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;

      const colors = ["#0F5FFF", "#2ECC71", "#FFD700", "#FF4D4D", "#9B59B6", "#1ABC9C"];
      const particles = [];
      const particleCount = 90;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: canvas.width / 2,
          y: canvas.height / 2 - 20,
          r: Math.random() * 5 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 12,
          vy: (Math.random() - 0.8) * 14 - 3,
          gravity: 0.28,
          fade: Math.random() * 0.01 + 0.006,
          alpha: 1
        });
      }

      let animationId;
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;

        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.alpha -= p.fade;

          if (p.alpha > 0) {
            alive = true;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
          }
        });

        ctx.globalAlpha = 1.0;
        if (alive) {
          animationId = requestAnimationFrame(animate);
        } else {
          canvas.remove();
        }
      };
      animate();
    };

    // --- State Game Loop Functions ---
    const startQuiz = () => {
      initAudio();
      playQuizSound('click');
      
      currentQuestionIndex = 0;
      score = 0;
      userAnswers = [];
      
      if (totalQNumSpan) totalQNumSpan.textContent = questions.length;
      
      quizStartView.style.display = "none";
      if (quizResultView) quizResultView.style.display = "none";
      quizPlayView.style.display = "block";
      
      loadQuestion();
    };

    const loadQuestion = () => {
      // Clear active timers
      if (timerInterval) clearInterval(timerInterval);
      selectedOption = null;
      
      const q = questions[currentQuestionIndex];
      
      // Update trackers
      if (currentQNumSpan) currentQNumSpan.textContent = currentQuestionIndex + 1;
      if (progressBarIndicator) {
        const percent = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressBarIndicator.style.width = percent + "%";
      }
      
      // Load question text
      if (questionTextH3) questionTextH3.textContent = q.question;
      
      // Load option buttons
      if (optionsWrapper) {
        optionsWrapper.innerHTML = "";
        q.options.forEach((opt, index) => {
          const button = document.createElement("button");
          button.className = "option-btn";
          button.type = "button";
          button.innerHTML = `
            <span>${opt}</span>
            <span class="option-icon-indicator"></span>
          `;
          button.addEventListener("click", () => selectOption(index));
          optionsWrapper.appendChild(button);
        });
      }
      
      // Reset layout details
      if (feedbackContainer) feedbackContainer.style.display = "none";
      if (btnNextQuestion) btnNextQuestion.style.display = "none";
      if (timerWrapper) timerWrapper.classList.remove("warning");
      
      // Start Countdown Timer (15 seconds)
      timeLeft = 15;
      if (timerTextSpan) timerTextSpan.textContent = timeLeft + "s";
      
      timerInterval = setInterval(() => {
        timeLeft--;
        if (timerTextSpan) timerTextSpan.textContent = timeLeft + "s";
        
        if (timeLeft <= 5) {
          if (timerWrapper) timerWrapper.classList.add("warning");
          playQuizSound('tick');
        }
        
        if (timeLeft <= 0) {
          handleTimeout();
        }
      }, 1000);
    };

    const selectOption = (optIdx) => {
      if (selectedOption !== null) return; // Ignore multiple click inputs
      if (timerInterval) clearInterval(timerInterval);
      
      selectedOption = optIdx;
      const q = questions[currentQuestionIndex];
      const buttons = optionsWrapper.querySelectorAll(".option-btn");
      
      buttons.forEach(btn => btn.disabled = true);
      
      const isCorrect = (optIdx === q.correct);
      
      // Style picked button
      const selectedBtn = buttons[optIdx];
      if (isCorrect) {
        score++;
        selectedBtn.classList.add("correct");
        selectedBtn.querySelector(".option-icon-indicator").innerHTML = `<i class="fa-solid fa-circle-check"></i>`;
        playQuizSound('correct');
      } else {
        selectedBtn.classList.add("incorrect");
        selectedBtn.querySelector(".option-icon-indicator").innerHTML = `<i class="fa-solid fa-circle-xmark"></i>`;
        playQuizSound('incorrect');
        
        // Show correct button outline
        const correctBtn = buttons[q.correct];
        correctBtn.classList.add("correct");
        correctBtn.querySelector(".option-icon-indicator").innerHTML = `<i class="fa-solid fa-circle-check"></i>`;
      }
      
      // Record answer logs
      userAnswers.push({
        correct: isCorrect,
        chosenOption: optIdx,
        timeout: false
      });
      
      // Show feedback box
      showFeedback(isCorrect, q.explanation);
    };

    const handleTimeout = () => {
      if (timerInterval) clearInterval(timerInterval);
      selectedOption = -1; // Flag represents timeout
      
      const q = questions[currentQuestionIndex];
      const buttons = optionsWrapper.querySelectorAll(".option-btn");
      buttons.forEach(btn => btn.disabled = true);
      
      // Highlight the correct answer
      const correctBtn = buttons[q.correct];
      correctBtn.classList.add("correct");
      correctBtn.querySelector(".option-icon-indicator").innerHTML = `<i class="fa-solid fa-circle-check"></i>`;
      
      playQuizSound('incorrect');
      
      userAnswers.push({
        correct: false,
        chosenOption: null,
        timeout: true
      });
      
      showFeedback(false, `Time ran out! ${q.explanation}`, true);
    };

    const showFeedback = (isCorrect, explanation, isTimeout = false) => {
      if (!feedbackContainer) return;
      
      if (feedbackStatusStrong) {
        if (isTimeout) {
          feedbackStatusStrong.textContent = "Time Out!";
          feedbackStatusStrong.className = "quiz-feedback-header incorrect";
          if (feedbackIconSpan) feedbackIconSpan.innerHTML = `<i class="fa-regular fa-clock"></i>`;
        } else if (isCorrect) {
          feedbackStatusStrong.textContent = "Correct!";
          feedbackStatusStrong.className = "quiz-feedback-header correct";
          if (feedbackIconSpan) feedbackIconSpan.innerHTML = `<i class="fa-solid fa-circle-check"></i>`;
        } else {
          feedbackStatusStrong.textContent = "Incorrect!";
          feedbackStatusStrong.className = "quiz-feedback-header incorrect";
          if (feedbackIconSpan) feedbackIconSpan.innerHTML = `<i class="fa-solid fa-circle-xmark"></i>`;
        }
      }
      
      if (feedbackDescTarget) {
        feedbackDescTarget.textContent = explanation;
      }
      
      feedbackContainer.style.display = "block";
      if (btnNextQuestion) {
        if (currentQuestionIndex === questions.length - 1) {
          btnNextQuestion.innerHTML = `Finish Challenge <i class="fa-solid fa-flag-checkered" style="margin-left: 8px;"></i>`;
        } else {
          btnNextQuestion.innerHTML = `Next Question <i class="fa-solid fa-chevron-right" style="margin-left: 8px;"></i>`;
        }
        btnNextQuestion.style.display = "flex";
      }
    };

    const nextQuestion = () => {
      playQuizSound('click');
      currentQuestionIndex++;
      
      if (currentQuestionIndex < questions.length) {
        loadQuestion();
      } else {
        showResults();
      }
    };

    const showResults = () => {
      quizPlayView.style.display = "none";
      if (quizResultView) quizResultView.style.display = "block";
      
      const percentage = Math.round((score / questions.length) * 100);
      
      if (scorePercentSpan) scorePercentSpan.textContent = percentage + "%";
      if (scoreRatioSpan) scoreRatioSpan.textContent = `${score} / ${questions.length}`;
      
      const passed = percentage >= 80;
      
      if (resultBadgeIcon) {
        resultBadgeIcon.className = "result-badge-icon " + (passed ? "pass" : "fail");
        resultBadgeIcon.innerHTML = passed ? `<i class="fa-solid fa-trophy"></i>` : `<i class="fa-solid fa-triangle-exclamation"></i>`;
      }
      
      if (resultMessageP) {
        if (passed) {
          resultMessageP.innerHTML = `<strong>Congratulations!</strong> You successfully passed the challenge and demonstrated high SQA competence. You have unlocked the <strong>Certified SQA Candidate</strong> badge!`;
          playQuizSound('victory');
          triggerQuizConfetti();
        } else {
          resultMessageP.innerHTML = `You scored <strong>${percentage}%</strong>. A minimum score of <strong>80%</strong> is required to pass. Read guides in the Study Vault and try again!`;
          playQuizSound('defeat');
        }
      }
      
      // Populate review checklist target
      if (reviewListTarget) {
        reviewListTarget.innerHTML = "";
        
        questions.forEach((q, index) => {
          const ans = userAnswers[index];
          const reviewItem = document.createElement("div");
          reviewItem.className = "review-item";
          
          let headerClass = ans.correct ? "correct" : "incorrect";
          let headerIcon = ans.correct ? `<i class="fa-solid fa-circle-check"></i>` : `<i class="fa-solid fa-circle-xmark"></i>`;
          let userChoiceText = "";
          
          if (ans.timeout) {
            userChoiceText = "(Time Out)";
          } else {
            userChoiceText = `(Your Answer: ${q.options[ans.chosenOption]})`;
          }
          
          reviewItem.innerHTML = `
            <div class="review-q-header ${headerClass}">
              ${headerIcon}
              <span>Question ${index + 1}: ${q.question} ${ans.correct ? "" : userChoiceText}</span>
            </div>
            <div class="review-q-explanation">
              <strong>Answer:</strong> ${q.options[q.correct]}<br>
              <strong>Explanation:</strong> ${q.explanation}
            </div>
          `;
          reviewListTarget.appendChild(reviewItem);
        });
      }
    };

    // --- Bind Actions Events ---
    if (btnStartQuiz) btnStartQuiz.addEventListener("click", startQuiz);
    if (btnRestartQuiz) btnRestartQuiz.addEventListener("click", startQuiz);
    if (btnNextQuestion) btnNextQuestion.addEventListener("click", nextQuestion);
  }

  // 16. DYNAMIC ACHIEVEMENTS RENDERING & LIGHTBOX INTEGRATION
  const achievementsClubTarget = document.getElementById("achievements-club-target");
  const achievementsWingTarget = document.getElementById("achievements-wing-target");

  const renderAchievements = () => {
    if (!window.SQAT_ACHIEVEMENTS) return;

    const clubAchievements = window.SQAT_ACHIEVEMENTS.filter(ach => ach.type === "club");
    const wingAchievements = window.SQAT_ACHIEVEMENTS.filter(ach => ach.type === "wing");

    const renderGrid = (items, targetEl) => {
      if (!targetEl) return;
      targetEl.innerHTML = "";

      items.forEach(ach => {
        const card = document.createElement("div");
        card.className = "achievement-card glow-card reveal visible";
        card.innerHTML = `
          <!-- Temporary removed image wrapper as requested -->
          <!--
          <div class="achievement-image-wrapper">
            <img src="${ach.image}" alt="${ach.name}" class="achievement-img" loading="lazy">
            <div class="achievement-badge" title="${ach.tag}">
              <i class="${ach.icon}"></i>
            </div>
          </div>
          -->
          <span class="achievement-tag">${ach.tag}</span>
          <h4 class="achievement-name">${ach.name}</h4>
          <div class="achievement-role">${ach.role}</div>
          <div class="achievement-title-award">${ach.title}</div>
          <p class="achievement-desc">${ach.desc}</p>
        `;

        // Click handler to open the global image lightbox
        const img = card.querySelector(".achievement-img");
        if (img) {
          img.addEventListener("click", () => {
            if (typeof openImageLightbox === "function") {
              openImageLightbox(ach.image, ach.name, `${ach.name} - ${ach.title} (${ach.desc})`);
            }
          });
        }

        targetEl.appendChild(card);
      });
    };

    renderGrid(clubAchievements, achievementsClubTarget);
    renderGrid(wingAchievements, achievementsWingTarget);
    
    // Reinitialize coordinate tracking for cards
    if (typeof initCardGlowEvents === "function") {
      initCardGlowEvents();
    }
  };

  // Trigger achievements rendering
  renderAchievements();
});





