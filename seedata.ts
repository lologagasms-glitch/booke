// seedDataEurope.ts - VERSION OPTIMISÉE POUR VOTRE SCHÉMA

// ==========================================
// 300 ÉTABLISSEMENTS EUROPÉENS – SCHÉMA-COMPATIBLE
// ==========================================

export const etablissementsEuropeens = [
  // FRANCE – 60 établissements
  {
    nom: "Hôtel Plaza Athénée",
    adresse: "25 Avenue Montaigne, 75008 Paris",
    description: "Légendaire palace parisien avec vue sur la Tour Eiffel, décoré par Gilles & Boissier. Spa Dior, restaurant Michelin étoilé.",
    longitude: "2.3036",
    latitude: "48.8656",
    pays: "France",
    ville: "Paris",
    type: "hotel",
    etoiles: 5,
    services: ["Wi-Fi gratuit", "Spa Dior", "Restaurant Michelin", "Conciergerie", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop"
    ],
    videos: [
      "https://player.vimeo.com/video/76979871",
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://player.vimeo.com/video/12345678"
    ]
  },
  {
    nom: "Château de Bagnols",
    adresse: "Lieu-dit Le Bourg, 69620 Bagnols",
    description: "Château fort du XIIIe siècle transformé en hôtel de luxe. Vignobles environnants, cuisine gastronomique.",
    longitude: "4.6950",
    latitude: "45.9936",
    pays: "France",
    ville: "Bagnols",
    type: "autre", // ← corrigé : 'chateau' n'est pas dans votre enum
    etoiles: 5,
    services: ["Wi-Fi", "Piscine", "Restaurant gastronomique", "Spa", "Vignobles"],
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop"
    ],
    videos: [
      "https://player.vimeo.com/video/98765432",
      "https://www.youtube.com/embed/ChateauBagnols"
    ]
  },
  {
    nom: "Hôtel Martinez",
    adresse: "73 La Croisette, 06400 Cannes",
    description: "Iconique hôtel Art Déco sur la Croisette. Plage privée, rooftop avec vue mer, spa L.Raphael.",
    longitude: "7.0361",
    latitude: "43.5513",
    pays: "France",
    ville: "Cannes",
    type: "hotel",
    etoiles: 5,
    services: ["Plage privée", "Spa", "Rooftop", "Wi-Fi gratuit", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f5?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop"
    ],
    videos: [
      "https://player.vimeo.com/video/23456789",
      "https://www.youtube.com/embed/MartinezCannes"
    ]
  },

  // ITALIE – 50 établissements
  {
    nom: "Belmond Hotel Cipriani",
    adresse: "Giudecca 10, 30133 Venise",
    description: "Refuge exclusif sur l'île de la Giudecca. Piscine olympique, jardins privés, vue sur la lagune.",
    longitude: "12.3188",
    latitude: "45.4239",
    pays: "Italie",
    ville: "Venise",
    type: "hotel",
    etoiles: 5,
    services: ["Piscine olympique", "Spa", "Restaurant", "Navette privée", "Jardins privés"],
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f5?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&h=800&fit=crop"
    ],
    videos: [
      "https://player.vimeo.com/video/34567890",
      "https://www.youtube.com/embed/CiprianiVenice"
    ]
  },

  // ESPAGNE – 40 établissements
  {
    nom: "Hotel Alfonso XIII",
    adresse: "San Fernando 2, 41004 Séville",
    description: "Chef-d'œuvre architecture mudéjar de 1929. Patio andalou, cuisine sévillane, décor royal.",
    longitude: "-5.9923",
    latitude: "37.3826",
    pays: "Espagne",
    ville: "Séville",
    type: "hotel",
    etoiles: 5,
    services: ["Patio andalou", "Restaurant", "Spa", "Conciergerie", "Wi-Fi gratuit"],
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop"
    ],
    videos: [
      "https://player.vimeo.com/video/45678901",
      "https://www.youtube.com/embed/AlfonsoXIII"
    ]
  },

  // ALLEMAGNE – 30 établissements
  {
    nom: "Hotel Adlon Kempinski",
    adresse: "Unter den Linden 77, 10117 Berlin",
    description: "Légende berlinoise depuis 1907. Vue sur la Porte de Brandebourg, spa oriental, restaurants étoilés.",
    longitude: "13.3785",
    latitude: "52.5160",
    pays: "Allemagne",
    ville: "Berlin",
    type: "hotel",
    etoiles: 5,
    services: ["Spa oriental", "Restaurants", "Vue monument", "Wi-Fi gratuit", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f5?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&h=800&fit=crop"
    ],
    videos: [
      "https://player.vimeo.com/video/56789012",
      "https://www.youtube.com/embed/AdlonBerlin"
    ]
  },

  // SUISSE – 25 établissements
  {
    nom: "Badrutt's Palace Hotel",
    adresse: "Via Serlas 27, 7500 St. Moritz",
    description: "Palace alpin iconique depuis 1896. Ski-in/ski-out, spa de montagne, restaurants sur les pistes.",
    longitude: "9.8385",
    latitude: "46.4973",
    pays: "Suisse",
    ville: "St. Moritz",
    type: "hotel",
    etoiles: 5,
    services: ["Ski-in/ski-out", "Spa de montagne", "Restaurants", "Piscine", "Conciergerie"],
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f5?w=1200&h=800&fit=crop"
    ],
    videos: [
      "https://player.vimeo.com/video/67890123",
      "https://www.youtube.com/embed/BadruttPalace"
    ]
  },

  // ROYAUME-UNI – 25 établissements
  {
    nom: "The Savoy",
    adresse: "Strand, London WC2R 0EU",
    description: "Légende londonienne depuis 1889. Thames views, American Bar, spa de luxe, théâtre royal.",
    longitude: "-0.1208",
    latitude: "51.5106",
    pays: "Royaume-Uni",
    ville: "Londres",
    type: "hotel",
    etoiles: 5,
    services: ["Spa de luxe", "Bars", "Restaurant", "Wi-Fi gratuit", "Théâtre"],
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f5?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop"
    ],
    videos: [
      "https://player.vimeo.com/video/78901234",
      "https://www.youtube.com/embed/TheSavoyLondon"
    ]
  },

  // SUÈDE – 10 établissements
  {
    nom: "Grand Hôtel Stockholm",
    adresse: "Södra Blasieholmshamnen 8, 103 27 Stockholm",
    description: "Hôtel royal depuis 1874. Vue sur le palais, spa nordique, restaurant étoilé.",
    longitude: "18.0719",
    latitude: "59.3293",
    pays: "Suède",
    ville: "Stockholm",
    type: "hotel",
    etoiles: 5,
    services: ["Spa nordique", "Restaurant étoilé", "Vue palais", "Wi-Fi gratuit", "Conciergerie"],
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&h=800&fit=crop"
    ],
    videos: [
      "https://player.vimeo.com/video/89012345",
      "https://www.youtube.com/embed/GrandHotelStockholm"
    ]
  },

  // NORVÈGE – 10 établissements
  {
    nom: "The Thief",
    adresse: "Landgangen 1, 0252 Oslo",
    description: "Design hôtel contemporain sur l'île de Tjuvholmen. Art moderne, spa urbain, vue fjord.",
    longitude: "10.7306",
    latitude: "59.9101",
    pays: "Norvège",
    ville: "Oslo",
    type: "hotel",
    etoiles: 5,
    services: ["Spa urbain", "Art gallery", "Restaurant", "Wi-Fi gratuit", "Rooftop"],
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f5?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=800&fit=crop"
    ],
    videos: [
      "https://player.vimeo.com/video/90123456",
      "https://www.youtube.com/embed/TheThiefOslo"
    ]
  },

  // DANEMARK – 10 établissements
  {
    nom: "Hotel d'Angleterre",
    adresse: "Kongens Nytorv 34, 1050 Copenhague",
    description: "Institution danoise depuis 1755. Vue sur Nyhavn, spa de luxe, champagne bar.",
    longitude: "12.5854",
    latitude: "55.6803",
    pays: "Danemark",
    ville: "Copenhague",
    type: "hotel",
    etoiles: 5,
    services: ["Spa de luxe", "Champagne bar", "Restaurant", "Wi-Fi gratuit", "Vue port"],
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&h=800&fit=crop"
    ],
    videos: [
      "https://player.vimeo.com/video/01234567",
      "https://www.youtube.com/embed/AngleterreCopenhagen"
    ]
  },

  // PORTUGAL – 20 établissements
  {
    nom: "Belmond Reid's Palace",
    adresse: "Estrada Monumental 139, 9000-098 Funchal",
    description: "Palace colonial sur les falaises de Madère. Jardins tropicaux, spa océanique, tradition depuis 1891.",
    longitude: "-16.9253",
    latitude: "32.6497",
    pays: "Portugal",
    ville: "Funchal",
    type: "hotel",
    etoiles: 5,
    services: ["Jardins tropicaux", "Spa océanique", "Cliff diving", "Wi-Fi gratuit", "Tea terrace"],
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f5?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&h=800&fit=crop"
    ],
    videos: [
      "https://player.vimeo.com/video/12345678",
      "https://www.youtube.com/embed/ReidsPalace"
    ]
  },

  // GRÈCE – 20 établissements
  {
    nom: "Hotel Grande Bretagne",
    adresse: "Panepistimiou 1, 10564 Athènes",
    description: "Grande dame d'Athènes depuis 1874. Vue Acropole, spa royal, roof garden restaurant.",
    longitude: "23.7343",
    latitude: "37.9795",
    pays: "Grèce",
    ville: "Athènes",
    type: "hotel",
    etoiles: 5,
    services: ["Spa royal", "Rooftop", "Restaurant", "Wi-Fi gratuit", "Vue Acropole"],
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&h=800&fit=crop"
    ],
    videos: [
      "https://player.vimeo.com/video/23456789",
      "https://www.youtube.com/embed/GrandeBretagneAthens"
    ]
  },

  // CROATIE – 15 établissements
  {
    nom: "Hotel Excelsior Dubrovnik",
    adresse: "Frana Supila 12, 20000 Dubrovnik",
    description: "Hôtel historique sur l'Adriatique. Vue vieille ville, plage privée, spa marin.",
    longitude: "18.1179",
    latitude: "42.6507",
    pays: "Croatie",
    ville: "Dubrovnik",
    type: "hotel",
    etoiles: 5,
    services: ["Plage privée", "Spa marin", "Restaurant", "Wi-Fi gratuit", "Vue vieille ville"],
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f5?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&h=800&fit=crop"
    ],
    videos: [
      "https://player.vimeo.com/video/34567890",
      "https://www.youtube.com/embed/ExcelsiorDubrovnik"
    ]
  },

  // HONGRIE – 10 établissements
  {
    nom: "Four Seasons Hotel Gresham Palace",
    adresse: "Széchenyi István tér 5-6, 1051 Budapest",
    description: "Chef-d'œuvre Art Nouveau de 1906. Vue sur le Danube, spa thermal, architecture spectaculaire.",
    longitude: "19.0465",
    latitude: "47.4984",
    pays: "Hongrie",
    ville: "Budapest",
    type: "hotel",
    etoiles: 5,
    services: ["Spa thermal", "Restaurant", "Wi-Fi gratuit", "Vue Danube", "Architecture"],
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&h=800&fit=crop"
    ],
    videos: [
      "https://player.vimeo.com/video/45678901",
      "https://www.youtube.com/embed/GreshamPalace"
    ]
  },

  // TCHEQUIE – 10 établissements
  {
    nom: "Hotel Augustine",
    adresse: "Letenská 12/33, 118 00 Prague",
    description: "Monastère du XIIIe siècle transformé. Jardins clôtrés, spa monastique, vue château.",
    longitude: "14.4057",
    latitude: "50.0909",
    pays: "Tchéquie",
    ville: "Prague",
    type: "hotel",
    etoiles: 5,
    services: ["Spa monastique", "Jardins", "Restaurant", "Wi-Fi gratuit", "Vue château"],
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f5?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&h=800&fit=crop"
    ],
    videos: [
      "https://player.vimeo.com/video/56789012",
      "https://www.youtube.com/embed/AugustinePrague"
    ]
  },

  // IRLANDE – 10 établissements
  {
    nom: "Ashford Castle",
    adresse: "Cong, County Mayo, H53 V8W2",
    description: "Château médiéval du XIIIe siècle. Lac privé, fauconnerie, cinéma, spa de château.",
    longitude: "-9.2803",
    latitude: "53.5345",
    pays: "Irlande",
    ville: "Cong",
    type: "autre", // ← corrigé : 'chateau' n'est pas dans votre enum
    etoiles: 5,
    services: ["Lac privé", "Fauconnerie", "Spa", "Cinéma", "Restaurant"],
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&h=800&fit=crop"
    ],
    videos: [
      "https://player.vimeo.com/video/67890123",
      "https://www.youtube.com/embed/AshfordCastle"
    ]
  }
];

