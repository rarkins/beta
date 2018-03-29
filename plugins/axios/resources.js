const map = {
  index: '/posts/streams/me',
  mentions: '/users/me/mentions',
  interactions: '/users/me/actions',
  stars: '/users/me/bookmarks',
  conversations: '/posts/streams/explore/conversations',
  'missed-conversations': '/posts/streams/explore/missed_conversations',
  photos: '/posts/streams/explore/photos',
  trending: '/posts/streams/explore/trending',
  global: '/posts/streams/global',
  'posts-id': ({ params }) => `/posts/${params.id}/thread`,
  'tags-name': ({ params }) => `/posts/tag/${encodeURIComponent(params.name)}`,
  '@name': ({ params }) => `/users/@${params.name}/posts`,
  '@name-follows': ({ params }) => `/users/@${params.name}/following`,
  '@name-followers': ({ params }) => `/users/@${params.name}/followers`,
  '@name-starred': ({ params }) => `/users/@${params.name}/bookmarks`,
  '@name-posts-id': ({ params }) => `/posts/${params.id}/thread`,
  files: '/users/me/files',
  'files-id': ({ params }) => `/files/${params.id}`,
  'search-users': '/users/search',
  'search-posts': '/posts/search',
  messages: '/users/me/channels/subscribed',
  'messages-channel': ({ params }) => `/channels/${params.channel}/messages`,
  'about-stats': '/sys/stats'
}
export default map
export const getResourcePath = route => {
  const val = map[route.name]
  return typeof val === 'function' ? val(route) : val
}