// In-Memory Database with Comprehensive Seed Data for RentMyThing

const users = [
  {
    id: 'user_1',
    email: 'alex.rivera@university.edu',
    name: 'Alex Rivera',
    role: 'STUDENT',
    college: 'Boston University Hub',
    hostel: 'Warren Towers Floor 12',
    phone: '+1 (617) 555-0101',
    isVerified: true,
    rating: 4.9
  },
  {
    id: 'user_2',
    email: 'sarah.chen@university.edu',
    name: 'Sarah Chen',
    role: 'STUDENT',
    college: 'Boston University Hub',
    hostel: 'West Campus Dorms',
    phone: '+1 (617) 555-0102',
    isVerified: true,
    rating: 4.8
  },
  {
    id: 'user_3',
    email: 'jordan.m@university.edu',
    name: 'Jordan Miller',
    role: 'STUDENT',
    college: 'MIT Campus Node',
    hostel: 'Baker House',
    phone: '+1 (617) 555-0103',
    isVerified: true,
    rating: 4.7
  },
  {
    id: 'user_admin',
    email: 'admin@rentmything.com',
    name: 'Marketplace Admin',
    role: 'ADMIN',
    college: 'System Hub',
    hostel: 'Admin Tower',
    phone: '+1 (800) 555-0199',
    isVerified: true,
    rating: 5.0
  }
];

