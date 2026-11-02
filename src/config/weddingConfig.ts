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
  // Haldi Hold Scene
  haldiName: string;
  haldiDate: string;
  haldiTime: string;
  haldiVenue: string;
  haldiMapUrl: string;
  // Reception Hold Scene
  receptionName: string;
  receptionDate: string;
  receptionTime: string;
  receptionVenue: string;
  receptionMapUrl: string;
  // Wedding Hold Scene
  weddingName: string;
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
 * SACRED MANGALAM TEMPLATE DEFAULT CONFIGURATION (Matching akhyankriti.com/invites/sacred-mangalam-template)
 * Switchable in 1 click to strict [BRIDE NAME] / [GROOM NAME] placeholders in the top bar or editor.
 */
export const SACRED_MANGALAM_DEMO_CONFIG: WeddingConfig = {
  guestName: 'Guest',
  brideName: 'Ananya',
  brideNameHindi: 'अनन्या',
  groomName: 'Rohan',
  groomNameHindi: 'रोहन',
  brideFatherName: 'Mr. Rajesh Iyer',
  brideMotherName: 'Mrs. Lakshmi Iyer',
  groomFatherName: 'Mr. Suresh Menon',
  groomMotherName: 'Mrs. Priya Menon',
  haldiName: 'Haldi',
  haldiDate: '10 December 2027',
  haldiTime: '10:00 AM onwards',
  haldiVenue: 'Self Residence',
  haldiMapUrl: 'https://www.google.com/maps/search/?api=1&query=Chennai',
  receptionName: 'Reception',
  receptionDate: '11 December 2027',
  receptionTime: '7:00 PM onwards',
  receptionVenue: 'Taj Hotel',
  receptionMapUrl: 'https://www.google.com/maps/search/?api=1&query=Taj+Hotel+Chennai',
  weddingName: 'Wedding',
  weddingDate: '12 December 2027',
  weddingTime: '9:30 AM (Muhurtham)',
  venueName: 'Sri Kapaleeshwarar Temple',
  fullAddress: 'Mylapore, Chennai',
  city: 'Chennai',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sri+Kapaleeshwarar+Temple',
  countdownTargetISO: '2027-12-12T09:30:00+05:30',
  venueTimezone: 'Asia/Kolkata',
  venueTimezoneLabel: 'IST (UTC+05:30)',
  rsvpPhone: '+91 98765 43210',
  websiteTitle: 'Ananya Weds Rohan',
  hashtag: '#AnanyaRohanMangalam',
  preferredLanguage: 'bilingual',
  sanskritInvocation: '|| श्री गणेशाय नमः ||',
  sanskritMeaning: 'मंगलम् भगवान विष्णुः, मंगलम् गरुड़ध्वजः। मंगलम् पुण्डरीकाक्षः, मंगलाय तनो हरिः॥',
  familyInvitationWording:
    'With immense joy and the blessings of our beloved elders, we invite you to join us as our families come together to celebrate a beautiful new beginning.\n\nYour presence, love and blessings will make this occasion even more special.',
  familyInvitationWordingHindi:
    'हमारे पूजनीय बुजुर्गों के आशीर्वाद और असीम हर्ष के साथ, हम आपको हमारे परिवारों के इस पावन मिलन और एक सुंदर नई शुरुआत के उत्सव में शामिल होने के लिए सादर आमंत्रित करते हैं।',
  optionalFamilyMessage: 'We would be honoured by your presence and blessings.',
  optionalFamilyMessageHindi: 'आपकी गरिमामयी उपस्थिति और आशीर्वाद की प्रतीक्षा में।',
  monogramInitials: 'A & R',
  events: [
    {
      id: 'haldi',
      enabled: true,
      name: 'HALDI',
      nameHindi: 'हल्दी उत्सव',
      subtitle: 'Golden Blessings & Marigold Courtyards',
      subtitleHindi: 'पीले फूलों और खुशियों की फुहार',
      date: '10 December 2027',
      startTime: '10:00 AM onwards',
      venueName: 'Self Residence',
      fullAddress: 'Chennai',
      dressCode: 'Sunlit Yellow, Marigold & Ivory',
      dressCodeHindi: 'पीला और केसरिया परिधान',
      description: 'A joyful celebration filled with sunshine, turmeric, marigolds and family laughter.',
      descriptionHindi: 'हल्दी की शुभ्रता, गेंदे के फूलों और परिवार की हँसी-खुशी से भरा एक आनंदमय उत्सव।',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chennai',
      accentHex: '#D49B35',
      illustrationType: 'haldi',
    },
    {
      id: 'reception',
      enabled: true,
      name: 'RECEPTION',
      nameHindi: 'प्रीतिभोज (रिसेप्शन)',
      subtitle: 'An Evening of Music, Lights & Blessings',
      subtitleHindi: 'नवदंपति का स्वागत एवं शाही रात्रिभोज',
      date: '11 December 2027',
      startTime: '7:00 PM onwards',
      venueName: 'Taj Hotel',
      fullAddress: 'Chennai',
      dressCode: 'Royal Silk, Velvet & Formal Evening Attire',
      dressCodeHindi: 'शाही औपचारिक परिधान',
      description: 'An evening to celebrate with family, friends, music and joyous festivities.',
      descriptionHindi: 'परिवार और मित्रों के साथ उत्सव की एक गरिमामयी शाम।',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Taj+Hotel+Chennai',
      accentHex: '#C6A15B',
      illustrationType: 'reception',
    },
    {
      id: 'wedding',
      enabled: true,
      name: 'WEDDING MUHURTHAM',
      nameHindi: 'शुभ विवाह मुहूर्त',
      subtitle: 'Sacred Mangalam Rituals & Temple Blessings',
      subtitleHindi: 'पवित्र वैदिक रीति-रिवाज एवं मांगल्य धारणम्',
      date: '12 December 2027',
      startTime: '9:30 AM (Muhurtham)',
      venueName: 'Sri Kapaleeshwarar Temple',
      fullAddress: 'Mylapore, Chennai',
      dressCode: 'Traditional Kanjeevaram Silk & Veshti / Royal Heritage Attire',
      dressCodeHindi: 'पारंपरिक भारतीय रेशमी परिधान',
      description: 'The sacred rituals, the blessings of our families and the beginning of a new chapter.',
      descriptionHindi: 'पवित्र वैदिक रीति-रिवाज, बुजुर्गों का आशीर्वाद और नए अध्याय का शुभारंभ।',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sri+Kapaleeshwarar+Temple',
      accentHex: '#B87978',
      illustrationType: 'wedding',
    },
  ],
  gallery: [
    {
      id: 'plate-1',
      title: 'Sacred Temple Gopuram & Lotus Pond',
      titleHindi: 'पवित्र मंदिर गोपुरम और कमल सरोवर',
      caption: 'Opening frame from the Sacred Mangalam wedding film.',
      captionHindi: 'पवित्र मंगलम् विवाह फिल्म का प्रथम दृश्य।',
      category: 'Opening Mangalam Scene',
      aspectRatio: 'feature',
      illustrationType: 'courtyard',
      isPlaceholderIllustration: false,
      photoUrl: 'https://cdn.akhyankriti.com/web-invites/templates/sacred-mangalam/frames/Full-desktop.df2c5fdbe477/hashed/0000.webp',
    },
    {
      id: 'plate-2',
      title: 'The Royal Family Invitation Courtyard',
      titleHindi: 'शाही पारिवारिक निमंत्रण प्रांगण',
      caption: 'Scene II — Cordial invitation with parental blessings.',
      captionHindi: 'दृश्य II — माता-पिता के आशीर्वाद सहित स्नेहिल आमंत्रण।',
      category: 'Invitation Hold Scene',
      aspectRatio: 'portrait',
      illustrationType: 'jharokha',
      isPlaceholderIllustration: false,
      photoUrl: 'https://cdn.akhyankriti.com/web-invites/templates/sacred-mangalam/frames/Full-desktop.df2c5fdbe477/hashed/0130.webp',
    },
    {
      id: 'plate-3',
      title: 'Sunlit Haldi Marigold Celebration',
      titleHindi: 'हल्दी उत्सव का सुनहरा प्रांगण',
      caption: 'Scene III — Vibrant marigold and turmeric festivities.',
      captionHindi: 'दृश्य III — हल्दी और गेंदे के फूलों का उत्सव।',
      category: 'Haldi Hold Scene',
      aspectRatio: 'portrait',
      illustrationType: 'archway',
      isPlaceholderIllustration: false,
      photoUrl: 'https://cdn.akhyankriti.com/web-invites/templates/sacred-mangalam/frames/Full-desktop.df2c5fdbe477/hashed/0190.webp',
    },
    {
      id: 'plate-4',
      title: 'Grand Evening Reception Stage',
      titleHindi: 'भव्य रिसेप्शन संध्या मंच',
      caption: 'Scene IV — Illuminated evening reception under chandeliers.',
      captionHindi: 'दृश्य IV — दीपों और झूमरों से सजी स्वागत संध्या।',
      category: 'Reception Hold Scene',
      aspectRatio: 'landscape',
      illustrationType: 'sheeshmahal',
      isPlaceholderIllustration: false,
      photoUrl: 'https://cdn.akhyankriti.com/web-invites/templates/sacred-mangalam/frames/Full-desktop.df2c5fdbe477/hashed/0310.webp',
    },
    {
      id: 'plate-5',
      title: 'Sacred Wedding Muhurtham Mandapam',
      titleHindi: 'पवित्र विवाह मुहूर्त मंडपम',
      caption: 'Scene V — The sacred temple mandapam ceremony.',
      captionHindi: 'दृश्य V — पवित्र मंदिर मंडप में शुभ विवाह संस्कार।',
      category: 'Wedding Muhurtham Scene',
      aspectRatio: 'landscape',
      illustrationType: 'mandap',
      isPlaceholderIllustration: false,
      photoUrl: 'https://cdn.akhyankriti.com/web-invites/templates/sacred-mangalam/frames/Full-desktop.df2c5fdbe477/hashed/0374.webp',
    },
  ],
};

