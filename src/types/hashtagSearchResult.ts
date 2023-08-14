interface HashtagSearchResult {
  count: number;
  data?: HashtagSearchData;
  status: HashtagSearchData;
}

interface HashtagSearchData {
  id?: string;
  name?: string;
  top?: HashtagSearchDataRowItem;
  recent?: HashtagSearchDataRowItem;
}

interface HashtagSearchDataRowItem {
  sections?: HashtagSearchDataRowSection[];
  more_available?: string;
  next_max_id?: string;
  next_page?: string;
}

interface HashtagSearchDataRowSection {
  layout_type?: string;
  layout_content?: { medias: HashtagSearchDataRowSectionMedia[] };
  feed_type?: string;
}

interface HashtagSearchDataRowSectionMedia {
  media: {
    taken_at?: number;
    pk?: string;
    id?: string;
    caption_is_edited?: boolean;
    like_count?: number;
    code?: string;
    caption?: {
      media_id?: string;
      pk?: string;
      text?: string;
      created_at?: number;
    };
    user?: {
      username?: string;
      full_name?: string;
      is_private?: boolean;
    };
    original_width?: number;
    original_height?: number;
    comment_count?: number;
  };
}