const products = [
  {
    id: 'prod_1',
    title: 'Sony WH-1000XM5 Noise Cancelling Headphones',
    description: 'Immaculate condition ANC headphones. Essential for library studying and exam prep. Comes with hard case and audio cable.',
    category: 'Electronics',
    condition: 'Like New',
    rentPricePerDay: 12,
    deposit: 50,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
    college: 'Boston University Hub',
    hostel: 'Warren Towers Floor 12',
    availability: true,
    ownerId: 'user_2',
    ownerName: 'Sarah Chen',
    ownerRating: 4.8,
    lat: 42.3496,
    lng: -71.1042,
    fraudScore: 1,
    fraudReasons: []
  },
  {
    id: 'prod_2',
    title: 'MacBook Pro M3 14-inch (16GB RAM)',
    description: 'High-end laptop loaded with Xcode, VSCode, and Adobe Suite. Ideal for hackathons or weekend project crunches.',
    category: 'Laptop',
    condition: 'Like New',
    rentPricePerDay: 28,
    deposit: 150,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'],
    college: 'Boston University Hub',
    hostel: 'Warren Towers Floor 12',
    availability: true,
    ownerId: 'user_2',
    ownerName: 'Sarah Chen',
    ownerRating: 4.9,
    lat: 42.3508,
    lng: -71.1060,
    fraudScore: 1,
    fraudReasons: []
  },
  {
    id: 'prod_3',
    title: 'Canon EOS R50 Mirrorless Camera + Kit Lens',
    description: 'Compact 4K mirrorless camera great for club events, graduation portraits, and student filmmaking assignments.',
    category: 'Camera',
    condition: 'Good',
    rentPricePerDay: 20,
    deposit: 80,
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'],
    college: 'Boston University Hub',
    hostel: 'West Campus Dorms',
    availability: true,
    ownerId: 'user_1',
    ownerName: 'Alex Rivera',
    ownerRating: 4.9,
    lat: 42.3520,
    lng: -71.1080,
    fraudScore: 1,
    fraudReasons: []
  },
  {
    id: 'prod_4',
    title: 'Trek FX 2 Commuter Campus Cycle',
    description: 'Fast 24-speed hybrid cycle with U-lock and helmet included. Perfect for getting across campus or Charles River trails.',
    category: 'Cycle',
    condition: 'Good',
    rentPricePerDay: 8,
    deposit: 30,
    images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80'],
    college: 'Boston University Hub',
    hostel: 'West Campus Dorms',
    availability: true,
    ownerId: 'user_1',
    ownerName: 'Alex Rivera',
    ownerRating: 4.9,
    lat: 42.3489,
    lng: -71.1015,
    fraudScore: 1,
    fraudReasons: []
  },
  {
    id: 'prod_5',
    title: 'PlayStation 5 Console + 2 DualSense Controllers',
    description: 'PS5 console with FIFA 24 and NBA 2K pre-installed. The ultimate weekend dorm lounge tournament setup.',
    category: 'Gaming',
    condition: 'Like New',
    rentPricePerDay: 18,
    deposit: 70,
    images: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80'],
    college: 'Boston University Hub',
    hostel: 'Warren Towers',
    availability: true,
    ownerId: 'user_2',
    ownerName: 'Sarah Chen',
    ownerRating: 4.8,
    lat: 42.3499,
    lng: -71.1039,
    fraudScore: 1,
    fraudReasons: []
  },
  {
    id: 'prod_6',
    title: 'Anker 1080p Smart Mini HD Projector',
    description: 'Portable projector with built-in speaker and HDMI/USB-C connection. Transforms any dorm wall into a movie night screen.',
    category: 'Projector',
    condition: 'Like New',
    rentPricePerDay: 14,
    deposit: 40,
    images: ['https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80'],
    college: 'MIT Campus Node',
    hostel: 'Baker House',
    availability: true,
    ownerId: 'user_3',
    ownerName: 'Jordan Miller',
    ownerRating: 4.7,
    lat: 42.3560,
    lng: -71.0965,
    fraudScore: 1,
    fraudReasons: []
  },
  {
    id: 'prod_7',
    title: 'Fender Acoustic Guitar + Tuner & Gig Bag',
    description: 'Rich tone acoustic guitar. Great for acoustic jam sessions or practicing in common rooms.',
    category: 'Musical Instruments',
    condition: 'Good',
    rentPricePerDay: 10,
    deposit: 40,
    images: ['https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'],
    college: 'Boston University Hub',
    hostel: 'Warren Towers Floor 12',
    availability: true,
    ownerId: 'user_2',
    ownerName: 'Sarah Chen',
    ownerRating: 4.8,
    lat: 42.3501,
    lng: -71.1045,
    fraudScore: 1,
    fraudReasons: []
  },
  {
    id: 'prod_8',
    title: 'Spalding Official NBA Outdoor/Indoor Basketball',
    description: 'Official composite leather basketball, fully pumped. Perfect for FitRec pickup games.',
    category: 'Sports',
    condition: 'Like New',
    rentPricePerDay: 4,
    deposit: 15,
    images: ['https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80'],
    college: 'Boston University Hub',
    hostel: 'West Campus Dorms',
    availability: true,
    ownerId: 'user_1',
    ownerName: 'Alex Rivera',
    ownerRating: 4.9,
    lat: 42.3515,
    lng: -71.1072,
    fraudScore: 1,
    fraudReasons: []
  },
  {
    id: 'prod_9',
    title: 'Graphing Calculator TI-84 Plus CE (Color Screen)',
    description: 'Required for calculus, statistics, and engineering finals. Includes charging cord.',
    category: 'Electronics',
    condition: 'Like New',
    rentPricePerDay: 5,
    deposit: 25,
    images: ['https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80'],
    college: 'MIT Campus Node',
    hostel: 'Baker House',
    availability: true,
    ownerId: 'user_3',
    ownerName: 'Jordan Miller',
    ownerRating: 4.7,
    lat: 42.3565,
    lng: -71.0950,
    fraudScore: 1,
    fraudReasons: []
  },
  {
    id: 'prod_10',
    title: 'Brand New DSLR Camera for $2/Day!! Urgent',
    description: 'Suspiciously cheap high-end DSLR camera listed well below average campus rates.',
    category: 'Camera',
    condition: 'Like New',
    rentPricePerDay: 2,
    deposit: 0,
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'],
    college: 'Boston University Hub',
    hostel: 'Unknown Node',
    availability: true,
    ownerId: 'user_3',
    ownerName: 'Jordan Miller',
    ownerRating: 3.5,
    lat: 42.3500,
    lng: -71.1050,
    fraudScore: 8,
    fraudReasons: [
      'Price ($2/day) is 88% below market average for DSLR cameras ($18-$25/day)',
      'Zero security deposit required for high-value electronics',
      'Urgency language detected in listing title'
    ]
  }
];

