export interface IGame {
  id: number;
  age_ratings?: IAgeRating[];
  aggregated_rating?: number;
  aggregated_rating_count?: number;
  alternative_names?: IAlternativeName[];
  artworks?: IArtwork[];
  bundles?: IGame[];
  checksum?: string;
  collections?: ICollection[];
  cover?: ICover;
  created_at?: string;
  dlcs?: IGame[];
  expanded_games?: IGame[];
  expansions?: IGame[];
  external_games?: IExternalGame[];
  first_release_date?: IReleaseDate;
  forks?: IGame[];
  franchise?: IFranchise;
  franchises?: IFranchise[];
  game_engines?: IGameEngine[];
  game_localizations?: IGameLocalization[];
  game_modes?: IGameMode[];
  game_status?: IGameStatus;
  game_type?: IGameType;
  genres?: IGenre[];
  hypes?: number;
  involved_companies?: IInvolvedCompany[];
  keywords?: IKeyword[];
  language_supports?: ILanguageSupport[];
  multiplayer_modes?: IMultiplayerMode[];
  name?: string;
  parent_game?: number;
  platforms?: IPlatform[];
  player_perspectives?: IPlayerPerspective[];
  ports?: IPlatform[];
  rating?: number;
  rating_count?: number;
  release_dates?: IReleaseDate[];
  remakes?: IGame[];
  remasters?: IGame[];
  screenshots?: IScreenshot[];
  similar_games?: IGame[];
  slug?: string;
  standalone_expansions?: IGame[];
  storyline?: string;
  summary?: string;
  tags?: number[];
  themes?: ITheme[];
  total_rating?: number;
  total_rating_count?: number;
  updated_at?: string;
  url?: string;
  version_parent?: IGame;
  version_title?: string;
  videos?: IGameVideo[];
  websites?: IWebsite[];
}

export interface IScreenshot {
  alpha_channel: boolean;
  animated: boolean;
  checksum: string;
  game: number;
  height: number;
  image_id: string;
  url: string;
  width: number;
}

// Age Rating Interfaces
export interface IAgeRating {
  id?: number;
  checksum?: string;
  content_descriptions?: number[];
  organization?: number;
  rating_category?: IAgeRatingCategory;
  rating_content_descriptions?: number[];
  rating_cover_url?: string;
  synopsis?: string;
}

export interface IAgeRatingCategory {
  id?: number;
  checksum?: string;
  created_at?: string;
  organization?: number;
  rating?: string;
  updated_at?: string;
}

export interface IAgeRatingContentDescription {
  id?: number;
  category?: number; // DEPRECATED!
  checksum?: string;
  description?: string;
}

export interface IAgeRatingContentDescriptionType {
  id?: number;
  checksum?: string;
  created_at?: string;
  name?: string;
  slug?: string;
  updated_at?: string;
}

export interface IAgeRatingContentDescriptionV2 {
  id?: number;
  checksum?: string;
  created_at?: string;
  description?: string;
  description_type?: number;
  organization?: number;
  updated_at?: string;
}

export interface IAgeRatingOrganization {
  id?: number;
  checksum?: string;
  created_at?: string;
  name?: string;
  updated_at?: string;
}

// Artwork Interfaces
export interface IArtwork {
  id?: number;
  alpha_channel?: boolean;
  animated?: boolean;
  artwork_type?: number;
  checksum?: string;
  game?: number;
  height?: number;
  image_id?: string;
  url?: string;
  width?: number;
}

export interface IArtworkType {
  id?: number;
  checksum?: string;
  created_at?: string;
  name?: string;
  slug?: string;
  updated_at?: string;
}

export interface IAlternativeName {
  id?: number;
  checksum?: string;
  comment?: string;
  game?: number;
  name?: string;
}

// Character Interfaces
export interface ICharacter {
  id?: number;
  akas?: string[];
  character_gender?: number;
  character_species?: number;
  checksum?: string;
  country_name?: string;
  created_at?: string;
  description?: string;
  games?: number[];
  gender?: number; // DEPRECATED! Use character_gender instead
  mug_shot?: number;
  name?: string;
  slug?: string;
  species?: number; // DEPRECATED! Use character_species instead
  updated_at?: string;
  url?: string;
}

export interface ICharacterGender {
  id?: number;
  checksum?: string;
  created_at?: string;
  name?: string;
  updated_at?: string;
}

export interface ICharacterMugShot {
  id?: number;
  alpha_channel?: boolean;
  animated?: boolean;
  checksum?: string;
  height?: number;
  image_id?: string;
  url?: string;
  width?: number;
}

