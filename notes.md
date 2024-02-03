old process from dibujitos-api
---
- get torrent provider for category,
- send list request to torrent provider,
- get title parser for category,
- parse title and get mID for every torrent,
- dedupe torrents by mID,
- get metadata provider for category,
- fetch / cache metadata for every mID


new process
---

available options:

- getMetadataProvider
  - kitsu
  - tmdb
- getTorrentProvider
  - nyaa
  - bitsearch
  - rarbg
  - torrentgalaxy
- getTitleParser
  - anime
  - tv episodes
  - tv packs
  - movies

each CATEGORY has
  1 metadata provider
  1 title parser
  N torrent providers

a torrent provider can appear in more than one category
a metadata provider too
a title parser SHOULD NOT


the nogroup and nometa params
---
nogroup avoids processing torrents using the title parser
nometa avoids trying to add more meta info to the parsed info obtained by the title parser
