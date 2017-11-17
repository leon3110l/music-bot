const musicFilter = q => x => {
  const { snippet } = x
  const regex = new RegExp(
    `vevo|official|audio|lyric|${q
      .toLowerCase()
      .split(' ')
      .join('|')}`,
    'g',
  )
  return (
    snippet.channelTitle.toLowerCase().search(regex) != -1 ||
    snippet.title.toLowerCase().search(regex) != -1
  )
}

export default musicFilter