/**
 * STRICT PLACEHOLDER CONFIGURATION (With [BRIDE NAME], [GROOM NAME], etc.)
 */
export const DEFAULT_WEDDING_CONFIG: WeddingConfig = {
  ...SACRED_MANGALAM_DEMO_CONFIG,
  guestName: 'Guest',
  brideName: '[BRIDE NAME]',
  brideNameHindi: '[दुल्हन का नाम]',
  groomName: '[GROOM NAME]',
  groomNameHindi: '[दूल्हे का नाम]',
  brideFatherName: "[FATHER'S NAME]",
  brideMotherName: "[MOTHER'S NAME]",
  groomFatherName: "[GROOM'S FATHER'S NAME]",
  groomMotherName: "[GROOM'S MOTHER'S NAME]",
  haldiName: 'Haldi',
  haldiDate: '[WEDDING DATE]',
  haldiTime: '[WEDDING TIME]',
  haldiVenue: '[VENUE NAME]',
  haldiMapUrl: '[GOOGLE MAPS URL]',
  receptionName: 'Reception',
  receptionDate: '[WEDDING DATE]',
  receptionTime: '[WEDDING TIME]',
  receptionVenue: '[VENUE NAME]',
  receptionMapUrl: '[GOOGLE MAPS URL]',
  weddingName: 'Wedding',
  weddingDate: '[WEDDING DATE]',
  weddingTime: '[WEDDING TIME]',
  venueName: '[VENUE NAME]',
  fullAddress: '[FULL ADDRESS]',
  city: '[CITY]',
  googleMapsUrl: '[GOOGLE MAPS URL]',
  rsvpPhone: '[PHONE NUMBER]',
  websiteTitle: '[BRIDE NAME] WEDS [GROOM NAME]',
  hashtag: '[HASHTAG]',
  optionalFamilyMessage: '[OPTIONAL FAMILY MESSAGE]',
  monogramInitials: 'B & G',
};
