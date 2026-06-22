export type TimelineItem = {
  id: number;
  year: number;
  type: "KOREA" | "WORLD";
  title: string;
  content: string;
};

export type EncyclopediaItem = {
  id: number;
  title: string;
  period: string;
  category: string;
  tags: string[];
  content: string;
  summary: string;
};

const timelines: TimelineItem[] = [
  {
    id: 1,
    year: 1876,
    type: "KOREA",
    title: "강화도 조약",
    content: "강화도 조약 체결로 조선이 근대 국제 질서 속에 편입되기 시작했다."
  },
  {
    id: 2,
    year: 1884,
    type: "KOREA",
    title: "갑신정변",
    content: "갑신정변이 일어나 급진 개화파가 근대적 정치 개혁을 시도했다."
  },
  {
    id: 3,
    year: 1894,
    type: "KOREA",
    title: "동학농민운동과 갑오개혁",
    content: "동학농민운동과 갑오개혁을 거치며 신분제와 국가 제도의 변화가 본격화되었다."
  },
  {
    id: 4,
    year: 1897,
    type: "KOREA",
    title: "대한제국 수립",
    content: "고종이 대한제국 수립을 선포하고 황제에 즉위했다."
  },
  {
    id: 5,
    year: 1905,
    type: "KOREA",
    title: "을사늑약",
    content: "을사늑약으로 대한제국의 외교권이 박탈되었다."
  },
  {
    id: 6,
    year: 1905,
    type: "WORLD",
    title: "러일전쟁 종결",
    content: "포츠머스 조약으로 러일전쟁이 종결되며 동아시아 국제 질서가 재편되었다."
  }
];

const persons: EncyclopediaItem[] = [
  {
    id: 1,
    title: "고종",
    period: "1852 - 1919",
    category: "대한제국 황제",
    tags: ["대한제국", "광무개혁", "황제"],
    content:
      "조선의 제26대 국왕이자 대한제국의 초대 황제이다. 대한제국 수립을 통해 자주 독립 국가의 위상을 세우려 했으며, 광무개혁을 추진했다.",
    summary: "대한제국 수립을 선포하고 근대적 국가 개혁을 추진한 군주."
  },
  {
    id: 2,
    title: "김옥균",
    period: "1851 - 1894",
    category: "급진 개화파",
    tags: ["개화파", "갑신정변", "근대개혁"],
    content:
      "급진 개화파의 대표 인물이다. 갑신정변을 주도하며 근대적 정치 제도와 자주 독립 국가 건설을 시도했다.",
    summary: "갑신정변을 통해 근대적 정치 개혁을 시도한 급진 개화파 인물."
  },
  {
    id: 3,
    title: "전봉준",
    period: "1855 - 1895",
    category: "동학농민운동 지도자",
    tags: ["동학농민운동", "반봉건", "반외세"],
    content:
      "동학농민운동의 핵심 지도자이다. 탐관오리의 수탈과 외세 개입에 저항하며 사회 개혁을 요구했다.",
    summary: "동학농민운동을 이끌며 사회 개혁과 외세 배척을 요구한 지도자."
  }
];

const events: EncyclopediaItem[] = [
  {
    id: 1,
    title: "강화도 조약",
    period: "1876",
    category: "개항",
    tags: ["개항", "불평등조약", "조일수호조규"],
    content:
      "1876년 조선과 일본 사이에 체결된 조약이다. 조선이 개항하게 된 계기였으며, 이후 근대 국제 질서와 외세의 압력이 본격화되었다.",
    summary: "조선이 근대 국제 질서 속으로 편입되는 계기가 된 조약."
  },
  {
    id: 2,
    title: "갑오개혁",
    period: "1894 - 1896",
    category: "제도 개혁",
    tags: ["갑오개혁", "신분제폐지", "근대화"],
    content:
      "1894년부터 추진된 근대적 제도 개혁이다. 신분제 폐지, 과거제 폐지 등 전통적 질서를 바꾸는 여러 개혁이 포함되었다.",
    summary: "전통적 신분 질서와 행정 체계를 바꾸려 한 근대 개혁."
  },
  {
    id: 3,
    title: "대한제국 수립",
    period: "1897",
    category: "국가 수립",
    tags: ["대한제국", "고종", "광무개혁"],
    content:
      "1897년 고종이 황제에 즉위하며 대한제국을 선포한 사건이다. 조선이 자주 독립 국가임을 대내외에 드러내려는 의미를 가졌다.",
    summary: "조선이 자주 독립 국가임을 선포하고 황제국 체제를 수립한 사건."
  }
];

export function getTimelines() {
  return timelines;
}

export function getPersons() {
  return persons;
}

export function getEvents() {
  return events;
}

export function findPerson(id: string) {
  return getPersons().find((person) => person.id === Number(id));
}

export function findEvent(id: string) {
  return getEvents().find((event) => event.id === Number(id));
}

export function addTimeline(item: Omit<TimelineItem, "id">) {
  const nextItem = {
    ...item,
    id: Math.max(0, ...timelines.map((timeline) => timeline.id)) + 1
  };

  timelines.push(nextItem);
  return nextItem;
}

export function addPerson(item: Omit<EncyclopediaItem, "id">) {
  const nextItem = {
    ...item,
    id: Math.max(0, ...persons.map((person) => person.id)) + 1
  };

  persons.push(nextItem);
  return nextItem;
}

export function addEvent(item: Omit<EncyclopediaItem, "id">) {
  const nextItem = {
    ...item,
    id: Math.max(0, ...events.map((event) => event.id)) + 1
  };

  events.push(nextItem);
  return nextItem;
}
