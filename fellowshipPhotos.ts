/**
 * Authentic Fellowship Photo Asset Registry
 * Zero stock/mock images. Pure authentic YoungFire fellowship moments.
 */

export interface FellowshipPhoto {
  id: string;
  url: string;
  alt: string;
  category: 'gathering' | 'brotherhood' | 'sisterhood' | 'sanctuary' | 'leadership' | 'worship';
  aspect?: 'landscape' | 'portrait' | 'square';
  featured?: boolean;
}

// All 27 authentic fellowship photographs cataloged
export const ALL_FELLOWSHIP_PHOTOS: FellowshipPhoto[] = [
  { id: 'yf-3519', url: '/IMG_3519.jpg', alt: 'YoungFire Sanctuary Fellowship Huddle', category: 'gathering', aspect: 'landscape', featured: true },
  { id: 'yf-3520', url: '/IMG_3520.jpg', alt: 'Living Room Prayer Circle Huddle', category: 'gathering', aspect: 'landscape' },
  { id: 'yf-3521', url: '/IMG_3521.jpg', alt: 'Living Room Discipleship Fellowship & Warmth', category: 'gathering', aspect: 'portrait' },
  { id: 'yf-3522', url: '/IMG_3522.jpg', alt: 'Easter Resurrection Church Family Gathering', category: 'sanctuary', aspect: 'landscape', featured: true },
  { id: 'yf-3523', url: '/IMG_3523.jpg', alt: 'Consecrated Fellowship Hallway Huddle', category: 'brotherhood', aspect: 'landscape' },
  { id: 'yf-3524', url: '/IMG_3524.jpg', alt: 'Lead Facilitators Trent D. White & Whitney White', category: 'leadership', aspect: 'portrait', featured: true },
  { id: 'yf-3525', url: '/IMG_3525.jpg', alt: 'Backyard Yard Games & Fellowship Laughter', category: 'gathering', aspect: 'landscape', featured: true },
  { id: 'yf-3526', url: '/IMG_3526.jpg', alt: 'Sacred Fellowship Prayer Consecration Circle', category: 'worship', aspect: 'landscape' },
  { id: 'yf-3527', url: '/IMG_3527.jpg', alt: 'Sanctuary Worship & Altar Celebration', category: 'sanctuary', aspect: 'landscape' },
  { id: 'yf-3528', url: '/IMG_3528.jpg', alt: 'Young Adults Discipleship Cohort', category: 'gathering', aspect: 'landscape' },
  { id: 'yf-3529', url: '/IMG_3529.jpg', alt: 'Sanctuary Brothers Fellowship', category: 'brotherhood', aspect: 'portrait' },
  { id: 'yf-3530', url: '/IMG_3530.jpg', alt: 'Sanctuary Pulpit Celebration', category: 'sanctuary', aspect: 'landscape' },
  { id: 'yf-3531', url: '/IMG_3531.jpg', alt: 'Living Room Bible Discipleship Circle', category: 'gathering', aspect: 'portrait' },
  { id: 'yf-3532', url: '/IMG_3532.jpg', alt: 'Women Ignited Sisterhood Fellowship', category: 'sisterhood', aspect: 'portrait' },
  { id: 'yf-3533', url: '/IMG_3533.jpg', alt: 'Open Bible Study Discussions', category: 'gathering', aspect: 'landscape' },
  { id: 'yf-3534', url: '/IMG_3534.jpg', alt: 'Word Deep-Dive & Scripture Exploration', category: 'worship', aspect: 'landscape' },
  { id: 'yf-3535', url: '/IMG_3535.jpg', alt: 'Sanctuary Entrance Welcome Portal', category: 'sanctuary', aspect: 'landscape' },
  { id: 'yf-3536', url: '/IMG_3536.jpg', alt: 'Living Room Prayer Fellowship', category: 'gathering', aspect: 'landscape' },
  { id: 'yf-3537', url: '/IMG_3537.jpg', alt: 'Small Group Living Room Circle', category: 'gathering', aspect: 'landscape' },
  { id: 'yf-3538', url: '/IMG_3538.jpg', alt: 'Fellowship Warmth & Joy', category: 'gathering', aspect: 'portrait' },
  { id: 'yf-3539', url: '/IMG_3539.jpg', alt: 'Church Mass Fellowship', category: 'sanctuary', aspect: 'landscape' },
  { id: 'yf-3540', url: '/IMG_3540.jpg', alt: 'Brotherhood Intercession Circle', category: 'brotherhood', aspect: 'landscape' },
  { id: 'yf-3541', url: '/IMG_3541.jpg', alt: 'Ministry Overseers Consecration', category: 'leadership', aspect: 'portrait' },
  { id: 'yf-3542', url: '/IMG_3542.jpg', alt: 'Outdoor Fellowship & Lawn Activities', category: 'gathering', aspect: 'landscape' },
  { id: 'yf-3543', url: '/IMG_3543.jpg', alt: 'Altar Consecration Gathering', category: 'worship', aspect: 'landscape' },
  { id: 'yf-3544', url: '/IMG_3544.jpg', alt: 'Sanctuary Assembly & Sacred Welcome', category: 'sanctuary', aspect: 'landscape' },
  { id: 'yf-3545', url: '/IMG_3545.jpg', alt: 'Discipleship Gathering Moment', category: 'gathering', aspect: 'landscape' }
];

