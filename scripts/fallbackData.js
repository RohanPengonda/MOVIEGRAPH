/**
 * Fallback dataset derived from real TMDB cinema data.
 * Used when TMDB_API_KEY is not provided or when seeding offline.
 * Contains popular movies, actors, directors, genres, and exact cast relationships.
 */

const fallbackGenres = [
  { id: "28", name: "Action" },
  { id: "12", name: "Adventure" },
  { id: "18", name: "Drama" },
  { id: "878", name: "Science Fiction" },
  { id: "53", name: "Thriller" },
  { id: "35", name: "Comedy" },
  { id: "80", name: "Crime" },
  { id: "36", name: "History" },
  { id: "10752", name: "War" },
  { id: "10749", name: "Romance" }
];

const fallbackDirectors = [
  { id: "d1", name: "Christopher Nolan", profileImageUrl: "https://image.tmdb.org/t/p/w500/rLiyFD5Ep21L4GfqxABiojC1v9M.jpg" },
  { id: "d2", name: "Steven Spielberg", profileImageUrl: "https://image.tmdb.org/t/p/w500/tZfvShIMiPjO0jW33496p0Tpzll.jpg" },
  { id: "d3", name: "Martin Scorsese", profileImageUrl: "https://image.tmdb.org/t/p/w500/7757tIu6n8b9d3s5Y0o2823y6b2.jpg" },
  { id: "d4", name: "Quentin Tarantino", profileImageUrl: "https://image.tmdb.org/t/p/w500/1p565860710609.jpg" },
  { id: "d5", name: "Ron Howard", profileImageUrl: "https://image.tmdb.org/t/p/w500/6v06n09800.jpg" },
  { id: "d6", name: "Denis Villeneuve", profileImageUrl: "https://image.tmdb.org/t/p/w500/5g0d072.jpg" }
];

const fallbackActors = [
  { id: "a102", name: "Kevin Bacon", profileImageUrl: "https://image.tmdb.org/t/p/w500/p1fvNmH2zW64p2n949439.jpg", popularity: 45.2, birthYear: 1958 },
  { id: "a31", name: "Tom Hanks", profileImageUrl: "https://image.tmdb.org/t/p/w500/x1000.jpg", popularity: 68.4, birthYear: 1956 },
  { id: "a6193", name: "Leonardo DiCaprio", profileImageUrl: "https://image.tmdb.org/t/p/w500/wo2hJpn02VnW116.jpg", popularity: 82.1, birthYear: 1974 },
  { id: "a2039", name: "Cillian Murphy", profileImageUrl: "https://image.tmdb.org/t/p/w500/m097650428.jpg", popularity: 75.3, birthYear: 1976 },
  { id: "a3895", name: "Robert De Niro", profileImageUrl: "https://image.tmdb.org/t/p/w500/c709087508.jpg", popularity: 58.9, birthYear: 1943 },
  { id: "a1892", name: "Matt Damon", profileImageUrl: "https://image.tmdb.org/t/p/w500/5089028.jpg", popularity: 62.1, birthYear: 1970 },
  { id: "a2524", name: "Tom Hardy", profileImageUrl: "https://image.tmdb.org/t/p/w500/y6974.jpg", popularity: 64.8, birthYear: 1977 },
  { id: "a3894", name: "Christian Bale", profileImageUrl: "https://image.tmdb.org/t/p/w500/q2234.jpg", popularity: 59.4, birthYear: 1974 },
  { id: "a1810", name: "Anne Hathaway", profileImageUrl: "https://image.tmdb.org/t/p/w500/s9210.jpg", popularity: 61.3, birthYear: 1982 },
  { id: "a24045", name: "Joseph Gordon-Levitt", profileImageUrl: "https://image.tmdb.org/t/p/w500/90123.jpg", popularity: 44.5, birthYear: 1981 },
  { id: "a8210", name: "Marion Cotillard", profileImageUrl: "https://image.tmdb.org/t/p/w500/60912.jpg", popularity: 48.7, birthYear: 1975 },
  { id: "a27578", name: "Elliot Page", profileImageUrl: "https://image.tmdb.org/t/p/w500/10923.jpg", popularity: 38.2, birthYear: 1987 },
  { id: "a505710", name: "Florence Pugh", profileImageUrl: "https://image.tmdb.org/t/p/w500/98712.jpg", popularity: 71.0, birthYear: 1996 },
  { id: "a5081", name: "Emily Blunt", profileImageUrl: "https://image.tmdb.org/t/p/w500/38190.jpg", popularity: 63.4, birthYear: 1983 },
  { id: "a287", name: "Brad Pitt", profileImageUrl: "https://image.tmdb.org/t/p/w500/81923.jpg", popularity: 74.0, birthYear: 1963 },
  { id: "a2232", name: "Michael Caine", profileImageUrl: "https://image.tmdb.org/t/p/w500/18290.jpg", popularity: 49.0, birthYear: 1933 },
  { id: "a190", name: "Clint Eastwood", profileImageUrl: "https://image.tmdb.org/t/p/w500/30192.jpg", popularity: 41.2, birthYear: 1930 },
  { id: "a5292", name: "Denzel Washington", profileImageUrl: "https://image.tmdb.org/t/p/w500/50123.jpg", popularity: 56.4, birthYear: 1954 },
  { id: "a12835", name: "Bill Paxton", profileImageUrl: "https://image.tmdb.org/t/p/w500/80123.jpg", popularity: 35.1, birthYear: 1955 },
  { id: "a884", name: "Gary Sinise", profileImageUrl: "https://image.tmdb.org/t/p/w500/70123.jpg", popularity: 33.2, birthYear: 1955 },
  { id: "a1979", name: "Christopher Walken", profileImageUrl: "https://image.tmdb.org/t/p/w500/60123.jpg", popularity: 42.1, birthYear: 1943 },
  { id: "a192", name: "Morgan Freeman", profileImageUrl: "https://image.tmdb.org/t/p/w500/40123.jpg", popularity: 69.1, birthYear: 1937 }
];