export interface ICharacterSpecie {
  id?: number;
  checksum?: string;
  created_at?: string;
  name?: string;
  updated_at?: string;
}

// Collection Interfaces
export interface ICollection {
  id?: number;
  as_child_relations?: number[];
  as_parent_relations?: number[];
  checksum?: string;
  created_at?: string;
  games?: number[];
  name?: string;
  slug?: string;
  type?: number;
  updated_at?: string;
  url?: string;
}

export interface ICollectionMembership {
  id?: number;
  checksum?: string;
  collection?: number;
  created_at?: string;
  game?: number;
  type?: number;
  updated_at?: string;
}

export interface ICollectionMembershipType {
  id?: number;
  allowed_collection_type?: number;
  checksum?: string;
  created_at?: string;
  description?: string;
  name?: string;
  updated_at?: string;
}

export interface ICollectionRelation {
  id?: number;
  checksum?: string;
  child_collection?: number;
  created_at?: string;
  parent_collection?: number;
  type?: number;
  updated_at?: string;
}

export interface ICollectionRelationType {
  id?: number;
  allowed_child_type?: number;
  allowed_parent_type?: number;
  checksum?: string;
  created_at?: string;
  description?: string;
  name?: string;
  updated_at?: string;
}

export interface ICollectionType {
  id?: number;
  checksum?: string;
  created_at?: string;
  description?: string;
  name?: string;
  updated_at?: string;
}

// Company Interfaces
export interface ICompany {
  id?: number;
  change_date?: number;
  change_date_category?: number; // DEPRECATED! Use change_date_format instead
  change_date_format?: number;
  changed_company_id?: number;
  checksum?: string;
  country?: number;
  created_at?: string;
  description?: string;
  developed?: number[];
  logo?: number;
  name?: string;
  parent?: number;
  published?: number[];
  slug?: string;
  start_date?: number;
  start_date_category?: number; // DEPRECATED! Use start_date_format instead
  start_date_format?: number;
  status?: number;
  updated_at?: string;
  url?: string;
  websites?: number[];
}

export interface ICompanyLogo {
  id?: number;
  alpha_channel?: boolean;
  animated?: boolean;
  checksum?: string;
  height?: number;
  image_id?: string;
  url?: string;
  width?: number;
}

export interface ICompanyStatus {
  id?: number;
  checksum?: string;
  created_at?: string;
  name?: string;
  updated_at?: string;
}

export interface ICompanyWebsite {
  id?: number;
  category?: number; // DEPRECATED! Use type instead
  checksum?: string;
  trusted?: boolean;
  type?: number;
  url?: string;
}

// Cover Interface
export interface ICover {
  id?: number;
  alpha_channel?: boolean;
  animated?: boolean;
  checksum?: string;
  game?: number;
  game_localization?: number;
  height?: number;
  image_id?: string;
  url?: string;
  width?: number;
}

// Date Format Interface
export interface IDateFormat {
  id?: number;
  checksum?: string;
  created_at?: string;
  format?: string;
  updated_at?: string;
}

// Event Interfaces
export interface IEvent {
  id?: number;
  checksum?: string;
  created_at?: string;
  description?: string;
  end_time?: string;
  event_logo?: number;
  event_networks?: number[];
  games?: number[];
  live_stream_url?: string;
  name?: string;
  slug?: string;
  start_time?: string;
  time_zone?: string;
  updated_at?: string;
  videos?: number[];
}

export interface IEventLogo {
  id?: number;
  alpha_channel?: boolean;
  animated?: boolean;
  checksum?: string;
  created_at?: string;
  event?: number;
  height?: number;
  image_id?: string;
  updated_at?: string;
  url?: string;
  width?: number;
}

export interface IEventNetwork {
  id?: number;
  checksum?: string;
  created_at?: string;
  event?: number;
  network_type?: number;
  updated_at?: string;
  url?: string;
}

// External Game Interfaces
export interface IExternalGame {
  id?: number;
  category?: number; // DEPRECATED! Use external_game_source instead
  checksum?: string;
  countries?: number[];
  created_at?: string;
  external_game_source?: number;
  game?: number;
  game_release_format?: number;
  media?: number; // DEPRECATED! Use game_release_format instead
  name?: string;
  platform?: number;
  uid?: string;
  updated_at?: string;
  url?: string;
  year?: number;
}

export interface IExternalGameSource {
  id?: number;
  checksum?: string;
  created_at?: string;
  name?: string;
  updated_at?: string;
}

