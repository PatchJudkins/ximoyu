// 首页一行轮转 / 作品集页网格共用这一份数据。
//
//   kind   'image' | 'video' | 'typo'   视频卡自动静音循环播放
//   ratio  宽 / 高，决定它在一行里占多宽；横版 16/9、竖版 9/16、方图 1、竖图 0.56~0.76
//   img    图片作品；video + poster 是视频作品（poster 当首帧，没加载出来时顶上）
//
// 素材来自 E:\work\工作室作品集，已经转成 public/works/ 里的 webp（长边 ≤1600）和 mp4。
// 改标题、年份、标签都在这里改；想加作品就把新图丢进 public/works/ 再 push 一条。

export const works = [
  { id: '01', title: '甜回童年', en: 'Sweet Recall', year: '2025', tags: ['包装设计', '品牌'], kind: 'image', ratio: 0.667, img: './works/w01.webp', wide: true, href: '#contact' },
  { id: '02', title: '凌空', en: 'Airborne', year: '2025', tags: ['运动广告', '合成'], kind: 'image', ratio: 1.779, img: './works/w02.webp', href: '#contact' },
  { id: '03', title: '竖屏短剧', en: 'Short Drama', year: '2026', tags: ['生成短片', '竖屏'], kind: 'video', ratio: 0.5625, video: './works/v01.mp4', poster: './works/v01-poster.jpg', href: '#contact' },
  { id: '04', title: '冲刺', en: 'Sprint', year: '2025', tags: ['运动广告', '黑白'], kind: 'image', ratio: 1.779, img: './works/w03.webp', href: '#contact' },
  { id: '05', title: '丝绒', en: 'Velvet', year: '2025', tags: ['美妆广告', '产品'], kind: 'image', ratio: 0.75, img: './works/w04.webp', href: '#contact' },
  { id: '06', title: '界面', en: 'Interface', year: '2025', tags: ['界面设计', '移动端'], kind: 'image', ratio: 1.831, img: './works/w06.webp', href: '#contact' },
  { id: '07', title: '鲜活', en: 'Fresh', year: '2025', tags: ['产品广告', '包装'], kind: 'image', ratio: 0.667, img: './works/w05.webp', href: '#contact' },
  { id: '08', title: '红结', en: 'Red Knot', year: '2025', tags: ['美妆广告', '产品'], kind: 'image', ratio: 0.762, img: './works/w07.webp', href: '#contact' },
  { id: '09', title: '银发', en: 'Silver', year: '2025', tags: ['角色设计', '合成'], kind: 'image', ratio: 0.667, img: './works/w08.webp', href: '#contact' },
  { id: '10', title: '记忆存档', en: 'Memory Archive', year: '2025', tags: ['编辑设计', '海报'], kind: 'image', ratio: 0.667, img: './works/w09.webp', href: '#contact' },
  { id: '11', title: '牧场', en: 'Pasture', year: '2025', tags: ['产品广告', '场景'], kind: 'image', ratio: 0.667, img: './works/w10.webp', href: '#contact' },
  { id: '12', title: '尘土', en: 'Grit', year: '2025', tags: ['运动广告', '摄影'], kind: 'image', ratio: 1.777, img: './works/w11.webp', href: '#contact' },
  { id: '13', title: '第一视角', en: 'POV', year: '2026', tags: ['运动广告', '竖屏'], kind: 'video', ratio: 0.5625, video: './works/v02.mp4', poster: './works/v02-poster.jpg', href: '#contact' },
  { id: '14', title: '信使香插', en: 'Yak Courier', year: '2025', tags: ['产品设计', '非遗'], kind: 'image', ratio: 1, img: './works/w12.webp', href: '#contact' },
  { id: '15', title: '信使挂件', en: 'Charms', year: '2025', tags: ['IP 周边', '角色'], kind: 'image', ratio: 1, img: './works/w13.webp', href: '#contact' },
  { id: '16', title: '蓝莓松饼', en: 'Blueberry', year: '2025', tags: ['餐饮海报', '合成'], kind: 'image', ratio: 0.5625, img: './works/w14.webp', href: '#contact' },
  { id: '17', title: '杯子蛋糕', en: 'Cup Cake', year: '2025', tags: ['餐饮海报', '合成'], kind: 'image', ratio: 0.75, img: './works/w15.webp', href: '#contact' },
  { id: '18', title: '苹果汁', en: 'Apple Juice', year: '2026', tags: ['饮品海报', '合成'], kind: 'image', ratio: 0.5625, img: './works/w16.webp', href: '#contact' },
  { id: '19', title: '露西', en: 'Lucy', year: '2025', tags: ['角色设计', '赛博'], kind: 'image', ratio: 0.667, img: './works/w17.webp', href: '#contact' },
  { id: '20', title: '雾隐门记', en: 'Veil of Mist', year: '2025', tags: ['插画', '国风'], kind: 'image', ratio: 0.5625, img: './works/w18.webp', href: '#contact' },
  { id: '21', title: '越用力', en: 'The Harder', year: '2025', tags: ['观念海报', '合成'], kind: 'image', ratio: 0.667, img: './works/w19.webp', href: '#contact' },
  { id: '22', title: '缠绕', en: 'Entwine', year: '2025', tags: ['图形实验', '合成'], kind: 'image', ratio: 0.667, img: './works/w20.webp', href: '#contact' },
  { id: '23', title: '雪线', en: 'Snowline', year: '2025', tags: ['运动广告', '黑白'], kind: 'image', ratio: 1.779, img: './works/w21.webp', href: '#contact' },
]
