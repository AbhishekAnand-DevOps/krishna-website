// Demo Mode: fetchProperties and addProperty are global (from firebase-config.js)

window.showMainView = (e) => {
    if (e) e.preventDefault();
    document.getElementById('main-view').style.display = 'block';
    document.getElementById('user-login-view').style.display = 'none';
    document.getElementById('admin-login-view').style.display = 'none';
    document.getElementById('admin-dashboard-view').style.display = 'none';
};

window.showUserLogin = (e) => {
    if (e) e.preventDefault();
    document.getElementById('main-view').style.display = 'none';
    document.getElementById('user-login-view').style.display = 'block';
    document.getElementById('admin-login-view').style.display = 'none';
    document.getElementById('admin-dashboard-view').style.display = 'none';
};

window.showAdminLogin = (e) => {
    if (e) e.preventDefault();
    if (localStorage.getItem('adminAuth') === 'true') {
        window.showAdminDashboard(null);
    } else {
        document.getElementById('main-view').style.display = 'none';
        document.getElementById('user-login-view').style.display = 'none';
        document.getElementById('admin-login-view').style.display = 'block';
        document.getElementById('admin-dashboard-view').style.display = 'none';
    }
};

window.showAdminDashboard = (e) => {
    if (e) e.preventDefault();
    document.getElementById('main-view').style.display = 'none';
    document.getElementById('user-login-view').style.display = 'none';
    document.getElementById('admin-login-view').style.display = 'none';
    document.getElementById('admin-dashboard-view').style.display = 'block';
    // Re-render table when entering dashboard
    renderData();
};

