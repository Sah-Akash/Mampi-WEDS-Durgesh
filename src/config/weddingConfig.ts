export type LanguageMode = 'en' | 'hi' | 'bilingual';

export interface WeddingEventItem {
  id: string;
  enabled: boolean;
  name: string;
  nameHindi: string;
  subtitle: string;
  subtitleHindi: string;
  date: string;
  startTime: string;
  endTime?: string;
  venueName: string;
  fullAddress: string;
  dressCode: string;
  dressCodeHindi: string;
  description: string;
  descriptionHindi: string;
  googleMapsUrl: string;
  accentHex: string;
  illustrationType: 'haldi' | 'mehendi' | 'sangeet' | 'wedding' | 'reception';
  photoUrl?: string;
}

export interface GalleryPlateItem {
  id: string;
  title: string;
  titleHindi: string;
  caption: string;
  captionHindi: string;
  category: string;
  aspectRatio: 'feature' | 'portrait' | 'landscape' | 'square';
  illustrationType: 'courtyard' | 'archway' | 'mandap' | 'jharokha' | 'sheeshmahal' | 'procession';
  isPlaceholderIllustration: boolean;
  photoUrl?: string;
}

export interface WeddingConfig {
  guestName: string;
  brideName: string;
  brideNameHindi: string;
  groomName: string;
  groomNameHindi: string;
  brideFatherName: string;
  brideMotherName: string;
  groomFatherName: string;
  groomMotherName: string;
  // Hold Scene 2 (Day 1 - 22.11.2026: Mehendi)
  haldiName: string;
  haldiNameHindi?: string;
  haldiDate: string;
  haldiTime: string;
  haldiVenue: string;
  haldiMapUrl: string;
  // Hold Scene 3 (Day 2 - 23.11.2026: Satyanarayan Pujan, Matkor, Ghee Dhari & Haldi)
  receptionName: string;
  receptionNameHindi?: string;
  receptionDate: string;
  receptionTime: string;
  receptionVenue: string;
  receptionMapUrl: string;
  // Hold Scene 4 (Day 3 - 24.11.2026: Wedding at Jay Maa Tara Anusthan Bhawan)
  weddingName: string;
  weddingNameHindi?: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  fullAddress: string;
  city: string;
  googleMapsUrl: string;
  // Countdown & RSVP
  countdownTargetISO: string;
  venueTimezone: string;
  venueTimezoneLabel: string;
  rsvpPhone: string;
  websiteTitle: string;
  hashtag: string;
  preferredLanguage: LanguageMode;
  sanskritInvocation: string;
  sanskritMeaning: string;
  familyInvitationWording: string;
  familyInvitationWordingHindi: string;
  optionalFamilyMessage: string;
  optionalFamilyMessageHindi: string;
  monogramInitials: string;
  events: WeddingEventItem[];
  gallery: GalleryPlateItem[];
}

/**
 * MAMPI WEDS DURGESH — OFFICIAL WEDDING CONFIGURATION
 * Dates: 22.11.2026 – 24.11.2026 · Rampurhat, Birbhum
 */
