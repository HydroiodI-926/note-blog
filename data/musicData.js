/**
 * 音乐模块数据配置
 * 每首歌曲需要以下信息：
 *   - id: 唯一标识
 *   - title: 歌曲名称
 *   - artist: 艺术家
 *   - album: 专辑名称（可选）
 *   - cover: 封面图片路径（放在 public/music/covers/ 下）
 *   - src: 音频文件路径（放在 public/music/ 下）
 *   - duration: 时长字符串（可选，显示用）
 *   - lrcFile: 歌词文件名（放在 data/music/lyrics/ 下，可选）
 */
const musicData = [
  {
    id: 1,
    title: '跳伞',
    artist: '未知艺术家',
    album: '',
    cover: '/music/covers/default.svg',
    src: encodeURI('/music/跳伞.mp3'),
    duration: '',
    lrcFile: '',
  },
]

module.exports = musicData
