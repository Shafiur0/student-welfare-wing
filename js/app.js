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
    themeToggleBtn.addEventListener("click", (e) => {
      // Trigger canvas sparkle effect
      let x = e.clientX;
      let y = e.clientY;
      if (!x || !y) {
        const rect = themeToggleBtn.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }
      triggerSparkles(x, y);

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
      card.className = "folder-card glow-card reveal visible"; // Render as digital folders
      card.innerHTML = `
        <div class="contact-icon" style="margin-bottom: 16px; width: 56px; height: 56px; border-radius: var(--radius-md); font-size: 1.5rem; background-color: var(--border-subtle); color: var(--primary); display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease;"><i class="${res.icon}"></i></div>
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
        // Play smooth folder opening animation
        card.style.transform = "scale(1.06) translateY(-6px)";
        card.style.transition = "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)";
        const icon = card.querySelector(".contact-icon");
        if (icon) {
          icon.style.transform = "rotate(-10deg) scale(1.12)";
        }
        
        setTimeout(() => {
          openResourceModal(res);
          // Reset styles
          card.style.transform = "";
          if (icon) icon.style.transform = "";
        }, 300);
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
        id: "secretary",
        suggestion: "Executive Leadership",
        keywords: ["secretary", "secretaries", "president", "vp", "vice president", "general secretary", "joint secretary", "liza", "shafim", "biva", "seam", "contact", "facebook", "whatsapp", "linkedin", "officers", "board", "executive"],
        response: "<strong>SQAT Club Executive Leadership & Secretaries Contact Info:</strong><br><br>👑 <strong>President:</strong> Biva Mohosina<br><a href='https://www.facebook.com/biva.mohosina/' target='_blank' rel='noopener'><i class='fa-brands fa-facebook'></i> Facebook</a><br><br>⭐ <strong>Vice Presidents:</strong><br>• Muhammad Tanvir Ahmed<br>• S. M. Hasib Hasnain<br><br>📝 <strong>General Secretary:</strong> Seam Ahmed<br><a href='https://www.facebook.com/seam.ahmed.928298' target='_blank' rel='noopener'><i class='fa-brands fa-facebook'></i> Facebook</a><br><br>🤝 <strong>Joint Secretaries:</strong><br>• B. M. Abir Hassan (<a href='https://www.facebook.com/bmabir02z' target='_blank' rel='noopener'><i class='fa-brands fa-facebook'></i> Facebook</a>)<br>• Imrul Kayes Riaz<br><br>💙 <strong>Student Welfare Secretary:</strong> Liza Akter<br><a href='https://www.facebook.com/Lizaaaaaa85' target='_blank' rel='noopener'><i class='fa-brands fa-facebook'></i> Facebook</a><br><br>🚀 <strong>Deputy Secretary:</strong> Shafiur Rahman Shafim<br><a href='https://www.facebook.com/shafiurrahaman.shafim' target='_blank' rel='noopener'><i class='fa-brands fa-facebook'></i> Facebook</a> | <a href='https://www.linkedin.com/in/shafiur-rahman-shafim/' target='_blank' rel='noopener'><i class='fa-brands fa-linkedin'></i> LinkedIn</a><br><br><em>Explore the Executive Leadership & Secretarial sections on this page for complete profile cards!</em>"
      },
      {
        id: "join",
        suggestion: "Join SQAT Club",
        keywords: ["join", "membership", "apply", "recruit", "registration", "member", "sqat", "form", "google form"],
        response: "SQAT Club membership recruitment opens at the start of each semester! Keep an eye on campus announcements or fill out the pre-registration inquiry on our <a href='https://forms.gle/sqatClubRecruitment' target='_blank' rel='noopener'>Official Recruitment Google Form</a>."
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
      CHAT_KNOWLEDGE.forEach((item, index) => {
        const chip = document.createElement("button");
        chip.className = "chat-chip";
        chip.textContent = item.suggestion;
        // Stagger chip animations
        chip.style.animationDelay = `${index * 0.08}s`;
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
      
      // Animate bot avatar with fast-bobbing micro-expression
      const botAvatar = document.querySelector(".chat-bot-avatar i");
      if (botAvatar) {
        botAvatar.style.animation = "avatarBob 0.6s ease-in-out infinite alternate";
      }
      
      setTimeout(() => {
        hideTypingIndicator(indicator);
        addMessage("bot", responseText);
        
        // Reset avatar animation
        if (botAvatar) {
          botAvatar.style.animation = "avatarBob 2s ease-in-out infinite alternate";
          // Quick happy expression
          botAvatar.style.transform = "scale(1.2) rotate(5deg)";
          setTimeout(() => {
            botAvatar.style.transform = "";
          }, 300);
        }
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
        const fallbackText = "I am not sure I understand that. Please try choosing one of the popular topics below, or rephrase your question about leadership/secretaries, joining SQAT Club, or study resources.";
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
            addMessage("bot", "Hello! 👋 I am your SQAT Club AI Assistant. How can I help you today?");
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

  const renderAchievements = () => {
    if (!window.SQAT_ACHIEVEMENTS) return;

    const clubAchievements = window.SQAT_ACHIEVEMENTS.filter(ach => ach.type === "club");

    const renderGrid = (items, targetEl) => {
      if (!targetEl) return;
      targetEl.innerHTML = "";

      items.forEach(ach => {
        const card = document.createElement("div");
        card.className = "achievement-card glow-card reveal visible";
        
        let imgHtml = "";
        if (ach.image) {
          if (ach.link) {
            imgHtml = `
              <a href="${ach.link}" target="_blank" rel="noopener noreferrer" class="achievement-img-link" title="Click to view post on Facebook">
                <div class="achievement-img-container">
                  <img src="${ach.image}" alt="${ach.title}" class="achievement-img" />
                  <div class="achievement-img-overlay">
                    <i class="fa-brands fa-facebook"></i>
                    <span>View Post</span>
                  </div>
                </div>
              </a>
            `;
          } else {
            imgHtml = `
              <div class="achievement-img-container achievement-lightbox-trigger" data-src="${ach.image}" data-title="${ach.title}">
                <img src="${ach.image}" alt="${ach.title}" class="achievement-img" />
              </div>
            `;
          }
        }

        let linkBtnHtml = "";
        if (ach.link) {
          linkBtnHtml = `
            <a href="${ach.link}" target="_blank" rel="noopener noreferrer" class="achievement-post-link">
              <i class="fa-brands fa-facebook"></i> View Official Post
            </a>
          `;
        }

        card.innerHTML = `
          <span class="achievement-tag">${ach.tag}</span>
          <h4 class="achievement-name">${ach.name}</h4>
          <div class="achievement-role">${ach.role}</div>
          <div class="achievement-title-award">${ach.title}</div>
          ${imgHtml}
          <p class="achievement-desc">${ach.desc}</p>
          ${linkBtnHtml}
        `;

        targetEl.appendChild(card);
      });
    };

    renderGrid(clubAchievements, achievementsClubTarget);
    
    // Reinitialize coordinate tracking for cards
    if (typeof initCardGlowEvents === "function") {
      initCardGlowEvents();
    }
  };

  // Trigger achievements rendering
  renderAchievements();

  // Sparkle particle emitter effect for theme toggle
  const triggerSparkles = (x, y) => {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "99999";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ["#FFD700", "#FFFFFF", "#0F5FFF", "#2ECC71", "#FF8C00", "#FFC0CB"];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: x,
        y: y,
        r: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        gravity: 0.15,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          active = true;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
        }
      });

      if (active) {
        requestAnimationFrame(animate);
      } else {
        canvas.remove();
      }
    };
    animate();
  };

  // 17. SQA "TIP OF THE DAY" SHUFFLE CARD
  const sqaTips = [
    "Equivalence partitioning helps you reduce the number of test cases while maintaining high test coverage.",
    "Always document 'steps to reproduce' clearly in bug reports to help developers debug and fix the issue faster.",
    "Automated tests should be independent, repeatable, and run without requiring manual intervention.",
    "Boundary Value Analysis (BVA) is critical because software errors occur most frequently at the boundaries of input ranges.",
    "A bug found during the requirements design phase is 100 times cheaper to fix than a bug found in production.",
    "Regression testing ensures that code modifications do not introduce new bugs into existing functional areas.",
    "Write clear expected results for every test case. Undefined expectations lead to false test passes.",
    "Performance testing is not just about load; always monitor server CPU, memory, and database responsiveness.",
    "Exploratory testing relies on the tester's intuition, experience, and creativity to find hidden defects.",
    "Code reviews are a form of static testing that help catch bugs before the code is ever compiled or run."
  ];

  const sqaTipContent = document.getElementById("sqa-tip-content");
  const btnShuffleTip = document.getElementById("btn-shuffle-tip");

  const displayRandomTip = () => {
    if (!sqaTipContent) return;
    const currentTip = sqaTipContent.textContent.trim();
    let randomTip = currentTip;
    
    while (randomTip === currentTip && sqaTips.length > 1) {
      randomTip = sqaTips[Math.floor(Math.random() * sqaTips.length)];
    }
    
    sqaTipContent.style.opacity = "0";
    setTimeout(() => {
      sqaTipContent.textContent = randomTip;
      sqaTipContent.style.opacity = "1";
    }, 200);
  };

  if (sqaTipContent) {
    sqaTipContent.style.transition = "opacity 0.2s ease-in-out";
    displayRandomTip();
  }

  if (btnShuffleTip) {
    btnShuffleTip.addEventListener("click", displayRandomTip);
  }

  // 19. HERO SECTION TYPEWRITER/TYPING EFFECT
  const typingTarget = document.getElementById("hero-typing-target");
  if (typingTarget) {
    const words = ["SQAT Club DIU", "Software Testing & SQA", "Empowering Students", "Technical Excellence", "Student Welfare & Support"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const type = () => {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        typingTarget.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingTarget.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }
      
      let typeSpeed = isDeleting ? 40 : 80;
      
      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // Wait at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500; // Pause before typing next
      }
      
      setTimeout(type, typeSpeed);
    };
    setTimeout(type, 1000);
  }

  // 20. WELFARE MOOD & STRESS CHECK-IN WIDGET
  const moodBtns = document.querySelectorAll(".mood-btn");
  const moodResponseText = document.getElementById("mood-response-text");

  const moodResponses = {
    good: "Fantastic! Keep spreading the positive energy. Share some good vibes on our Wall of Gratitude below!",
    stressed: "Take a deep breath. You are not alone. Check out the Study Vault in the Resources section for cheatsheets to save you study time!",
    tired: "Rest is just as important as studying. Hydrate, take a 10-minute break, or set a Pomodoro timer in the Study Vault to pace yourself.",
    help: "We've got your back. Drop a message using the Contact Form at the bottom, and a welfare coordinator will reach out to you."
  };

  moodBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Bounce animation on click
      btn.style.transform = "scale(1.3)";
      setTimeout(() => btn.style.transform = "", 200);

      const mood = btn.getAttribute("data-mood");
      if (moodResponseText && moodResponses[mood]) {
        moodResponseText.style.opacity = "0";
        setTimeout(() => {
          moodResponseText.innerHTML = moodResponses[mood];
          moodResponseText.style.opacity = "1";
        }, 150);
      }
    });
  });

  if (moodResponseText) {
    moodResponseText.style.transition = "opacity 0.2s ease-in-out";
  }

  // 21. SQA FOCUS POMODORO TIMER
  const pomoDisplay = document.getElementById("pomo-timer-display");
  const btnPomoStart = document.getElementById("btn-pomo-start");
  const btnPomoReset = document.getElementById("btn-pomo-reset");

  let pomoTimeLeft = 25 * 60; // 25 minutes
  let pomoInterval = null;
  let pomoRunning = false;

  const updatePomoDisplay = () => {
    if (!pomoDisplay) return;
    const mins = Math.floor(pomoTimeLeft / 60);
    const secs = pomoTimeLeft % 60;
    pomoDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (btnPomoStart) {
    btnPomoStart.addEventListener("click", () => {
      if (pomoRunning) {
        // Pause
        clearInterval(pomoInterval);
        pomoRunning = false;
        btnPomoStart.innerHTML = `<i class="fa-solid fa-play"></i> Start`;
      } else {
        // Start
        pomoRunning = true;
        btnPomoStart.innerHTML = `<i class="fa-solid fa-pause"></i> Pause`;
        pomoInterval = setInterval(() => {
          if (pomoTimeLeft > 0) {
            pomoTimeLeft--;
            updatePomoDisplay();
          } else {
            clearInterval(pomoInterval);
            pomoRunning = false;
            btnPomoStart.innerHTML = `<i class="fa-solid fa-play"></i> Start`;
            alert("Focus session finished! Time for a short break.");
            pomoTimeLeft = 5 * 60; // Set to 5 min break
            updatePomoDisplay();
          }
        }, 1000);
      }
    });
  }

  if (btnPomoReset) {
    btnPomoReset.addEventListener("click", () => {
      clearInterval(pomoInterval);
      pomoRunning = false;
      pomoTimeLeft = 25 * 60;
      if (btnPomoStart) btnPomoStart.innerHTML = `<i class="fa-solid fa-play"></i> Start`;
      updatePomoDisplay();
    });
  }

  // 22. WELFARE WALL OF GRATITUDE
  const gratitudeInput = document.getElementById("gratitude-input");
  const btnPostGratitude = document.getElementById("btn-post-gratitude");
  const gratitudeNotesGrid = document.getElementById("gratitude-notes-grid");

  let gratitudeNotes = JSON.parse(localStorage.getItem("gratitude_notes")) || [
    { text: "Thanks to Liza for helping me with the waiver verification process!", color: "#FFF9A6" },
    { text: "Shoutout to cortex crew for the IEEE project showcase runner-up win!", color: "#A6FFEA" },
    { text: "Grateful for the exam prep circles organized by our welfare wing mentors.", color: "#FFA6C9" }
  ];

  const noteColors = ["#FFF9A6", "#A6FFEA", "#FFA6C9", "#A6C5FF", "#D7A6FF", "#FFA6A6"];

  const renderGratitudeNotes = () => {
    if (!gratitudeNotesGrid) return;
    gratitudeNotesGrid.innerHTML = "";
    gratitudeNotes.slice(-6).reverse().forEach(note => {
      const noteEl = document.createElement("div");
      noteEl.className = "glow-card reveal visible";
      noteEl.style.padding = "18px";
      noteEl.style.borderRadius = "var(--radius-md)";
      noteEl.style.border = `1px solid var(--border-glass)`;
      noteEl.style.color = "#111"; // Keep text dark for post-it note readability
      noteEl.style.backgroundColor = note.color;
      noteEl.style.fontSize = "0.85rem";
      noteEl.style.lineHeight = "1.5";
      noteEl.style.boxShadow = "var(--shadow-sm)";
      noteEl.style.minHeight = "100px";
      noteEl.style.display = "flex";
      noteEl.style.alignItems = "center";
      noteEl.style.justifyContent = "center";
      noteEl.style.textAlign = "center";
      noteEl.style.fontWeight = "500";
      noteEl.textContent = `"${note.text}"`;
      gratitudeNotesGrid.appendChild(noteEl);
    });
  };

  if (btnPostGratitude && gratitudeInput) {
    btnPostGratitude.addEventListener("click", () => {
      const val = gratitudeInput.value.trim();
      if (!val) return;
      
      const newNote = {
        text: val,
        color: noteColors[Math.floor(Math.random() * noteColors.length)]
      };
      
      gratitudeNotes.push(newNote);
      localStorage.setItem("gratitude_notes", JSON.stringify(gratitudeNotes));
      gratitudeInput.value = "";
      renderGratitudeNotes();
    });
  }

  renderGratitudeNotes();



  // 24. CUSTOM INTERACTIVE CURSOR AURA & GLOW TRAIL
  const cursorAura = document.getElementById("custom-cursor");
  const cursorDot = document.getElementById("custom-cursor-dot");
  
  if (cursorAura && cursorDot) {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches;
    
    if (!isTouchDevice && window.innerWidth > 768) {
      cursorAura.style.display = "block";
      cursorDot.style.display = "block";
      
      let mouseX = 0, mouseY = 0;
      let auraX = 0, auraY = 0;
      let dotX = 0, dotY = 0;
      let hoverTarget = null;
      
      document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });
      
      document.addEventListener("mouseover", (e) => {
        const target = e.target.closest("a, button, .btn, .mood-btn, .chat-chip, .social-btn, #theme-toggle-btn, .timeline-node");
        if (target) {
          hoverTarget = target;
        }
      });
      
      document.addEventListener("mouseout", (e) => {
        const target = e.target.closest("a, button, .btn, .mood-btn, .chat-chip, .social-btn, #theme-toggle-btn, .timeline-node");
        if (target && target === hoverTarget) {
          hoverTarget = null;
        }
      });
      
      // Cursor aura update loop
      const updateCursor = () => {
        let targetX = mouseX;
        let targetY = mouseY;
        
        if (hoverTarget) {
          const rect = hoverTarget.getBoundingClientRect();
          const elemX = rect.left + rect.width / 2;
          const elemY = rect.top + rect.height / 2;
          // Magnet pull (35% snap towards center of the hovered element)
          targetX = mouseX + (elemX - mouseX) * 0.35;
          targetY = mouseY + (elemY - mouseY) * 0.35;
        }
        
        // Easing interpolation (lerp)
        auraX += (targetX - auraX) * 0.15;
        auraY += (targetY - auraY) * 0.15;
        cursorAura.style.left = `${auraX}px`;
        cursorAura.style.top = `${auraY}px`;
        
        dotX += (mouseX - dotX) * 0.35;
        dotY += (mouseY - dotY) * 0.35;
        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;
        
        requestAnimationFrame(updateCursor);
      };
      
      updateCursor();
      
      // Expansion hover listener
      const addCursorHover = () => cursorAura.classList.add("cursor-hover");
      const removeCursorHover = () => cursorAura.classList.remove("cursor-hover");
      
      const updateHoverListeners = () => {
        const targets = document.querySelectorAll("a, button, input[type='button'], input[type='submit'], input[type='range'], select, textarea, .btn, .glow-card, .board-card, .folder-card, .gallery-item, .mood-btn, .timeline-node, .timeline-card, .stat-card, .chat-chip, .gallery-tab");
        targets.forEach(t => {
          t.removeEventListener("mouseenter", addCursorHover);
          t.removeEventListener("mouseleave", removeCursorHover);
          t.addEventListener("mouseenter", addCursorHover);
          t.addEventListener("mouseleave", removeCursorHover);
        });
      };
      
      updateHoverListeners();
      // Periodically refresh list of hover elements to support dynamic elements
      setInterval(updateHoverListeners, 1500);
    }
  }

  // 25. INTERACTIVE PARALLAX MESH CANVAS BACKGROUND
  const meshCanvas = document.getElementById("mesh-canvas");
  if (meshCanvas) {
    const ctx = meshCanvas.getContext("2d");
    let particles = [];
    const particleCount = 65;
    const connectionDistance = 120;
    
    let windowMouseX = window.innerWidth / 2;
    let windowMouseY = window.innerHeight / 2;
    let targetMouseX = window.innerWidth / 2;
    let targetMouseY = window.innerHeight / 2;
    
    window.addEventListener("mousemove", (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    });
    
    const resizeCanvas = () => {
      meshCanvas.width = window.innerWidth;
      meshCanvas.height = window.innerHeight;
      initParticles();
    };
    
    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * meshCanvas.width,
          y: Math.random() * meshCanvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2 + 1.2,
          depth: Math.random() * 0.08 + 0.02, // Depth layers for parallax shifting
          opacity: Math.random() * 0.35 + 0.15
        });
      }
    };
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    
    const animateMesh = () => {
      // Ease mouse updates
      windowMouseX += (targetMouseX - windowMouseX) * 0.05;
      windowMouseY += (targetMouseY - windowMouseY) * 0.05;
      
      ctx.clearRect(0, 0, meshCanvas.width, meshCanvas.height);
      
      // Determine theme colors dynamically
      const theme = document.documentElement.getAttribute("data-theme") || "light";
      let particleColor;
      if (theme === "dark") {
        particleColor = "rgba(56, 189, 248, 0.4)";
      } else {
        particleColor = "rgba(15, 95, 255, 0.25)";
      }
      
      const offsetX = (windowMouseX - meshCanvas.width / 2);
      const offsetY = (windowMouseY - meshCanvas.height / 2);
      
      // Compute positions
      const coords = particles.map(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        // Wrap edges
        if (p.x < 0) p.x = meshCanvas.width;
        if (p.x > meshCanvas.width) p.x = 0;
        if (p.y < 0) p.y = meshCanvas.height;
        if (p.y > meshCanvas.height) p.y = 0;
        
        // Multi-layered parallax shifting
        const drawX = p.x + offsetX * p.depth;
        const drawY = p.y + offsetY * p.depth;
        
        return { p, drawX, drawY };
      });
      
      // Draw connection lines
      ctx.lineWidth = 1;
      for (let i = 0; i < coords.length; i++) {
        for (let j = i + 1; j < coords.length; j++) {
          const c1 = coords[i];
          const c2 = coords[j];
          
          const dx = c1.drawX - c2.drawX;
          const dy = c1.drawY - c2.drawY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.55;
            ctx.strokeStyle = theme === "dark"
              ? `rgba(56, 189, 248, ${alpha * 0.15})`
              : `rgba(15, 95, 255, ${alpha * 0.08})`;
            ctx.beginPath();
            ctx.moveTo(c1.drawX, c1.drawY);
            ctx.lineTo(c2.drawX, c2.drawY);
            ctx.stroke();
          }
        }
      }
      
      // Draw node particles
      coords.forEach(c => {
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = c.p.opacity;
        ctx.beginPath();
        ctx.arc(c.drawX, c.drawY, c.p.r, 0, Math.PI * 2);
  // 24. CUSTOM INTERACTIVE CURSOR AURA & GLOW TRAIL
  const cursorAura = document.getElementById("custom-cursor");
  const cursorDot = document.getElementById("custom-cursor-dot");
  
  if (cursorAura && cursorDot) {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches;
    
    if (!isTouchDevice && window.innerWidth > 768) {
      cursorAura.style.display = "block";
      cursorDot.style.display = "block";
      
      let mouseX = 0, mouseY = 0;
      let auraX = 0, auraY = 0;
      let dotX = 0, dotY = 0;
      let hoverTarget = null;
      
      document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });
      
      document.addEventListener("mouseover", (e) => {
        const target = e.target.closest("a, button, .btn, .mood-btn, .chat-chip, .social-btn, #theme-toggle-btn, .timeline-node");
        if (target) {
          hoverTarget = target;
        }
      });
      
      document.addEventListener("mouseout", (e) => {
        const target = e.target.closest("a, button, .btn, .mood-btn, .chat-chip, .social-btn, #theme-toggle-btn, .timeline-node");
        if (target && target === hoverTarget) {
          hoverTarget = null;
        }
      });
      
      // Cursor aura update loop
      const updateCursor = () => {
        let targetX = mouseX;
        let targetY = mouseY;
        
        if (hoverTarget) {
          const rect = hoverTarget.getBoundingClientRect();
          const elemX = rect.left + rect.width / 2;
          const elemY = rect.top + rect.height / 2;
          // Magnet pull (35% snap towards center of the hovered element)
          targetX = mouseX + (elemX - mouseX) * 0.35;
          targetY = mouseY + (elemY - mouseY) * 0.35;
        }
        
        // Easing interpolation (lerp)
        auraX += (targetX - auraX) * 0.15;
        auraY += (targetY - auraY) * 0.15;
        cursorAura.style.left = `${auraX}px`;
        cursorAura.style.top = `${auraY}px`;
        
        dotX += (mouseX - dotX) * 0.35;
        dotY += (mouseY - dotY) * 0.35;
        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;
        
        requestAnimationFrame(updateCursor);
      };
      
      updateCursor();
      
      // Expansion hover listener
      const addCursorHover = () => cursorAura.classList.add("cursor-hover");
      const removeCursorHover = () => cursorAura.classList.remove("cursor-hover");
      
      const updateHoverListeners = () => {
        const targets = document.querySelectorAll("a, button, input[type='button'], input[type='submit'], input[type='range'], select, textarea, .btn, .glow-card, .board-card, .folder-card, .gallery-item, .mood-btn, .timeline-node, .timeline-card, .stat-card, .chat-chip, .gallery-tab");
        targets.forEach(t => {
          t.removeEventListener("mouseenter", addCursorHover);
          t.removeEventListener("mouseleave", removeCursorHover);
          t.addEventListener("mouseenter", addCursorHover);
          t.addEventListener("mouseleave", removeCursorHover);
        });
      };
      
      updateHoverListeners();
      // Periodically refresh list of hover elements to support dynamic elements
      setInterval(updateHoverListeners, 1500);
    }
  }

  // 25. INTERACTIVE PARALLAX MESH CANVAS BACKGROUND
  const meshCanvas = document.getElementById("mesh-canvas");
  if (meshCanvas) {
    const ctx = meshCanvas.getContext("2d");
    let particles = [];
    const particleCount = 65;
    const connectionDistance = 120;
    
    let windowMouseX = window.innerWidth / 2;
    let windowMouseY = window.innerHeight / 2;
    let targetMouseX = window.innerWidth / 2;
    let targetMouseY = window.innerHeight / 2;
    
    window.addEventListener("mousemove", (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    });
    
    const resizeCanvas = () => {
      meshCanvas.width = window.innerWidth;
      meshCanvas.height = window.innerHeight;
      initParticles();
    };
    
    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * meshCanvas.width,
          y: Math.random() * meshCanvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2 + 1.2,
          depth: Math.random() * 0.08 + 0.02, // Depth layers for parallax shifting
          opacity: Math.random() * 0.35 + 0.15
        });
      }
    };
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    
    const animateMesh = () => {
      // Ease mouse updates
      windowMouseX += (targetMouseX - windowMouseX) * 0.05;
      windowMouseY += (targetMouseY - windowMouseY) * 0.05;
      
      ctx.clearRect(0, 0, meshCanvas.width, meshCanvas.height);
      
      // Determine theme colors dynamically
      const theme = document.documentElement.getAttribute("data-theme") || "light";
      let particleColor;
      if (theme === "dark") {
        particleColor = "rgba(56, 189, 248, 0.4)";
      } else {
        particleColor = "rgba(15, 95, 255, 0.25)";
      }
      
      const offsetX = (windowMouseX - meshCanvas.width / 2);
      const offsetY = (windowMouseY - meshCanvas.height / 2);
      
      // Compute positions
      const coords = particles.map(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        // Wrap edges
        if (p.x < 0) p.x = meshCanvas.width;
        if (p.x > meshCanvas.width) p.x = 0;
        if (p.y < 0) p.y = meshCanvas.height;
        if (p.y > meshCanvas.height) p.y = 0;
        
        // Multi-layered parallax shifting
        const drawX = p.x + offsetX * p.depth;
        const drawY = p.y + offsetY * p.depth;
        
        return { p, drawX, drawY };
      });
      
      // Draw connection lines
      ctx.lineWidth = 1;
      for (let i = 0; i < coords.length; i++) {
        for (let j = i + 1; j < coords.length; j++) {
          const c1 = coords[i];
          const c2 = coords[j];
          
          const dx = c1.drawX - c2.drawX;
          const dy = c1.drawY - c2.drawY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.55;
            ctx.strokeStyle = theme === "dark"
              ? `rgba(56, 189, 248, ${alpha * 0.15})`
              : `rgba(15, 95, 255, ${alpha * 0.08})`;
            ctx.beginPath();
            ctx.moveTo(c1.drawX, c1.drawY);
            ctx.lineTo(c2.drawX, c2.drawY);
            ctx.stroke();
          }
        }
      }
      
      // Draw node particles
      coords.forEach(c => {
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = c.p.opacity;
        ctx.beginPath();
        ctx.arc(c.drawX, c.drawY, c.p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;
      
      requestAnimationFrame(animateMesh);
    };
    
    animateMesh();
  }

  // 21. BATCH 263 ORIENTATION LIVE COUNTDOWN TIMER
  const initOrientationCountdown = () => {
    const daysEl = document.getElementById("cd-days");
    const hoursEl = document.getElementById("cd-hours");
    const minsEl = document.getElementById("cd-mins");
    const secsEl = document.getElementById("cd-secs");

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    // Target date: September 8, 2026 (End of day so 6th Sept shows 2 days remaining)
    const targetDate = new Date("2026-09-08T23:59:59+06:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minsEl.textContent = "00";
        secsEl.textContent = "00";
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, "0");
      hoursEl.textContent = String(hours).padStart(2, "0");
      minsEl.textContent = String(minutes).padStart(2, "0");
      secsEl.textContent = String(seconds).padStart(2, "0");
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  };

  initOrientationCountdown();

});
