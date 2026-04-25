// =====================================================================
// 🏠 OFFLINE / DEMO MODE — No Firebase, No Server Required
// Global functions — works with file:// protocol directly.
// =====================================================================

var localProperties = [
    {
        id: "prop_001",
        title: "Luxury High-Rise Apartment",
        location: "Bandra West, Mumbai",
        price: "₹1,25,00,000",
        type: "Apartment",
        status: "For Sale",
        beds: 3,
        baths: 2,
        sqft: 1800,
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        featured: true,
        createdAt: new Date('2026-04-10')
    },
    {
        id: "prop_002",
        title: "Modern Seaview Villa",
        location: "Juhu Beach, Mumbai",
        price: "₹4,50,00,000",
        type: "Villa",
        status: "For Sale",
        beds: 5,
        baths: 6,
        sqft: 4500,
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        featured: true,
        createdAt: new Date('2026-04-12')
    },
    {
        id: "prop_003",
        title: "Skyline Infinity Penthouse",
        location: "Connaught Place, Delhi",
        price: "₹85,000/mo",
        type: "Penthouse",
        status: "For Rent",
        beds: 4,
        baths: 4,
        sqft: 3200,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        featured: true,
        createdAt: new Date('2026-04-14')
    },
    {
        id: "prop_004",
        title: "Contemporary Suburb Home",
        location: "Whitefield, Bangalore",
        price: "₹85,00,000",
        type: "House",
        status: "For Sale",
        beds: 4,
        baths: 3,
        sqft: 2400,
        image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        featured: false,
        createdAt: new Date('2026-04-15')
    },
    {
        id: "prop_005",
        title: "Garden View Studio Apartment",
        location: "Koramangala, Bangalore",
        price: "₹22,000/mo",
        type: "Apartment",
        status: "For Rent",
        beds: 1,
        baths: 1,
        sqft: 650,
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        featured: true,
        createdAt: new Date('2026-04-18')
    },
    {
        id: "prop_006",
        title: "Premium Commercial Office Space",
        location: "Cyber City, Gurgaon",
        price: "₹2,10,00,000",
        type: "Commercial",
        status: "For Sale",
        beds: 0,
        baths: 4,
        sqft: 3800,
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        featured: false,
        createdAt: new Date('2026-04-20')
    }
];

var idCounter = 100;

// Global fetchProperties — returns a Promise
window.fetchProperties = function() {
    return new Promise(function(resolve) {
        setTimeout(function() {
            var sorted = localProperties.slice().sort(function(a, b) {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            console.log('[Demo Mode] Fetched ' + sorted.length + ' properties.');
            resolve(sorted);
        }, 200);
    });
};

// Global addProperty — returns a Promise
window.addProperty = function(propertyData) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            var newId = 'prop_' + (++idCounter);
            var newProperty = Object.assign({}, propertyData, {
                id: newId,
                createdAt: new Date()
            });
            localProperties.unshift(newProperty);
            console.log('[Demo Mode] Property added: ' + newId);
            resolve(newId);
        }, 300);
    });
};

window.seedFirebaseDB = function() {
    console.log('[Demo Mode] Data already seeded locally.');
};

console.log('%c🏠 Krishna Realty — Demo Mode (No Firebase)', 'color: #f97316; font-weight: bold; font-size: 14px;');