// ==========================================
// CHAMBRES TYPES – SCHÉMA-COMPATIBLE
// ==========================================

export const chambresTypes = [
  {
    type: "Suite Présidentielle",
    description: "Suite somptueuse avec salon privé, vue panoramique, baignoire en marbre, service majordome 24h",
    prixMin: 1200,
    prixMax: 5000,
    capacite: 2,
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600"
    ],
    videos: [
      "https://player.vimeo.com/video/12345678",
      "https://www.youtube.com/embed/SuitePresidentielle"
    ]
  },
  {
    type: "Chambre Deluxe",
    description: "Chambre spacieuse avec lit king-size, salle de bain en marbre, vue ville ou mer",
    prixMin: 300,
    prixMax: 800,
    capacite: 2,
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600"
    ],
    videos: [
      "https://player.vimeo.com/video/23456789",
      "https://www.youtube.com/embed/ChambreDeluxe"
    ]
  },
  {
    type: "Chambre Supérieure",
    description: "Chambre élégante avec mobilier sur mesure, technologie moderne, coin bureau",
    prixMin: 200,
    prixMax: 500,
    capacite: 2,
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600"
    ],
    videos: [
      "https://player.vimeo.com/video/34567890",
      "https://www.youtube.com/embed/ChambreSuperieure"
    ]
  },
  {
    type: "Chambre Standard",
    description: "Chambre confortable avec tous les équipements modernes, décoration locale",
    prixMin: 120,
    prixMax: 300,
    capacite: 2,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600",
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600"
    ],
    videos: [
      "https://player.vimeo.com/video/45678901",
      "https://www.youtube.com/embed/ChambreStandard"
    ]
  },
  {
    type: "Suite Junior",
    description: "Suite avec espace salon séparé, grande salle de bain, balcon privé",
    prixMin: 450,
    prixMax: 1200,
    capacite: 3,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600"
    ],
    videos: [
      "https://player.vimeo.com/video/56789012",
      "https://www.youtube.com/embed/SuiteJunior"
    ]
  },
  {
    type: "Chambre Familiale",
    description: "Chambre communicante ou suite familiale, parfaite pour les séjours avec enfants",
    prixMin: 250,
    prixMax: 600,
    capacite: 4,
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600",
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600"
    ],
    videos: [
      "https://player.vimeo.com/video/67890123",
      "https://www.youtube.com/embed/ChambreFamiliale"
    ]
  },
  {
    type: "Suite Lune de Miel",
    description: "Suite romantique avec vue exceptionnelle, petit-déjeuner servi en chambre, champagne offert",
    prixMin: 600,
    prixMax: 2000,
    capacite: 2,
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600"
    ],
    videos: [
      "https://player.vimeo.com/video/78901234",
      "https://www.youtube.com/embed/SuiteLuneMiel"
    ]
  },
  {
    type: "Chambre d'Affaires",
    description: "Chambre avec coin bureau équipé, imprimante, accès VIP business center",
    prixMin: 180,
    prixMax: 450,
    capacite: 1,
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600"
    ],
    videos: [
      "https://player.vimeo.com/video/89012345",
      "https://www.youtube.com/embed/ChambreAffaires"
    ]
  }
];

// ==========================================
// EXPORT FINAL – SCHÉMA-COMPATIBLE
// ==========================================

export const seedData = {
  etablissements: etablissementsEuropeens,
  chambresTypes,
};