export const MAMPI_DURGESH_WEDDING_CONFIG: WeddingConfig = {
  guestName: 'Family & Friends',
  brideName: 'Mampi',
  brideNameHindi: 'माम्पी',
  groomName: 'Durgesh',
  groomNameHindi: 'दुर्गेश',
  brideFatherName: 'Lt. Saroj Kumar Sah',
  brideMotherName: 'Smt. Poonam Saw',
  groomFatherName: 'Lt. Vishwanath Keshri',
  groomMotherName: 'Lt. Shobha Devi',

  // Scene 2 (22.11.2026 — Mehendi)
  haldiName: 'Mehendi',
  haldiNameHindi: 'मेहंदी रस्म',
  haldiDate: '22.11.2026 (Sunday)',
  haldiTime: 'Auspicious Timing Onwards',
  haldiVenue: 'Own House, Rampurhat',
  haldiMapUrl: 'https://www.google.com/maps/search/?api=1&query=Sanghata+Para+Rampurhat+Birbhum',

  // Scene 3 (23.11.2026 — Satyanarayan Pujan, Matkor, Ghee Dhari & Haldi)
  receptionName: 'Satyanarayan Pujan, Matkor, Ghee Dhari & Haldi',
  receptionNameHindi: 'सत्यनारायण पूजन, मटकोर, घी ढारी एवं हल्दी',
  receptionDate: '23.11.2026 (Monday)',
  receptionTime: 'Morning & Evening Auspicious Rituals',
  receptionVenue: 'Own House, Rampurhat',
  receptionMapUrl: 'https://www.google.com/maps/search/?api=1&query=Sanghata+Para+Rampurhat+Birbhum',

  // Scene 4 (24.11.2026 — Shubh Vivah / Wedding)
  weddingName: 'Shubh Vivah (Wedding)',
  weddingNameHindi: 'शुभ विवाह उत्सव',
  weddingDate: '24.11.2026 (Tuesday)',
  weddingTime: '7:00 PM Onwards',
  venueName: 'Jay Maa Tara Anusthan Bhawan',
  fullAddress: 'Sanghata Para, Rampurhat, Birbhum',
  city: 'Rampurhat',
  googleMapsUrl: 'https://maps.app.goo.gl/Fa4ui3bYUYRTfd4BA',

  // Live IST Countdown to 24 Nov 2026 at 7:00 PM IST
  countdownTargetISO: '2026-11-24T19:00:00+05:30',
  venueTimezone: 'Asia/Kolkata',
  venueTimezoneLabel: 'IST (UTC+05:30)',
  rsvpPhone: '',
  websiteTitle: 'Mampi Weds Durgesh',
  hashtag: '#MampiDurgeshKiShaadi',
  preferredLanguage: 'bilingual',
  sanskritInvocation: '|| श्री गणेशाय नमः || · || जय माँ तारा ||',
  sanskritMeaning: 'मंगलम् भगवान विष्णुः, मंगलम् गरुड़ध्वजः। मंगलम् पुण्डरीकाक्षः, मंगलाय तनो हरिः॥',
  familyInvitationWording:
    'With the divine grace of Maa Tara, the heavenly blessings of Late Shri Saroj Kumar Sah, Late Shri Vishwanath Keshri & Late Smt. Shobha Devi, and the warm love of Smt. Poonam Saw, we cordially invite you and your family to celebrate the sacred union of Mampi and Durgesh.\n\nYour gracious presence and heartfelt blessings will make these auspicious moments truly unforgettable.',
  familyInvitationWordingHindi:
    'माँ तारा की असीम कृपा, स्वर्गीय श्री सरोज कुमार साह, स्वर्गीय श्री विश्वनाथ केसरी एवं स्वर्गीय श्रीमती शोभा देवी के दिव्य आशीर्वाद तथा श्रीमती पूनम साव के स्नेहिल आमंत्रण के साथ, हम आपको माम्पी और दुर्गेश के पावन परिणय उत्सव में सपरिवार पधारने हेतु सादर आमंत्रित करते हैं।\n\nआपकी गरिमामयी उपस्थिति और शुभाशीष इस शुभ अवसर को और भी पावन बना देंगे।',
  optionalFamilyMessage:
    'Your presence and blessings are our greatest treasure as Mampi and Durgesh step into their new life together.',
  optionalFamilyMessageHindi:
    'आपका स्नेह और आशीर्वाद ही हमारे परिवार के लिए सबसे बड़ा उपहार है।',
  monogramInitials: 'M & D',
  events: [
    {
      id: 'mehendi',
      enabled: true,
      name: 'MEHENDI CEREMONY',
      nameHindi: 'मेहंदी उत्सव',
      subtitle: 'Henna Artistry, Folk Songs & Family Joy',
      subtitleHindi: 'रचती मेहंदी, लोकगीत और अपनों की खुशियाँ',
      date: '22.11.2026 (Sunday)',
      startTime: 'Daytime & Evening Festivities',
      endTime: 'Onwards',
      venueName: 'Own House (Sah Residence)',
      fullAddress: 'Rampurhat, Birbhum',
      dressCode: 'Shades of Emerald Green, Henna Olive & Festive Pastels',
      dressCodeHindi: 'हरा एवं पारंपरिक उत्सव परिधान',
      description:
        'An intimate celebration of intricate bridal mehendi, laughter, and cherished family traditions at our residence.',
      descriptionHindi:
        'निज निवास पर हाथों में रचती सुहाग की मेहंदी, मंगल गीतों और पारिवारिक हँसी-खुशी से सजा उत्सव।',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sanghata+Para+Rampurhat+Birbhum',
      accentHex: '#24392D',
      illustrationType: 'mehendi',
    },
    {
      id: 'haldi-pujan',
      enabled: true,
      name: 'SATYANARAYAN PUJAN, MATKOR, GHEE DHARI & HALDI',
      nameHindi: 'सत्यनारायण पूजन, मटकोर, घी ढारी एवं हल्दी',
      subtitle: 'Sacred Vedic Pujan, Traditional Matkor & Golden Haldi Blessings',
      subtitleHindi: 'पावन पूजन, पारंपरिक मटकोर, घी ढारी एवं हल्दी की रस्म',
      date: '23.11.2026 (Monday)',
      startTime: 'Morning Pujan & Auspicious Haldi Rituals',
      endTime: 'Onwards',
      venueName: 'Own House (Sah Residence)',
      fullAddress: 'Rampurhat, Birbhum',
      dressCode: 'Auspicious Marigold Yellow, Saffron, Ochre & Red',
      dressCodeHindi: 'पीला, केसरिया और पारंपरिक परिधान',
      description:
        'A deeply sacred day beginning with Shri Satyanarayan Katha & Pujan, followed by traditional Matkor, Ghee Dhari rituals, and the joyous Haldi ceremony.',
      descriptionHindi:
        'श्री सत्यनारायण कथा एवं पूजन से प्रारंभ होकर पारंपरिक मटकोर, घी ढारी और हल्दी की मंगलमय रस्मों का पावन दिवस।',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sanghata+Para+Rampurhat+Birbhum',
      accentHex: '#D49B35',
      illustrationType: 'haldi',
    },
    {
      id: 'wedding',
      enabled: true,
      name: 'SHUBH VIVAH (WEDDING CEREMONY)',
      nameHindi: 'शुभ विवाह समारोह',
      subtitle: 'Baraat Swagat, Jaimala, Sacred Pheras & Ashirwad',
      subtitleHindi: 'बारात स्वागत, शुभ वरमाला, सप्तपदी एवं आशीर्वाद',
      date: '24.11.2026 (Tuesday)',
      startTime: '7:00 PM Onwards',
      endTime: 'Auspicious Lagna Muhurat',
      venueName: 'Jay Maa Tara Anusthan Bhawan',
      fullAddress: 'Sanghata Para, Rampurhat, Birbhum',
      dressCode: 'Traditional Royal Indian Wedding Attire (Crimson, Gold & Silk)',
      dressCodeHindi: 'पारंपरिक भारतीय शाही परिधान',
      description:
        'The grand wedding celebration uniting Mampi and Durgesh under the sacred mandap with the blessings of Maa Tara and both families.',
      descriptionHindi:
        'जय माँ तारा अनुष्ठान भवन में बारात स्वागत, वरमाला एवं पवित्र वैदिक मंत्रोच्चार के साथ माम्पी और दुर्गेश का शुभ विवाह संस्कार।',
      googleMapsUrl: 'https://maps.app.goo.gl/Fa4ui3bYUYRTfd4BA',
      accentHex: '#C6A15B',
      illustrationType: 'wedding',
    },
  ],
  gallery: [
    {
      id: 'plate-1',
      title: 'Sacred Temple Gopuram & Lotus Pond',
      titleHindi: 'पवित्र मंदिर गोपुरम और कमल सरोवर',
      caption: 'Mampi Weds Durgesh — Auspicious Opening Scene (24.11.2026).',
      captionHindi: 'माम्पी संग दुर्गेश — पावन विवाह उत्सव का प्रथम दृश्य।',
      category: 'Opening Mangalam Scene',
      aspectRatio: 'feature',
      illustrationType: 'courtyard',
      isPlaceholderIllustration: false,
      photoUrl: 'https://cdn.akhyankriti.com/web-invites/templates/sacred-mangalam/frames/Full-desktop.df2c5fdbe477/hashed/0000.webp',
    },
    {
      id: 'plate-2',
      title: 'Nimantran Courtyard — Sah & Keshri Families',
      titleHindi: 'साह एवं केसरी परिवार का स्नेहिल आमंत्रण',
      caption: 'Cordial family invitation honoring our beloved elders.',
      captionHindi: 'हमारे पूजनीय पूर्वजों के आशीर्वाद सहित सादर आमंत्रण।',
      category: 'Family Invitation Scene',
      aspectRatio: 'portrait',
      illustrationType: 'jharokha',
      isPlaceholderIllustration: false,
      photoUrl: 'https://cdn.akhyankriti.com/web-invites/templates/sacred-mangalam/frames/Full-desktop.df2c5fdbe477/hashed/0130.webp',
    },
    {
      id: 'plate-3',
      title: 'Mehendi & Haldi Celebrations (22–23 Nov 2026)',
      titleHindi: 'मेहंदी, सत्यनारायण पूजन, मटकोर एवं हल्दी (22–23 नवंबर)',
      caption: 'Sacred home rituals filled with marigolds, henna, and devotion.',
      captionHindi: 'निज निवास पर मेहंदी, पूजन, मटकोर, घी ढारी और हल्दी की रस्में।',
      category: 'Pre-Wedding Rituals',
      aspectRatio: 'portrait',
      illustrationType: 'archway',
      isPlaceholderIllustration: false,
      photoUrl: 'https://cdn.akhyankriti.com/web-invites/templates/sacred-mangalam/frames/Full-desktop.df2c5fdbe477/hashed/0190.webp',
    },
    {
      id: 'plate-4',
      title: 'Festive Evening Gathering',
      titleHindi: 'मंगल संध्या एवं परिवार मिलन',
      caption: 'Celebrating the union of two families in Rampurhat.',
      captionHindi: 'रामपुरहाट में दोनों परिवारों के मिलन की मधुर संध्या।',
      category: 'Celebration Scene',
      aspectRatio: 'landscape',
      illustrationType: 'sheeshmahal',
      isPlaceholderIllustration: false,
      photoUrl: 'https://cdn.akhyankriti.com/web-invites/templates/sacred-mangalam/frames/Full-desktop.df2c5fdbe477/hashed/0310.webp',
    },
    {
      id: 'plate-5',
      title: 'Shubh Vivah at Jay Maa Tara Anusthan Bhawan',
      titleHindi: 'जय माँ तारा अनुष्ठान भवन में शुभ विवाह (24.11.2026)',
      caption: 'Sanghata Para, Rampurhat, Birbhum · 7:00 PM Onwards.',
      captionHindi: 'संघता पारा, रामपुरहाट, बीरभूम · सायं 7:00 बजे से।',
      category: 'Wedding Mandap Scene',
      aspectRatio: 'landscape',
      illustrationType: 'mandap',
      isPlaceholderIllustration: false,
      photoUrl: 'https://cdn.akhyankriti.com/web-invites/templates/sacred-mangalam/frames/Full-desktop.df2c5fdbe477/hashed/0374.webp',
    },
  ],
};

export const SACRED_MANGALAM_DEMO_CONFIG: WeddingConfig = MAMPI_DURGESH_WEDDING_CONFIG;
export const DEFAULT_WEDDING_CONFIG: WeddingConfig = MAMPI_DURGESH_WEDDING_CONFIG;