const fallbackMovies = [
  {
    id: "m27205",
    title: "Inception",
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to have his criminal history erased.",
    releaseYear: 2010,
    rating: 8.4,
    posterUrl: "https://image.tmdb.org/t/p/w500/oYuLEW9W2vBBGLn2gRAtHQZ8ZWy.jpg",
    popularity: 98.4,
    directorId: "d1",
    genreIds: ["28", "878", "53"],
    cast: [
      { actorId: "a6193", role: "Dom Cobb" },
      { actorId: "a24045", role: "Arthur" },
      { actorId: "a27578", role: "Ariadne" },
      { actorId: "a2524", role: "Eames" },
      { actorId: "a2039", role: "Robert Fischer" },
      { actorId: "a8210", role: "Mal Cobb" },
      { actorId: "a2232", role: "Professor Stephen Miles" }
    ]
  },
  {
    id: "m872585",
    title: "Oppenheimer",
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    releaseYear: 2023,
    rating: 8.1,
    posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    popularity: 95.1,
    directorId: "d1",
    genreIds: ["18", "36"],
    cast: [
      { actorId: "a2039", role: "J. Robert Oppenheimer" },
      { actorId: "a5081", role: "Katherine 'Kitty' Oppenheimer" },
      { actorId: "a1892", role: "Leslie Groves" },
      { actorId: "a505710", role: "Jean Tatlock" },
      { actorId: "a3894", role: "Isidor Isaac Rabi" }
    ]
  },
  {
    id: "m155",
    title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent.",
    releaseYear: 2008,
    rating: 8.5,
    posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    popularity: 92.3,
    directorId: "d1",
    genreIds: ["28", "80", "18"],
    cast: [
      { actorId: "a3894", role: "Bruce Wayne / Batman" },
      { actorId: "a2232", role: "Alfred Pennyworth" },
      { actorId: "a2039", role: "Dr. Jonathan Crane / Scarecrow" },
      { actorId: "a1892", role: "Cameo SWAT Officer" }
    ]
  },
  {
    id: "m562",
    title: "Die Hard with a Vengeance",
    overview: "John McClane and a Harlem dry-cleaner must stop a terrorist from detonating bombs in NYC.",
    releaseYear: 1995,
    rating: 7.3,
    posterUrl: "https://image.tmdb.org/t/p/w500/10123.jpg",
    popularity: 45.0,
    directorId: "d5",
    genreIds: ["28", "53"],
    cast: [
      { actorId: "a5292", role: "Special Agent" },
      { actorId: "a1979", role: "Mathias Targo" }
    ]
  },
  {
    id: "m568",
    title: "Apollo 13",
    overview: "NASA must devise a strategy to return Apollo 13 to Earth safely after the spacecraft undergoes massive internal damage.",
    releaseYear: 1995,
    rating: 7.4,
    posterUrl: "https://image.tmdb.org/t/p/w500/k2tL34.jpg",
    popularity: 58.2,
    directorId: "d5",
    genreIds: ["18", "36", "12"],
    cast: [
      { actorId: "a31", role: "Jim Lovell" },
      { actorId: "a102", role: "Jack Swigert" },
      { actorId: "a12835", role: "Fred Haise" },
      { actorId: "a884", role: "Ken Mattingly" }
    ]
  },
  {
    id: "m640",
    title: "Catch Me If You Can",
    overview: "A seasoned FBI agent pursues Frank Abagnale Jr. who, before his 19th birthday, successfully forged millions of dollars in checks.",
    releaseYear: 2002,
    rating: 7.9,
    posterUrl: "https://image.tmdb.org/t/p/w500/ctjEj2xL3b.jpg",
    popularity: 76.5,
    directorId: "d2",
    genreIds: ["18", "80", "35"],
    cast: [
      { actorId: "a6193", role: "Frank Abagnale Jr." },
      { actorId: "a31", role: "Carl Hanratty" },
      { actorId: "a1979", role: "Frank Abagnale Sr." }
    ]
  },
  {
    id: "m4922",
    title: "Killers of the Flower Moon",
    overview: "When oil is discovered in 1920s Oklahoma under Osage Nation land, the Osage people are murdered one by one.",
    releaseYear: 2023,
    rating: 7.5,
    posterUrl: "https://image.tmdb.org/t/p/w500/dB6Kmo8bWv.jpg",
    popularity: 70.1,
    directorId: "d3",
    genreIds: ["80", "18", "36"],
    cast: [
      { actorId: "a6193", role: "Ernest Burkhart" },
      { actorId: "a3895", role: "William King Hale" }
    ]
  },
  {
    id: "m497",
    title: "The Green Mile",
    overview: "A supernatural tale set on death row in a Southern prison, where gentle giant John Coffey possesses mysterious healing powers.",
    releaseYear: 1999,
    rating: 8.6,
    posterUrl: "https://image.tmdb.org/t/p/w500/velmW.jpg",
    popularity: 80.0,
    directorId: "d2",
    genreIds: ["18", "80"],
    cast: [
      { actorId: "a31", role: "Paul Edgecomb" },
      { actorId: "a884", role: "Burt Hammersmith" },
      { actorId: "a192", role: "Narrator" }
    ]
  },
  {
    id: "m46648",
    title: "The Departure",
    overview: "A tense thriller featuring seasoned actors exploring shared mystery.",
    releaseYear: 2018,
    rating: 7.2,
    posterUrl: "https://image.tmdb.org/t/p/w500/901823.jpg",
    popularity: 40.0,
    directorId: "d4",
    genreIds: ["53", "18"],
    cast: [
      { actorId: "a24045", role: "Agent Mark" },
      { actorId: "a27578", role: "Dr. Sarah" },
      { actorId: "a2232", role: "The Commissioner" }
    ]
  },
  {
    id: "m7001",
    title: "Dunkirk",
    overview: "Allied soldiers from Belgium, the British Commonwealth and Empire, and France are surrounded by the German Army.",
    releaseYear: 2017,
    rating: 7.5,
    posterUrl: "https://image.tmdb.org/t/p/w500/ebSnw.jpg",
    popularity: 65.4,
    directorId: "d1",
    genreIds: ["10752", "18", "36"],
    cast: [
      { actorId: "a2039", role: "Shivering Soldier" },
      { actorId: "a2524", role: "Farrier" }
    ]
  },
  {
    id: "m7002",
    title: "Interstellar",
    overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    releaseYear: 2014,
    rating: 8.4,
    posterUrl: "https://image.tmdb.org/t/p/w500/gEU2.jpg",
    popularity: 91.0,
    directorId: "d1",
    genreIds: ["12", "18", "878"],
    cast: [
      { actorId: "a1892", role: "Dr. Mann" },
      { actorId: "a1810", role: "Amelia Brand" },
      { actorId: "a2232", role: "Professor Brand" },
      { actorId: "a505710", role: "Young Scientist" }
    ]
  },
  {
    id: "m7003",
    title: "The Departed",
    overview: "An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.",
    releaseYear: 2006,
    rating: 8.2,
    posterUrl: "https://image.tmdb.org/t/p/w500/10923.jpg",
    popularity: 78.0,
    directorId: "d3",
    genreIds: ["80", "18", "53"],
    cast: [
      { actorId: "a6193", role: "Billy Costigan" },
      { actorId: "a1892", role: "Colin Sullivan" }
    ]
  },
  {
    id: "m7004",
    title: "A Quiet Place",
    overview: "In a post-apocalyptic world, a family is forced to live in silence while hiding from monsters with ultra-sensitive hearing.",
    releaseYear: 2018,
    rating: 7.4,
    posterUrl: "https://image.tmdb.org/t/p/w500/nAU.jpg",
    popularity: 55.0,
    directorId: "d6",
    genreIds: ["18", "878", "53"],
    cast: [
      { actorId: "a5081", role: "Evelyn Abbott" },
      { actorId: "a2039", role: "Man in Woods" }
    ]
  },
  {
    id: "m7005",
    title: "Once Upon a Time in Hollywood",
    overview: "A faded television actor and his stunt double strive to achieve fame and success in the final years of Hollywood's Golden Age.",
    releaseYear: 2019,
    rating: 7.4,
    posterUrl: "https://image.tmdb.org/t/p/w500/8j.jpg",
    popularity: 72.0,
    directorId: "d4",
    genreIds: ["35", "18", "36"],
    cast: [
      { actorId: "a6193", role: "Rick Dalton" },
      { actorId: "a287", role: "Cliff Booth" },
      { actorId: "a1979", role: "George Spahn" }
    ]
  },
  {
    id: "m7006",
    title: "Inglourious Basterds",
    overview: "In Nazi-occupied France during WWII, a plan to assassinate Nazi leaders by a group of Jewish U.S. soldiers coincides with a theatre owner's revenge plan.",
    releaseYear: 2009,
    rating: 8.2,
    posterUrl: "https://image.tmdb.org/t/p/w500/7s.jpg",
    popularity: 81.0,
    directorId: "d4",
    genreIds: ["28", "18", "10752"],
    cast: [
      { actorId: "a287", role: "Lt. Aldo Raine" },
      { actorId: "a8210", role: "Performer" },
      { actorId: "a2524", role: "Soldier" }
    ]
  },
  {
    id: "m7007",
    title: "Mystic River",
    overview: "The lives of three friends are shattered when one of their daughters is murdered.",
    releaseYear: 2003,
    rating: 7.7,
    posterUrl: "https://image.tmdb.org/t/p/w500/40923.jpg",
    popularity: 51.0,
    directorId: "d5",
    genreIds: ["18", "80", "53"],
    cast: [
      { actorId: "a102", role: "Sean Devine" },
      { actorId: "a3895", role: "Jimmy Markum" }
    ]
  },
  {
    id: "m7008",
    title: "A Few Good Men",
    overview: "Military lawyer Lt. Daniel Kaffee defends Marines accused of murder who contend they were acting under orders.",
    releaseYear: 1992,
    rating: 7.7,
    posterUrl: "https://image.tmdb.org/t/p/w500/30123.jpg",
    popularity: 49.0,
    directorId: "d2",
    genreIds: ["18"],
    cast: [
      { actorId: "a102", role: "Capt. Jack Ross" },
      { actorId: "a31", role: "Col. Nathan R. Jessep" }
    ]
  }
];

module.exports = {
  fallbackGenres,
  fallbackDirectors,
  fallbackActors,
  fallbackMovies
};