const bookings = [
  {
    id: 'book_1',
    productId: 'prod_1',
    productTitle: 'Sony WH-1000XM5 Noise Cancelling Headphones',
    renterId: 'user_1',
    ownerId: 'user_2',
    startDate: '2026-07-14',
    endDate: '2026-07-16',
    totalPrice: 26,
    status: 'APPROVED',
    pickupCode: '4921',
    returnCode: '8832',
    createdAt: new Date().toISOString()
  }
];

const wishlist = {
  user_1: ['prod_2', 'prod_5'],
  user_2: ['prod_3']
};

const messages = [
  {
    id: 'msg_1',
    senderId: 'user_1',
    recipientId: 'user_2',
    text: 'Hey Sarah! Is the Sony WH-1000XM5 available for pickup at Warren Towers lobby tomorrow morning?',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'msg_2',
    senderId: 'user_2',
    recipientId: 'user_1',
    text: 'Hey Alex! Yes absolutely, I can meet you by the security desk around 10 AM.',
    createdAt: new Date(Date.now() - 1800000).toISOString()
  }
];

const requests = [
  {
    id: 'req_1',
    userId: 'user_3',
    userName: 'Jordan Miller',
    title: 'Need GoPro Hero 11 or 12 for weekend ski trip',
    description: 'Looking to borrow an action camera with chest mount or selfie stick from Friday to Sunday.',
    category: 'Camera',
    budget: 15,
    duration: 3,
    pickupDate: '2026-07-17',
    status: 'OPEN',
    offersCount: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'req_2',
    userId: 'user_1',
    userName: 'Alex Rivera',
    title: 'Portable PA Speaker with Wireless Mic for Club Social',
    description: 'Need a loud Bluetooth PA speaker for an outdoor campus student organization meet.',
    category: 'Electronics',
    budget: 20,
    duration: 1,
    pickupDate: '2026-07-15',
    status: 'OPEN',
    offersCount: 2,
    createdAt: new Date().toISOString()
  }
];

const requestOffers = [
  {
    id: 'off_1',
    requestId: 'req_1',
    ownerId: 'user_1',
    ownerName: 'Alex Rivera',
    price: 15,
    message: 'I have a GoPro Hero 11 with 2 spare batteries and a head mount ready!',
    status: 'PENDING',
    createdAt: new Date().toISOString()
  }
];

const bundles = [
  {
    id: 'bundle_exam',
    name: 'Finals Exam Power Kit',
    description: 'Everything needed to crush exam week: MacBook Pro M3 + Sony ANC Headphones + TI-84 Graphing Calculator.',
    discountPercent: 18,
    totalPrice: 42,
    items: ['MacBook Pro M3 14-inch', 'Sony WH-1000XM5 Headphones', 'TI-84 Plus CE Calculator'],
    productIds: ['prod_2', 'prod_1', 'prod_9']
  },
  {
    id: 'bundle_photo',
    name: 'Weekend Studio Content Kit',
    description: 'Capture student film projects or graduation shoots: Canon EOS R50 Mirrorless Camera + Kit Lens + Carrying Gear.',
    discountPercent: 15,
    totalPrice: 22,
    items: ['Canon EOS R50 Camera', 'High Speed 64GB SD Card', 'Mini Tripod Stand'],
    productIds: ['prod_3']
  },
  {
    id: 'bundle_lounge',
    name: 'Dorm Weekend Tournament Pack',
    description: 'Throw a memorable game night: PlayStation 5 Console + 2 DualSense Controllers + Anker Smart Mini HD Projector.',
    discountPercent: 20,
    totalPrice: 28,
    items: ['PlayStation 5 Console', '2x DualSense Controllers', 'Anker 1080p Smart Projector'],
    productIds: ['prod_5', 'prod_6']
  }
];

module.exports = {
  users,
  products,
  bookings,
  wishlist,
  messages,
  requests,
  requestOffers,
  bundles
};
