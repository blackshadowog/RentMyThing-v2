const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'rentmything_store.json');

// Authentic Indian Campus Seed Data in ₹ (INR)
const defaultData = {
  users: [
    {
      id: 'user_iitd_1',
      email: 'aravind.sharma@iitd.ac.in',
      name: 'Aravind Sharma',
      role: 'STUDENT',
      college: 'IIT Delhi - Hauz Khas Campus',
      hostel: 'Karakoram Hostel, Room 214',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
      verificationIdType: 'IIT Delhi Student ID Card #2023CS1049',
      rating: 4.9,
      completedRentals: 14,
      joinedDate: '2025-08-15'
    },
    {
      id: 'user_iitb_2',
      email: 'priya.nair@iitb.ac.in',
      name: 'Priya Nair',
      role: 'STUDENT',
      college: 'IIT Bombay - Powai Campus',
      hostel: 'Hostel 15, Room 308',
      phone: '+91 98123 45678',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
      verificationIdType: 'IIT Bombay Identity Card #22B0931',
      rating: 4.95,
      completedRentals: 21,
      joinedDate: '2025-07-10'
    },
    {
      id: 'user_bits_3',
      email: 'rohan.verma@pilani.bits-pilani.ac.in',
      name: 'Rohan Verma',
      role: 'STUDENT',
      college: 'BITS Pilani - Vidya Vihar Campus',
      hostel: 'Ram Bhawan, Room 102',
      phone: '+91 99887 76655',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
      verificationIdType: 'BITS Pilani Smart ID #2024A7PS018',
      rating: 4.85,
      completedRentals: 9,
      joinedDate: '2025-09-01'
    },
    {
      id: 'user_admin',
      email: 'admin@rentmything.in',
      name: 'Marketplace Admin India',
      role: 'ADMIN',
      college: 'RentMyThing India HQ',
      hostel: 'Bangalore Innovation Hub',
      phone: '+91 80 4567 8900',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
      verificationIdType: 'System Root Authority',
      rating: 5.0,
      completedRentals: 100,
      joinedDate: '2025-01-01'
    }
  ],
  products: [
    {
      id: 'prod_in_1',
      title: 'Sony WH-1000XM5 Noise Cancelling Headphones (Black)',
      description: 'Industry-leading ANC headphones. Lifesaver for hostel study sessions during end-sems or coding hackathons. Includes carry case and aux cable.',
      category: 'Electronics',
      condition: 'Like New',
      rentPricePerDay: 250, // ₹250/day
      deposit: 1500, // ₹1,500 deposit
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
      college: 'IIT Delhi - Hauz Khas Campus',
      hostel: 'Karakoram Hostel, Room 214',
      availability: true,
      ownerId: 'user_iitd_1',
      ownerName: 'Aravind Sharma',
      ownerRating: 4.9,
      ownerPhone: '+91 98765 43210',
      ownerEmail: 'aravind.sharma@iitd.ac.in',
      lat: 28.5450,
      lng: 77.1926,
      fraudScore: 1,
      fraudReasons: []
    },
    {
      id: 'prod_in_2',
      title: 'MacBook Pro M3 14-inch (16GB RAM / 512GB SSD)',
      description: 'Loaded with Xcode, VSCode, Docker, and Adobe Creative Cloud. Perfect for weekend hackathons, ML assignments, or tech fest presentations.',
      category: 'Laptop',
      condition: 'Like New',
      rentPricePerDay: 850, // ₹850/day
      deposit: 5000,
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'],
      college: 'IIT Bombay - Powai Campus',
      hostel: 'Hostel 15, Room 308',
      availability: true,
      ownerId: 'user_iitb_2',
      ownerName: 'Priya Nair',
      ownerRating: 4.95,
      ownerPhone: '+91 98123 45678',
      ownerEmail: 'priya.nair@iitb.ac.in',
      lat: 19.1334,
      lng: 72.9133,
      fraudScore: 1,
      fraudReasons: []
    },
    {
      id: 'prod_in_3',
      title: 'Canon EOS R50 4K Mirrorless Camera + 18-45mm Kit Lens',
      description: 'Compact 4K camera great for campus fests, club videography, or farewell portrait photography. Comes with 64GB Extreme Pro card.',
      category: 'Camera',
      condition: 'Like New',
      rentPricePerDay: 450, // ₹450/day
      deposit: 2000,
      images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'],
      college: 'IIT Delhi - Hauz Khas Campus',
      hostel: 'Karakoram Hostel, Room 214',
      availability: true,
      ownerId: 'user_iitd_1',
      ownerName: 'Aravind Sharma',
      ownerRating: 4.9,
      ownerPhone: '+91 98765 43210',
      ownerEmail: 'aravind.sharma@iitd.ac.in',
      lat: 28.5458,
      lng: 77.1932,
      fraudScore: 1,
      fraudReasons: []
    },
    {
      id: 'prod_in_4',
      title: 'Decathlon Riverside 500 Hybrid 9-Speed Cycle',
      description: 'Smooth 9-speed hybrid bicycle with front suspension, numerical combination lock, and LED headlight. Best way to get across large campuses.',
      category: 'Cycle',
      condition: 'Good',
      rentPricePerDay: 90, // ₹90/day
      deposit: 500,
      images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80'],
      college: 'BITS Pilani - Vidya Vihar Campus',
      hostel: 'Ram Bhawan, Room 102',
      availability: true,
      ownerId: 'user_bits_3',
      ownerName: 'Rohan Verma',
      ownerRating: 4.85,
      ownerPhone: '+91 99887 76655',
      ownerEmail: 'rohan.verma@pilani.bits-pilani.ac.in',
      lat: 28.3638,
      lng: 75.5870,
      fraudScore: 1,
      fraudReasons: []
    },
    {
      id: 'prod_in_5',
      title: 'PlayStation 5 Disc Edition + 2 Wireless Controllers + FIFA 24',
      description: 'The ultimate hostel weekend setup. Comes with 2 DualSense controllers, FIFA 24, and Tekken 8.',
      category: 'Gaming',
      condition: 'Like New',
      rentPricePerDay: 500, // ₹500/day
      deposit: 2500,
      images: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80'],
      college: 'IIT Bombay - Powai Campus',
      hostel: 'Hostel 15, Room 308',
      availability: true,
      ownerId: 'user_iitb_2',
      ownerName: 'Priya Nair',
      ownerRating: 4.95,
      ownerPhone: '+91 98123 45678',
      ownerEmail: 'priya.nair@iitb.ac.in',
      lat: 19.1340,
      lng: 72.9142,
      fraudScore: 1,
      fraudReasons: []
    },
    {
      id: 'prod_in_6',
      title: 'Anker Nebula Apollo 1080p Smart Wi-Fi Mini Projector',
      description: 'Pocket-sized smart projector with built-in Harman speaker. Turns any hostel common room wall into a cinema screen.',
      category: 'Projector',
      condition: 'Like New',
      rentPricePerDay: 350, // ₹350/day
      deposit: 1200,
      images: ['https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80'],
      college: 'BITS Pilani - Vidya Vihar Campus',
      hostel: 'Ram Bhawan, Room 102',
      availability: true,
      ownerId: 'user_bits_3',
      ownerName: 'Rohan Verma',
      ownerRating: 4.85,
      ownerPhone: '+91 99887 76655',
      ownerEmail: 'rohan.verma@pilani.bits-pilani.ac.in',
      lat: 28.3645,
      lng: 75.5880,
      fraudScore: 1,
      fraudReasons: []
    }
  ],
  bookings: [
    {
      id: 'book_in_101',
      productId: 'prod_in_1',
      productTitle: 'Sony WH-1000XM5 Noise Cancelling Headphones (Black)',
      renterId: 'user_iitb_2',
      renterName: 'Priya Nair',
      renterEmail: 'priya.nair@iitb.ac.in',
      renterPhone: '+91 98123 45678',
      renterHostel: 'Hostel 15, Room 308',
      ownerId: 'user_iitd_1',
      ownerName: 'Aravind Sharma',
      ownerEmail: 'aravind.sharma@iitd.ac.in',
      ownerPhone: '+91 98765 43210',
      ownerHostel: 'Karakoram Hostel, Room 214',
      startDate: '2026-07-15',
      endDate: '2026-07-17',
      totalPrice: 500, // ₹500
      status: 'APPROVED',
      pickupCode: '4921',
      returnCode: '8832',
      createdAt: new Date().toISOString()
    }
  ],
  messages: [
    {
      id: 'msg_in_1',
      senderId: 'user_iitb_2',
      senderName: 'Priya Nair',
      recipientId: 'user_iitd_1',
      text: 'Hi Aravind! I am visiting Delhi for Inter-IIT Tech Meet. Can I pick up the Sony headphones near SAC gate?',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'msg_in_2',
      senderId: 'user_iitd_1',
      senderName: 'Aravind Sharma',
      recipientId: 'user_iitb_2',
      text: 'Hey Priya! Absolutely. I have verified your IIT Bombay student profile. Meet me near Student Activity Centre around 11 AM.',
      createdAt: new Date(Date.now() - 1800000).toISOString()
    }
  ],
  wishlist: {
    user_iitd_1: ['prod_in_2', 'prod_in_5'],
    user_iitb_2: ['prod_in_3']
  },
  requests: [
    {
      id: 'req_in_1',
      userId: 'user_bits_3',
      userName: 'Rohan Verma',
      userCollege: 'BITS Pilani - Vidya Vihar Campus',
      userHostel: 'Ram Bhawan, Room 102',
      title: 'Need GoPro Hero 12 Black with Helmet Strap for Oasis Fest',
      description: 'Looking to borrow a 5.3K action camera from Friday to Sunday to capture fest highlights.',
      category: 'Camera',
      budget: 400, // ₹400/day
      duration: 3,
      pickupDate: '2026-07-18',
      status: 'OPEN',
      offersCount: 1,
      createdAt: new Date().toISOString()
    }
  ],
  requestOffers: [
    {
      id: 'off_in_1',
      requestId: 'req_in_1',
      ownerId: 'user_iitd_1',
      ownerName: 'Aravind Sharma',
      price: 380,
      message: 'I can send my GoPro Hero 12 with extra enduro battery!',
      status: 'PENDING',
      createdAt: new Date().toISOString()
    }
  ],
  bundles: [
    {
      id: 'bundle_in_tech',
      name: 'Hackathon & Tech Fest Power Pack',
      description: 'MacBook Pro M3 14-inch + Sony WH-1000XM5 ANC Headphones. Crush your 36-hour sprint.',
      discountPercent: 15,
      totalPrice: 935, // ₹935/day instead of ₹1100
      items: ['MacBook Pro M3 14-inch', 'Sony WH-1000XM5 ANC Headphones'],
      productIds: ['prod_in_2', 'prod_in_1']
    },
    {
      id: 'bundle_in_fest',
      name: 'Campus Fest Videography Studio Kit',
      description: 'Canon EOS R50 4K Mirrorless Camera + High Speed Card + Rode VideoMic.',
      discountPercent: 18,
      totalPrice: 480, // ₹480/day
      items: ['Canon EOS R50 4K Camera', '64GB Extreme Pro SD Card', 'Rode Mini Microphone'],
      productIds: ['prod_in_3']
    }
  ]
};

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading persistent DB file, using default seed:', err);
  }
  saveDatabase(defaultData);
  return defaultData;
}

function saveDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing persistent DB file:', err);
  }
}

// Singleton database object backed by disk file
const db = loadDatabase();

module.exports = {
  db,
  saveDatabase
};
