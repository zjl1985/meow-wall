/** 全站文案集中在这里，组件里不写死中文 */
export const copy = {
  site: {
    name: "喵喵墙",
    tagline: "一个只做一件事的网站：让你无限刷猫猫头",
    footer: "猫图来自 TheCatAPI 与 cataas，本站不存图，只负责让你开心",
  },
  nav: {
    wall: "猫墙",
    says: "猫猫说话",
    favorites: "我的收藏",
  },
  hero: {
    title: "今天的猫是这只",
    hint: "按空格或 R 也能换猫",
    roll: "换一只",
    rolling: "正在抓猫…",
    rollCount: (count: number) => `你已经换了 ${count} 只猫`,
  },
  wall: {
    title: "猫墙",
    subtitle: "往下滚会自动续猫",
    loadMore: "再来一波",
    loading: "猫猫正在赶来…",
    end: "已经到底了，点上面的按钮继续",
  },
  card: {
    favorite: "收藏",
    unfavorite: "取消收藏",
    download: "下载",
    preview: "看大图",
  },
  says: {
    title: "让猫替你说话",
    subtitle: "输入一句话，猫会帮你说出来",
    placeholder: "比如：我不想上班",
    submit: "生成",
    generating: "猫正在酝酿…",
    presets: ["我不想上班", "再来一杯", "喵", "别摸我", "今天也很努力"],
    empty: "先输入一句话吧",
    tooLong: (max: number) => `最多 ${max} 个字`,
  },
  favorites: {
    title: "我的收藏",
    subtitle: (count: number) => `一共 ${count} 只猫住在这里`,
    clear: "清空全部",
    empty: "还没有收藏任何猫",
    emptyHint: "去猫墙上点个爱心，猫就会住进来",
    goWall: "去猫墙",
  },
  toast: {
    favorited: "收下了，这只猫是你的了",
    unfavorited: "已经放它走了",
    cleared: "猫猫们都散场了",
    downloadFailed: "下载失败，稍后再试",
  },
  error: {
    title: "猫猫们暂时躲起来了",
    retry: "再试一次",
  },
  easterEgg: {
    sound: "喵一声",
    soundOff: "静音",
    parade: "猫猫大游行！",
    awayTitle: "🐱 快回来…",
  },
} as const;