async function renderData() {
    const featuredGrid = document.getElementById('featured-grid');
    const tableBody = document.getElementById('property-table-body');
    
    // Fetch data from Firebase
    const properties = await window.fetchProperties();

    // Render Main Site Properties
    if (featuredGrid) {
        const featured = properties.filter(p => p.featured);
        
        if (featured.length === 0) {
            featuredGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No featured properties found. Ask Admin to seed database.</p>`;
        } else {
            featuredGrid.innerHTML = featured.map((p, index) => `
            <div class="property-card" style="animation: slideUp 0.6s ease forwards ${index * 150}ms; opacity: 0;">
                <div class="card-img-wrapper">
                <div class="card-badges">
                    <span class="badge badge-featured">Featured</span>
                    <span class="badge badge-type">${p.status}</span>
                </div>
                <img src="${p.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}" alt="${p.title}" class="card-img" onerror="this.src='https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'">
                </div>
                <div class="card-content">
                <div class="card-price">${p.price}</div>
                <h3 class="card-title">${p.title}</h3>
                <div class="card-location">
                    <i class="fa-solid fa-location-dot"></i> ${p.location}
                </div>
                <div class="card-features">
                    <div class="feature-item">
                    <i class="fa-solid fa-bed"></i>
                    <span>${p.beds || 0} Beds</span>
                    </div>
                    <div class="feature-item">
                    <i class="fa-solid fa-bath"></i>
                    <span>${p.baths || 0} Baths</span>
                    </div>
                    <div class="feature-item">
                    <i class="fa-solid fa-vector-square"></i>
                    <span>${p.sqft || 0} sqft</span>
                    </div>
                </div>
                </div>
            </div>
            `).join('');
        }
    }

    // Render Admin Table Data
    if (tableBody) {
        document.getElementById('stat-total').innerText = properties.length;
        document.getElementById('stat-sales').innerText = properties.filter(p => p.status === 'For Sale').length;

        tableBody.innerHTML = properties.map((p, index) => {
            const statusClass = p.status === 'For Sale' ? 'status-sale' : 'status-rent';
            const shortId = p.id ? p.id.substring(0, 6) : (1000 + index);
            return `
                <tr>
                    <td style="font-weight: 500;">#${shortId}</td>
                    <td>
                        <div style="font-weight: 600;">${p.title}</div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;"><i class="fa-solid fa-location-dot"></i> ${p.location}</div>
                    </td>
                    <td>
                        <div style="font-size: 0.875rem;">${p.type}</div>
                        <span class="status-badge ${statusClass}" style="display: inline-block; margin-top: 0.25rem;">${p.status}</span>
                    </td>
                    <td style="font-weight: 600; color: var(--brand-primary);">${p.price}</td>
                    <td>
                        <div class="action-btns">
                            <button class="action-btn" title="View/Edit" onclick="alert('Edit property ${shortId}')"><i class="fa-solid fa-pen"></i></button>
                            <button class="action-btn" title="Delete" style="color: #ef4444;" onclick="alert('Delete property ${shortId}')"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle Logic ---
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeToggles = document.querySelectorAll('.theme-toggle');
    themeToggles.forEach(toggle => {
        updateThemeIcon(toggle, savedTheme);
        toggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggles.forEach(t => updateThemeIcon(t, newTheme));
        });
    });

    function updateThemeIcon(toggle, theme) {
        const icon = toggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
        }
    }

    // --- Modal Logic ---
    const openModalBtns = document.querySelectorAll('.open-post-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalOverlay = document.getElementById('post-property-modal');
    
    if (modalOverlay) {
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        closeModalBtn.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Initial Data Fetch
    renderData();

    // --- Post Property Form Logic ---
    const postPropertyForm = document.getElementById('post-property-form');
    if (postPropertyForm) {
        postPropertyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Collect Data
            const intent = document.getElementById('prop-intent').value;
            const type = document.getElementById('prop-type').value;
            const location = document.getElementById('prop-location').value;
            const price = document.getElementById('prop-price').value;
            const area = document.getElementById('prop-area').value;
            const name = document.getElementById('prop-name').value;
            const mobile = document.getElementById('prop-mobile').value;

            // Simple formatting
            const formattedPrice = intent === 'Sell' ? `₹${price}` : `₹${price}/mo`;
            const status = intent === 'Sell' ? 'For Sale' : 'For Rent';
            const title = `New ${type} in ${location.split(',')[0]}`;

            const propertyData = {
                title: title,
                location: location,
                price: formattedPrice,
                type: type,
                status: status,
                beds: 0,
                baths: 0,
                sqft: parseInt(area),
                image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                featured: true, // Make new properties featured by default
                ownerName: name,
                ownerMobile: mobile
            };

            try {
                // Change button text to indicate loading
                const submitBtn = postPropertyForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerText;
                submitBtn.innerText = "Submitting...";
                submitBtn.disabled = true;

                await window.addProperty(propertyData);
                
                alert('Property Submitted successfully!');
                postPropertyForm.reset();
                document.querySelector('.close-modal').click();
                
                // Re-fetch and render to show the new property immediately
                renderData();
                
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            } catch (error) {
                alert("Failed to submit property. Check console for details.");
                console.error(error);
                
                const submitBtn = postPropertyForm.querySelector('button[type="submit"]');
                submitBtn.innerText = "Submit Property";
                submitBtn.disabled = false;
            }
        });
    }

    // --- Base User Logic ---
    const userForm = document.getElementById('user-login-form');
    if (userForm) {
        userForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('user-email');
            const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
            if (email !== '') {
                alert('Logged in as customer successfully!');
                userForm.reset();
                window.showMainView(null);
            }
        });
    }

    // --- Admin Logic ---
    const adminForm = document.getElementById('admin-login-form');
    if (adminForm) {
        adminForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('admin-email');
            const passwordInput = document.getElementById('admin-password');
            const errorMsg = document.getElementById('admin-login-error');

            const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
            const password = passwordInput ? passwordInput.value.trim() : '';

            // Using simple auth for now. To secure this, you'd use Firebase Auth.
            if (email === 'admin@krishnarealty.com' && password === 'password123') {
                localStorage.setItem('adminAuth', 'true');
                errorMsg.style.display = 'none';
                window.showAdminDashboard(null);
            } else {
                errorMsg.style.display = 'block';
            }
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('adminAuth');
            window.showAdminLogin(null);
        });
    }

    // --- Search Form Tabs ---
    const searchTabs = document.querySelectorAll('.search-tab');
    searchTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            searchTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // --- Scroll Animations ---
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('stagger-children')) {
                    entry.target.classList.add('active');
                } else {
                    entry.target.style.animationPlayState = 'running';
                }
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-slide-up, .stagger-children').forEach(el => {
        if (el.classList.contains('animate-slide-up')) {
            el.style.animationPlayState = 'paused';
        }
        observer.observe(el);
    });
});