// 1. Schedule View Mosaic Photos (13 distinct authentic fellowship shots: zero mock images, no overlap with Team Hub)
export const SCHEDULE_MOSAIC_PHOTOS: string[] = [
  '/IMG_3519.jpg',
  '/IMG_3521.jpg',
  '/IMG_3522.jpg',
  '/IMG_3524.jpg',
  '/IMG_3525.jpg',
  '/IMG_3527.jpg',
  '/IMG_3528.jpg',
  '/IMG_3530.jpg',
  '/IMG_3531.jpg',
  '/IMG_3533.jpg',
  '/IMG_3534.jpg',
  '/IMG_3535.jpg',
  '/IMG_3537.jpg'
];

// 2. Sanctuary Team Hub Mosaic Photos (14 distinct authentic huddle & consecration shots: zero mock images, no overlap with Schedule)
export const TEAM_HUB_MOSAIC_PHOTOS: string[] = [
  '/IMG_3520.jpg',
  '/IMG_3523.jpg',
  '/IMG_3526.jpg',
  '/IMG_3529.jpg',
  '/IMG_3532.jpg',
  '/IMG_3536.jpg',
  '/IMG_3538.jpg',
  '/IMG_3539.jpg',
  '/IMG_3540.jpg',
  '/IMG_3541.jpg',
  '/IMG_3542.jpg',
  '/IMG_3543.jpg',
  '/IMG_3544.jpg',
  '/IMG_3545.jpg'
];

// 3. Homescreen Clockwork Fan Deck Carousel Photos (ALL 27 authentic uploaded photos)
export const CLOCK_CAROUSEL_PHOTOS: string[] = [
  '/IMG_3519.jpg',
  '/IMG_3520.jpg',
  '/IMG_3521.jpg',
  '/IMG_3522.jpg',
  '/IMG_3523.jpg',
  '/IMG_3524.jpg',
  '/IMG_3525.jpg',
  '/IMG_3526.jpg',
  '/IMG_3527.jpg',
  '/IMG_3528.jpg',
  '/IMG_3529.jpg',
  '/IMG_3530.jpg',
  '/IMG_3531.jpg',
  '/IMG_3532.jpg',
  '/IMG_3533.jpg',
  '/IMG_3534.jpg',
  '/IMG_3535.jpg',
  '/IMG_3536.jpg',
  '/IMG_3537.jpg',
  '/IMG_3538.jpg',
  '/IMG_3539.jpg',
  '/IMG_3540.jpg',
  '/IMG_3541.jpg',
  '/IMG_3542.jpg',
  '/IMG_3543.jpg',
  '/IMG_3544.jpg',
  '/IMG_3545.jpg'
];

// 4. Dedicated Sharp Black & White Photo for Menu Drawer (Authentic YoungFire Prayer & Fellowship Circle)
export const MENU_DRAWER_BW_PHOTO = '/IMG_3544.jpg';

// 5. Primary Leadership Cutout Portrait (Trent D. White & Whitney White)
export const LEADERSHIP_PRIMARY_CUTOUT = '/IMG_3524.jpg';
export const LEADERSHIP_PORTRAIT_FALLBACK = '/IMG_3524.jpg';
