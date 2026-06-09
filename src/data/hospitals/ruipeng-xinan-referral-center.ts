export type HospitalImage = {
  src: string;
  alt: string;
  title: string;
  description: string;
  type: "hero" | "exterior" | "consulting-room" | "equipment" | "doctor-team";
};

export type HospitalFaq = {
  question: string;
  answer: string;
};

export const ruipengXinanReferralCenter = {
  slug: "ruipeng-xinan-referral-center",
  name: "瑞鹏宠物医院西南转诊中心",
  shortName: "西南转诊中心",
  city: "重庆",
  district: "待补充",
  positioning: "宠物转诊与犬猫专科诊疗服务",
  heroTitle: "重庆宠物转诊与犬猫专科诊疗服务",
  heroDescription: "为犬猫家庭提供内科、外科、影像检查、住院护理、疑难病例转诊等综合医疗支持",
  address: "待补充",
  phone: "待补充",
  openingHours: "待补充",
  mapUrl: "待补充",
  consultationUrl: "#contact",
  navigationUrl: "#map",
  sameAs: [],
  images: [
    {
      src: "/hospitals/ruipeng-xinan-referral-center/hero.webp",
      alt: "瑞鹏宠物医院西南转诊中心接待与候诊环境",
      title: "接待与候诊环境",
      description: "图片待补充，后续用于展示医院接待与候诊环境。",
      type: "hero",
    },
    {
      src: "/hospitals/ruipeng-xinan-referral-center/exterior.webp",
      alt: "瑞鹏宠物医院西南转诊中心门头照片",
      title: "医院门头",
      description: "图片待补充，后续用于帮助到院家庭识别医院位置。",
      type: "exterior",
    },
    {
      src: "/hospitals/ruipeng-xinan-referral-center/consulting-room.webp",
      alt: "瑞鹏宠物医院西南转诊中心诊室环境",
      title: "诊室环境",
      description: "图片待补充，后续用于展示问诊与检查空间。",
      type: "consulting-room",
    },
    {
      src: "/hospitals/ruipeng-xinan-referral-center/equipment.webp",
      alt: "瑞鹏宠物医院西南转诊中心医疗设备展示",
      title: "医疗设备",
      description: "图片待补充，设备信息需经医院确认后展示。",
      type: "equipment",
    },
    {
      src: "/hospitals/ruipeng-xinan-referral-center/doctor-team.webp",
      alt: "瑞鹏宠物医院西南转诊中心医生团队展示",
      title: "医生团队",
      description: "图片待补充，团队信息需经医院确认后展示。",
      type: "doctor-team",
    },
  ] satisfies HospitalImage[],
  specialties: [
    "犬猫内科",
    "外科手术评估",
    "影像检查",
    "住院护理",
    "疑难病例转诊",
    "老年宠物疾病管理",
  ],
  visitScenarios: [
    "反复呕吐腹泻",
    "精神沉郁、食欲下降",
    "普通门诊治疗后效果不明显",
    "需要进一步影像检查",
    "需要手术评估",
    "需要住院观察",
    "需要转诊会诊",
  ],
  processSteps: ["咨询沟通", "预约或到院", "问诊检查", "制定诊疗方案", "复诊与护理建议"],
  advantages: [
    "瑞鹏宠物医院品牌体系支持",
    "面向犬猫家庭的综合诊疗服务",
    "支持内科、外科、影像检查、住院护理等多环节协作",
    "适合需要进一步检查、专科判断或转诊会诊的情况",
    "服务重庆及周边宠物家庭",
  ],
  faq: [
    {
      question: "瑞鹏宠物医院西南转诊中心在哪里？",
      answer: "医院准确地址、所在区域和地图导航信息待补充。到院前建议先确认最新地址信息。",
    },
    {
      question: "这家医院主要提供哪些宠物医疗服务？",
      answer: "当前页面展示犬猫内科、外科手术评估、影像检查、住院护理和疑难病例转诊等方向，具体接诊范围请以医院确认信息为准。",
    },
    {
      question: "是否可以接收其他医院转诊？",
      answer: "如有转诊需求，建议提前整理既往病历、检查报告和用药记录，并通过待补充的咨询方式与医院确认。",
    },
    {
      question: "宠物什么情况适合来做进一步检查？",
      answer: "当症状反复、普通门诊治疗效果不明显，或需要影像检查、手术评估、住院观察和转诊会诊时，可先咨询医生。",
    },
    {
      question: "是否可以做影像检查？",
      answer: "影像检查项目、预约方式、设备信息和检查前准备事项待医院进一步确认。",
    },
    {
      question: "是否支持住院观察？",
      answer: "住院接收条件、护理安排和床位情况待补充，请在到院前向医院确认。",
    },
    {
      question: "到院前需要准备什么？",
      answer: "建议携带既往病历、检查报告、用药记录，并记录宠物近期饮食、排便和症状变化。",
    },
    {
      question: "如何预约或咨询？",
      answer: "预约电话、在线咨询方式和营业时间待补充，信息确认后将在本页面更新。",
    },
  ] satisfies HospitalFaq[],
  disclaimer: "页面内容仅用于医院信息介绍，具体诊疗建议以医生面诊为准。",
  seo: {
    title: "瑞鹏宠物医院西南转诊中心｜重庆宠物转诊与犬猫专科诊疗服务",
    description:
      "瑞鹏宠物医院西南转诊中心位于重庆，提供犬猫内科、外科、影像检查、住院护理、疑难病例转诊等宠物医疗服务。地址、电话和营业时间待补充。",
    keywords: [
      "瑞鹏宠物医院西南转诊中心",
      "重庆宠物医院",
      "重庆宠物转诊中心",
      "重庆犬猫医院",
      "重庆宠物影像检查",
      "重庆宠物外科",
      "重庆宠物住院",
      "宠物疑难病例转诊",
      "犬猫内科",
      "犬猫外科",
    ],
    canonicalPath: "/hospitals/ruipeng-xinan-referral-center",
    ogImage: "/hospitals/ruipeng-xinan-referral-center/hero.webp",
    noIndex: false,
  },
} as const;