// Franchise Interface
export interface IFranchise {
  id?: number;
  checksum?: string;
  created_at?: string;
  games?: number[];
  name?: string;
  slug?: string;
  updated_at?: string;
  url?: string;
}

// Game Engine Interfaces
export interface IGameEngine {
  id?: number;
  checksum?: string;
  companies?: number[];
  created_at?: string;
  description?: string;
  logo?: number;
  name?: string;
  platforms?: number[];
  slug?: string;
  updated_at?: string;
  url?: string;
}

export interface IGameEngineLogo {
  id?: number;
  alpha_channel?: boolean;
  animated?: boolean;
  checksum?: string;
  height?: number;
  image_id?: string;
  url?: string;
  width?: number;
}

export interface IGameLocalization {
  id?: number;
  checksum?: string;
  cover?: number;
  created_at?: string;
  game?: number;
  name?: string;
  region?: number;
  updated_at?: string;
}

export interface IGameMode {
  id?: number;
  checksum?: string;
  created_at?: string;
  name?: string;
  slug?: string;
  updated_at?: string;
  url?: string;
}

export interface IGameReleaseFormat {
  id?: number;
  checksum?: string;
  created_at?: string;
  format?: string;
  updated_at?: string;
}

export interface IGameStatus {
  id?: number;
  checksum?: string;
  created_at?: string;
  status?: string;
  updated_at?: string;
}

export interface IGameTimeToBeat {
  id?: number;
  checksum?: string;
  completely?: number;
  count?: number;
  created_at?: string;
  game_id?: number;
  hastily?: number;
  normally?: number;
  updated_at?: string;
}

export interface IGameType {
  id?: number;
  checksum?: string;
  created_at?: string;
  type?: string;
  updated_at?: string;
}

export interface IGameVersion {
  id?: number;
  checksum?: string;
  created_at?: string;
  features?: number[];
  game?: number;
  games?: number[];
  updated_at?: string;
  url?: string;
}

export interface IGameVersionFeature {
  id?: number;
  category?: number;
  checksum?: string;
  description?: string;
  position?: number;
  title?: string;
  values?: number[];
}

export interface IGameVersionFeatureValue {
  id?: number;
  checksum?: string;
  game?: number;
  game_feature?: number;
  included_feature?: number;
  note?: string;
}

export interface IGameVideo {
  id?: number;
  checksum?: string;
  game?: number;
  name?: string;
  video_id?: string;
}

// Genre Interface
export interface IGenre {
  id?: number;
  checksum?: string;
  created_at?: string;
  name?: string;
  slug?: string;
  updated_at?: string;
  url?: string;
}

// Involved Company Interface
export interface IInvolvedCompany {
  id?: number;
  checksum?: string;
  company?: number;
  created_at?: string;
  developer?: boolean;
  game?: number;
  porting?: boolean;
  publisher?: boolean;
  supporting?: boolean;
  updated_at?: string;
}

// Keyword Interface
export interface IKeyword {
  id?: number;
  checksum?: string;
  created_at?: string;
  name?: string;
  slug?: string;
  updated_at?: string;
  url?: string;
}

// Language Interfaces
export interface ILanguage {
  id?: number;
  checksum?: string;
  created_at?: string;
  locale?: string;
  name?: string;
  native_name?: string;
  updated_at?: string;
}

export interface ILanguageSupport {
  id?: number;
  checksum?: string;
  created_at?: string;
  game?: number;
  language?: number;
  language_support_type?: number;
  updated_at?: string;
}

export interface ILanguageSupportType {
  id?: number;
  checksum?: string;
  created_at?: string;
  name?: string;
  updated_at?: string;
}

// Multiplayer Mode Interface
export interface IMultiplayerMode {
  id?: number;
  campaigncoop?: boolean;
  checksum?: string;
  dropin?: boolean;
  game?: number;
  lancoop?: boolean;
  offlinecoop?: boolean;
  offlinecoopmax?: number;
  offlinemax?: number;
  onlinecoop?: boolean;
  onlinecoopmax?: number;
  onlinemax?: number;
  platform?: number;
  splitscreen?: boolean;
  splitscreenonline?: boolean;
}

// Network Type Interface
export interface INetworkType {
  id?: number;
  checksum?: string;
  created_at?: string;
  event_networks?: number[];
  name?: string;
  updated_at?: string;
}

// Platform Interfaces
export interface IPlatform {
  id?: number;
  abbreviation?: string;
  alternative_name?: string;
  category?: number; // DEPRECATED! Use platform_type instead
  checksum?: string;
  created_at?: string;
  generation?: number;
  name?: string;
  platform_family?: number;
  platform_logo?: number;
  platform_type?: number;
  slug?: string;
  summary?: string;
  updated_at?: string;
  url?: string;
  versions?: number[];
  websites?: number[];
}

