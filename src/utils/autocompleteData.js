// Business types for autocomplete
export const businessTypes = [
    "Cafe",
    "Restaurant",
    "Bakery",
    "Coffee Shop",
    "Pizzeria",
    "Food Truck",
    "Bar",
    "Brewery",
    "Boutique",
    "Clothing Store",
    "Jewelry Store",
    "Bookstore",
    "Gift Shop",
    "Home Decor Store",
    "Electronics Store",
    "Beauty Salon",
    "Spa",
    "Barbershop",
    "Nail Salon",
    "Fitness Studio",
    "Gym",
    "Yoga Studio",
    "Dance Studio",
    "Pilates Studio",
    "Dental Office",
    "Medical Clinic",
    "Veterinary Clinic",
    "Pet Store",
    "Pet Grooming",
    "Day Care",
    "Photography Studio",
    "Art Gallery",
    "Music School",
    "Tutoring Center",
    "Auto Repair Shop",
    "Car Wash",
    "Hotel",
    "Bed and Breakfast",
    "Travel Agency",
    "Real Estate Agency",
    "Law Firm",
    "Accounting Firm",
    "Insurance Agency",
    "Marketing Agency",
    "Web Design Studio",
    "Event Planning Business",
    "Cleaning Service",
    "Landscaping Service",
    "Florist",
    "Bakery"
];

// Target audiences for autocomplete
export const targetAudiences = [
    "Local Community",
    "Families",
    "Parents",
    "Young Professionals",
    "College Students",
    "Teenagers",
    "Children",
    "Seniors",
    "Retirees",
    "Remote Workers",
    "Office Workers",
    "Tourists",
    "Travelers",
    "Health-Conscious Individuals",
    "Fitness Enthusiasts",
    "Athletes",
    "Foodies",
    "Vegans/Vegetarians",
    "Pet Owners",
    "Homeowners",
    "Renters",
    "First-Time Buyers",
    "Eco-Conscious Consumers",
    "Luxury Shoppers",
    "Budget-Conscious Shoppers",
    "Tech Enthusiasts",
    "Gamers",
    "Artists",
    "Musicians",
    "Collectors",
    "Book Lovers",
    "Fashion Enthusiasts",
    "Beauty Enthusiasts",
    "DIY Enthusiasts",
    "Car Owners",
    "Business Owners",
    "Entrepreneurs",
    "Corporate Clients",
    "Women",
    "Men",
    "LGBTQ+ Community",
    "Local Businesses",
    "Online Shoppers",
    "Weekend Shoppers"
];

// Function to generate relevant promotion ideas based on business type
export const getPromotionIdeas = (businessType = "") => {
    // Convert to lowercase for easier matching
    const type = businessType.toLowerCase();

    // General promotions that work for most businesses
    const generalPromotions = [
        "Grand opening event",
        "Anniversary celebration",
        "Holiday special",
        "Seasonal promotion",
        "Refer-a-friend program",
        "Loyalty rewards program",
        "Buy one, get one free offer",
        "Limited-time discount",
        "Flash sale",
        "Weekend special",
        "Early bird discount",
        "Happy hour deal",
        "Customer appreciation event",
        "End of season clearance",
        "Free consultation offer",
        "Gift with purchase",
        "Bundle deal"
    ];

    // Business-specific promotion ideas
    if (type.includes("cafe") || type.includes("coffee") || type.includes("restaurant") || type.includes("bakery") || type.includes("pizzeria")) {
        return [
            ...generalPromotions,
            "New menu item launch",
            "Chef's special of the week",
            "Free dessert with any entree",
            "Breakfast combo deal",
            "Lunch specials for office workers",
            "Family meal deal",
            "Happy hour discounts",
            "Tasting event",
            "Cooking class event",
            "Buy 10 coffees, get 1 free",
            "Half-price pastries after 5pm",
            "Weekly live music night",
            "Student discount with ID",
            "Senior discount day"
        ];
    }

    if (type.includes("retail") || type.includes("store") || type.includes("boutique") || type.includes("shop")) {
        return [
            ...generalPromotions,
            "New collection launch",
            "Seasonal fashion show",
            "Private shopping event",
            "Buy more, save more tier discount",
            "Clearance sale",
            "Members-only preview",
            "Personal styling session",
            "Free gift wrapping",
            "Gift card promotion",
            "Store credit rewards",
            "Mystery discount coupon",
            "Tax-free shopping day",
            "Trade-in discount",
            "First Friday special"
        ];
    }

    if (type.includes("salon") || type.includes("spa") || type.includes("beauty") || type.includes("hair") || type.includes("nail")) {
        return [
            ...generalPromotions,
            "First-time client discount",
            "Refer a friend, both get 20% off",
            "Package deals (hair, nails, makeup)",
            "Bridal party specials",
            "Mother-daughter special",
            "Senior day discount",
            "Product of the month special",
            "Free treatment upgrade",
            "Loyalty points program",
            "Early week discounts",
            "Birthday month special",
            "Seasonal treatment special",
            "New treatment introduction offer"
        ];
    }

    if (type.includes("fitness") || type.includes("gym") || type.includes("yoga") || type.includes("studio")) {
        return [
            ...generalPromotions,
            "New member special",
            "Bring a friend week",
            "No enrollment fee",
            "Free fitness assessment",
            "Class package discount",
            "Early bird class special",
            "Holiday fitness challenge",
            "Summer body program",
            "Family membership discount",
            "Student discount",
            "Corporate partnership rates",
            "Fitness workshop series",
            "Nutrition consultation add-on",
            "Virtual class options"
        ];
    }

    if (type.includes("clinic") || type.includes("dental") || type.includes("medical") || type.includes("vet")) {
        return [
            ...generalPromotions,
            "New patient special",
            "Free consultation",
            "Preventive care package",
            "Family discount",
            "Senior discount program",
            "Referral rewards",
            "Annual checkup reminder promotion",
            "Vaccination clinic day",
            "Educational workshop series",
            "Health screening event",
            "Wellness program enrollment",
            "Telehealth appointment option",
            "Extended hours special"
        ];
    }

    // Return general promotions for any other business type
    return generalPromotions;
}; 