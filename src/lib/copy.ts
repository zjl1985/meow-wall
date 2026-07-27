/** 全站文案集中在这里，组件里不写死中文 */
export const copy = {
  site: {
    name: "喵喵墙",
    tagline: "agent-hub 同款像素猫猫头，一墙全开",
    footer: "像素猫来自 Fabel CONSULTING AI / agent-hub mascot，纯本地渲染，不拉外网猫图",
  },
  nav: {
    wall: "猫墙",
    says: "猫猫说话",
    favorites: "我的收藏",
  },
  hero: {
    title: "今天的猫是这只",
    hint: "按空格或 R 也能换猫 · 还会换表情",
    roll: "换一只",
    rollCount: (count: number) => `你已经换了 ${count} 只猫`,
  },
  wall: {
    title: "猫墙",
    subtitle: (total: number) => `一共 ${total} 款像素皮肤，全是 agent-hub 同款`,
    reshuffle: "打乱一下",
  },
  card: {
    favorite: "收藏",
    unfavorite: "取消收藏",
    preview: "看大猫",
  },
  says: {
    title: "让猫替你说话",
    subtitle: "选一只像素猫，输入一句话，它头顶冒泡",
    placeholder: "比如：我不想上班",
    submit: "让它说",
    presets: ["我不想上班", "再来一杯", "喵", "别摸我", "今天也很努力"],
    empty: "先输入一句话吧",
    tooLong: (max: number) => `最多 ${max} 个字`,
    pickCat: "换一只说话的猫",
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
  },
  easterEgg: {
    sound: "喵一声",
    parade: "猫猫大游行！",
    awayTitle: "🐱 快回来…",
  },
  state: {
    idle: "发呆",
    thinking: "思考中",
    success: "开心",
    error: "懵了",
    sleeping: "睡觉",
    angry: "生气",
  },
} as const;

export const MAX_SAYS_LENGTH = 24;
