/**
 * SQAT Student Welfare Wing - Gallery & Activities database
 */

const galleryItems = [
  {
    id: 1,
    title: "Welfare Distribution Campaign",
    description: "Distributing educational supplies and assistance to students in need, ensuring equal opportunities for everyone.",
    category: "welfare",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800",
    date: "May 12, 2026"
  },
  {
    id: 2,
    title: "Blood Donation Drive 2026",
    description: "Organized in collaboration with Badhan, saving lives through active student participation and blood donation.",
    category: "blood",
    image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=800",
    date: "April 05, 2026"
  },
  {
    id: 3,
    title: "Student Mental Health Seminar",
    description: "A seminar addressing academic pressure, stress management, and coping mechanisms for university students.",
    category: "support",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800",
    date: "March 18, 2026"
  },
  {
    id: 4,
    title: "Software Testing BootCamp Volunteer Assist",
    description: "Volunteers helping peer students set up automation frameworks (Selenium, Playwright) and resolve testing bugs.",
    category: "volunteering",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
    date: "February 22, 2026"
  },
  {
    id: 5,
    title: "Flood Relief Action Plan",
    description: "Emergency support and food package packing campaign driven by the SQAT Student Welfare Wing volunteers.",
    category: "community",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800",
    date: "January 14, 2026"
  },
  {
    id: 6,
    title: "Exam Preparation Study Circles",
    description: "Creating supportive study circles before the semester finals, with focus on software testing and engineering.",
    category: "support",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
    date: "December 08, 2025"
  },
  {
    id: 7,
    title: "Free Healthcare & Vaccination Camp",
    description: "A medical checkup campaign organized for the Daffodil International University support staff and students.",
    category: "welfare",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
    date: "November 12, 2025"
  },
  {
    id: 8,
    title: "Winter Clothing Distribution",
    description: "Annual warmth drive to collect and distribute blankets and winter clothing to vulnerable local communities.",
    category: "community",
    image: "assets/gallery/winter_clothing.png",
    date: "October 30, 2025"
  }
];

// Assign globally for import simplicity in browser vanilla JS
window.SQAT_GALLERY = galleryItems;