export interface IPlatformFamily {
  id?: number;
  checksum?: string;
  name?: string;
  slug?: string;
}

export interface IPlatformLogo {
  id?: number;
  alpha_channel?: boolean;
  animated?: boolean;
  checksum?: string;
  height?: number;
  image_id?: string;
  url?: string;
  width?: number;
}

export interface IPlatformType {
  id?: number;
  checksum?: string;
  created_at?: string;
  name?: string;
  updated_at?: string;
}

export interface IPlatformVersion {
  id?: number;
  checksum?: string;
  companies?: number[];
  connectivity?: string;
  cpu?: string;
  graphics?: string;
  main_manufacturer?: number;
  media?: string;
  memory?: string;
  name?: string;
  os?: string;
  output?: string;
  platform_logo?: number;
  platform_version_release_dates?: number[];
  resolutions?: string;
  slug?: string;
  sound?: string;
  storage?: string;
  summary?: string;
  url?: string;
}

export interface IPlatformVersionCompany {
  id?: number;
  checksum?: string;
  comment?: string;
  company?: number;
  developer?: boolean;
  manufacturer?: boolean;
}

export interface IPlatformVersionReleaseDate {
  id?: number;
  category?: number; // DEPRECATED! Use date_format instead
  checksum?: string;
  created_at?: string;
  date?: number;
  date_format?: number;
  human?: string;
  m?: number;
  platform_version?: number;
  region?: number; // DEPRECATED! Use release_region instead
  release_region?: number;
  updated_at?: string;
  y?: number;
}

export interface IPlatformWebsite {
  id?: number;
  category?: number; // DEPRECATED! Use type instead
  checksum?: string;
  trusted?: boolean;
  type?: number;
  url?: string;
}

// Player Perspective Interface
export interface IPlayerPerspective {
  id?: number;
  checksum?: string;
  created_at?: string;
  name?: string;
  slug?: string;
  updated_at?: string;
  url?: string;
}

// Popularity Interfaces
export interface IPopularityPrimitive {
  id?: number;
  calculated_at?: string;
  checksum?: string;
  created_at?: string;
  external_popularity_source?: number;
  game_id?: number;
  popularity_source?: number; // DEPRECATED! Use external_popularity_source instead
  popularity_type?: number;
  updated_at?: string;
  value?: number;
}

export interface IPopularityType {
  id?: number;
  checksum?: string;
  created_at?: string;
  external_popularity_source?: number;
  name?: string;
  popularity_source?: number; // DEPRECATED! Use external_popularity_source instead
  updated_at?: string;
}

// Region Interface
export interface IRegion {
  id?: number;
  category?: string;
  checksum?: string;
  created_at?: string;
  identifier?: string;
  name?: string;
  updated_at?: string;
}

// Release Date Interfaces
export interface IReleaseDate {
  id?: number;
  category?: number; // DEPRECATED! Use date_format instead
  checksum?: string;
  created_at?: string;
  date?: string;
  date_format?: number;
  game?: number;
  human?: string;
  m?: number;
  platform?: number;
  region?: number; // DEPRECATED! Use release_region instead
  release_region?: number;
  status?: number;
  updated_at?: string;
  y?: number;
}

export interface IReleaseDateRegion {
  id?: number;
  checksum?: string;
  created_at?: string;
  region?: string;
  updated_at?: string;
}

export interface IReleaseDateStatus {
  id?: number;
  checksum?: string;
  created_at?: string;
  description?: string;
  name?: string;
  updated_at?: string;
}

// Search Interface
export interface ISearch {
  id?: number;
  alternative_name?: string;
  character?: number;
  checksum?: string;
  collection?: number;
  company?: number;
  description?: string;
  game?: number;
  name?: string;
  platform?: number;
  published_at?: number;
  test_dummy?: number;
  theme?: number;
}

// Theme Interface
export interface ITheme {
  id?: number;
  checksum?: string;
  created_at?: string;
  name?: string;
  slug?: string;
  updated_at?: string;
  url?: string;
}

// Website Interfaces
export interface IWebsite {
  id?: number;
  category?: number; // DEPRECATED! Use type instead
  checksum?: string;
  game?: number;
  trusted?: boolean;
  type?: number;
  url?: string;
}

export interface IWebsiteType {
  id?: number;
  checksum?: string;
  created_at?: string;
  type?: string;
  updated_at?: string;
}
