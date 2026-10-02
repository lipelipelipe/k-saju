import type { ElementKey, FocusKey, Locale } from "@/lib/dictionary";

type Line = Readonly<{ ko: string; en: string }>;
type ElementReading = Readonly<{
  opening: readonly Line[];
  strength: readonly Line[];
  reflection: readonly Line[];
  practice: readonly Line[];
  outlook: readonly Line[];
}>;

// 5 openings × 4 strengths × 5 reflections × 4 practices = 400 readings per element.
// The preview is selected from the same stable reading index, so the full reading is repeatable.
const catalog: Record<ElementKey, ElementReading> = {
  wood: {
    opening: [
      { ko: "당신 안에는 위를 향해 자라려는 나무의 기운이 있습니다. 새로운 가능성을 보면 마음이 먼저 깨어나고, 길이 뚜렷하지 않아도 한 걸음씩 길을 만들어갑니다.", en: "There is a growing, upward-reaching quality in you. A new possibility wakes something in you, and even when the way is unclear, you can make a path one step at a time." },
      { ko: "당신의 중심에는 봄의 나무처럼 다시 시작하는 힘이 자리합니다. 멈춤을 끝으로 보기보다 다음 성장을 준비하는 시간으로 읽어내는 감각이 있습니다.", en: "At your center is the renewing force of a tree in spring. You have a way of seeing a pause as preparation for growth rather than proof that something has ended." },
      { ko: "나무의 기운은 당신에게 호기심과 긴 호흡을 함께 줍니다. 당장의 답보다 더 나은 질문을 찾고, 작은 단서를 실제 가능성으로 키우는 편입니다.", en: "Wood gives you both curiosity and a long view. You look for a better question instead of settling for an immediate answer, and you can grow a small clue into a real possibility." },
      { ko: "당신은 주변의 여지를 먼저 알아채는 사람입니다. 아직 이름 붙지 않은 생각이나 관계의 가능성을 감지하고, 거기에 자랄 공간을 내어줍니다.", en: "You are quick to notice room for something new. You sense the potential in an unnamed idea or an unfinished connection, then make space for it to grow." },
      { ko: "당신의 에너지는 뿌리내리고 뻗어가는 나무를 닮았습니다. 단단한 방향감각이 있으면서도, 계절이 달라지면 새로운 방식으로 자랄 줄 압니다.", en: "Your energy resembles a tree putting down roots and reaching outward. You have a strong sense of direction, yet know how to grow differently when the season changes." },
    ],
    strength: [
      { ko: "특히 사람과 아이디어에 시간을 들여 뿌리내리게 할 때 당신의 끈기가 빛납니다.", en: "Your persistence shows most when you give people and ideas enough time to take root." },
      { ko: "당신의 낙관은 막연한 기대가 아니라, 다음에 시도할 일을 찾아내는 실천적인 희망에 가깝습니다.", en: "Your optimism is not wishful thinking; it is the practical hope of finding something worth trying next." },
      { ko: "서로 다른 관점을 연결해 모두가 함께 자랄 수 있는 방향을 찾는 능력이 있습니다.", en: "You can connect different points of view and find a direction in which everyone has room to grow." },
      { ko: "새로운 시작을 두려워하지 않으면서도, 이미 시작한 일을 꾸준히 돌보는 균형이 당신의 강점입니다.", en: "You can welcome a fresh start while still caring consistently for what you have already begun." },
    ],
    reflection: [
      { ko: "모두의 기대에 맞춰 가지를 뻗다 보면 자신의 중심을 잠시 놓칠 수 있습니다.", en: "When you stretch toward everyone's expectations, you can briefly lose touch with your own center." },
      { ko: "성장을 서두르는 날에는 아직 싹트지 않은 가능성을 실패로 오해하기 쉽습니다.", en: "On days when you rush to grow, it is easy to mistake a possibility that has not sprouted yet for failure." },
      { ko: "도움을 주고 싶은 마음이 앞서면, 상대가 스스로 길을 찾을 시간을 대신 채워버릴 때도 있습니다.", en: "When your wish to help takes the lead, you may fill the space someone else needs to find their own way." },
      { ko: "새로운 선택지가 나타날 때마다 방향을 바꾸면, 이미 쌓은 힘이 흩어질 수 있습니다.", en: "Changing direction with every new option can scatter the momentum you have already built." },
      { ko: "당신이 키워온 관계와 계획이 늘 같은 방식으로 자라야 하는 것은 아닙니다.", en: "The relationships and plans you have nurtured do not have to keep growing in the same way." },
    ],
    practice: [
      { ko: "지금 가장 중요한 한 가지를 적어두고, 이번 주에는 그 일에 먼저 시간을 내어보세요.", en: "Write down the one thing that matters most right now, and give it the first claim on your time this week." },
      { ko: "새로운 계획 하나를 더하기 전에, 시작한 일 하나를 마무리하거나 다음 단계까지 옮겨보세요.", en: "Before adding another plan, finish one thing you have started or move it into its next clear step." },
      { ko: "조언을 건네기 전에 한 번 더 물어보세요. 지금 상대에게 필요한 것이 해결책인지, 들어주는 일인지.", en: "Before offering advice, ask once more: does this person need a solution right now, or someone to listen?" },
      { ko: "계획에 여백을 남겨두세요. 성장에는 꾸준한 돌봄뿐 아니라 회복할 계절도 필요합니다.", en: "Leave some room in your plans. Growth needs steady care, and it also needs a season to recover." },
    ],
    outlook: [
      { ko: "다가오는 흐름은 오래 돌본 관계나 계획에 새 가지가 트일 여지를 만듭니다. 신뢰가 자란 곳에서 예상보다 좋은 기회가 싹틀 수 있습니다.", en: "The next stretch leaves room for a new branch to grow in a relationship or plan you have tended for a while. A promising opportunity may take root where trust has already grown." },
      { ko: "그동안 미뤄둔 대화에 부드럽게 손을 내밀어 보세요. 솔직한 마음을 나누면 관계가 다음 계절로 넘어갈 단서가 보입니다.", en: "Consider gently reopening a conversation you have put off. Sharing what is true for you may show how the relationship can enter its next season." },
      { ko: "새로운 제안은 빠른 확답보다 차분한 검토를 통해 당신에게 맞는 모양을 찾습니다. 서두르지 않아도 성장의 기회는 사라지지 않습니다.", en: "A new offer may take its right shape through calm consideration rather than a quick answer. You do not have to rush for a genuine opportunity to keep growing." },
      { ko: "당신의 다음 장은 혼자 모든 것을 키우는 데 있지 않습니다. 서로 돌봄을 주고받을 수 있는 사람을 가까이 두면 더 건강한 성장이 시작됩니다.", en: "Your next chapter does not ask you to grow everything on your own. Healthier progress begins when you stay close to people who can both offer and receive care." },
      { ko: "마음에 둔 가능성을 작은 행동으로 옮길 때입니다. 완벽한 조건을 기다리기보다 오늘의 한 걸음이 다음 길을 열어줄 수 있습니다.", en: "This is a good time to turn a possibility you care about into one small action. Rather than waiting for perfect conditions, let today's step reveal the next part of the path." },
    ],
  },
  fire: {
    opening: [
      { ko: "당신의 중심에는 어둠 속에서도 길을 비추는 불의 기운이 있습니다. 마음이 움직이면 표현이 뒤따르고, 당신의 존재감은 공간의 분위기를 따뜻하게 바꾸곤 합니다.", en: "At your center is the energy of fire, making a path visible even in the dark. When something moves you, expression follows, and your presence can warm the atmosphere around you." },
      { ko: "불의 기운은 당신에게 생생한 호기심과 사람을 끌어당기는 온기를 줍니다. 의미 있는 일을 발견하면 그 열정을 주변과 나누며 함께 앞으로 나아갑니다.", en: "Fire gives you vivid curiosity and a warmth that draws people in. When you find something meaningful, you share the enthusiasm and help others move forward with you." },
      { ko: "당신은 순간의 분위기와 사람의 마음을 환하게 밝혀주는 사람입니다. 사소한 만남에서도 기쁨의 불씨를 발견해 오래 기억할 장면으로 만드는 재능이 있습니다.", en: "You have a way of bringing light to a moment and to the people in it. Even an ordinary meeting can become a lasting memory when you spot its small spark of joy." },
      { ko: "당신 안의 불은 방향을 발견하면 크게 타오르는 추진력입니다. 낯선 시작 앞에서 망설이기보다 가능성에 다가가며, 행동으로 다른 이들의 용기도 북돋습니다.", en: "The fire within you is a strong drive once it finds a direction. Instead of shrinking from an unfamiliar beginning, you approach its possibility and encourage others through action." },
      { ko: "당신의 에너지는 온기를 나누는 화롯불처럼 사람 사이를 가깝게 합니다. 감정을 숨기기보다 진심을 전하는 편이고, 그 솔직함이 관계에 생기를 불어넣습니다.", en: "Your energy brings people closer, like a hearth shared on a cold night. You tend to express what you feel rather than hide it, and that sincerity gives relationships life." },
    ],
    strength: [
      { ko: "당신의 열정은 망설이는 사람에게 첫걸음을 내딛을 용기를 건넵니다.", en: "Your enthusiasm can give a hesitant person the courage to take a first step." },
      { ko: "무엇이 사람의 마음을 움직이는지 빠르게 알아채고, 중요한 순간에 진심을 분명히 전합니다.", en: "You quickly sense what moves people, and can express your sincerity clearly when it matters." },
      { ko: "즐거움과 의미를 일에 불어넣어 지친 분위기를 되살리는 재능이 있습니다.", en: "You can bring joy and purpose into a task and revive a room that has grown tired." },
      { ko: "좋아하는 것을 향한 용기 있는 몰입이 새로운 가능성을 현실로 바꾸곤 합니다.", en: "Your wholehearted commitment to what you love can turn a new possibility into something real." },
    ],
    reflection: [
      { ko: "늘 밝고 괜찮은 사람으로 보이려 애쓰다 보면 자신의 피로를 늦게 알아차릴 수 있습니다.", en: "Trying to always seem bright and fine can make you slow to notice your own fatigue." },
      { ko: "강한 감정이 올라온 순간의 결정은, 마음이 식은 뒤 다르게 보일 수 있습니다.", en: "A decision made at the height of an emotion can look different once that feeling has cooled." },
      { ko: "여러 곳에 열정을 나누다 보면 정작 오래 타오를 한 가지에 쓸 에너지가 부족해질 때가 있습니다.", en: "When you spread your enthusiasm across too many things, you may have less energy for the one that could last." },
      { ko: "주변을 북돋우는 데 익숙해지면, 자신도 위로받고 싶다는 마음을 뒤로 미루기 쉽습니다.", en: "When you are used to encouraging everyone else, it can be easy to set aside your own need for comfort." },
      { ko: "빠른 반응과 솔직한 표현이 때로는 상대가 생각을 정리할 시간을 앞서갈 수 있습니다.", en: "A quick response and honest expression can sometimes move faster than another person can process." },
    ],
    practice: [
      { ko: "하루 중 아무에게도 보여줄 필요 없는 휴식 시간을 정하고, 그 시간만큼은 지켜주세요.", en: "Choose a pocket of rest each day that you do not have to show or justify to anyone, and protect it." },
      { ko: "중요한 결정을 앞두었다면 하룻밤의 여유를 두고, 다음 날에도 같은 마음인지 확인해보세요.", en: "Before an important decision, give it one night and check whether it still feels right the next day." },
      { ko: "이번 주에 가장 오래 돌보고 싶은 목표 하나를 정해, 흩어진 에너지를 그곳에 모아보세요.", en: "Pick one goal you want to tend over time this week, and gather some of your scattered energy there." },
      { ko: "늘 힘을 주는 역할만 맡지 말고, 믿을 수 있는 사람에게 오늘의 마음을 솔직히 들려주세요.", en: "You do not have to be the encouraging one every time; tell someone you trust how you really feel today." },
    ],
    outlook: [
      { ko: "앞으로는 진심을 나누는 대화가 관계의 온도를 바꾸는 계기가 될 수 있습니다. 서두르지 않고 상대의 이야기를 들을 때 따뜻한 확신이 자랍니다.", en: "An honest conversation may shift the temperature of an important relationship. A warm sense of certainty can grow when you listen without rushing toward an answer." },
      { ko: "당신의 관심을 끄는 새 기회가 다가오면, 첫 설렘만큼 지속할 힘이 있는지도 살펴보세요. 열정과 꾸준함이 만날 때 좋은 결과가 남습니다.", en: "If a new opportunity catches your eye, notice whether it has staying power as well as an exciting start. Good results come when enthusiasm meets consistency." },
      { ko: "마음속에 담아둔 감정을 부드럽게 꺼내기 좋은 때입니다. 솔직한 표현은 상대를 설득하기보다 서로를 더 정확히 알아가는 문을 엽니다.", en: "This may be a good time to gently voice a feeling you have kept inside. Honesty opens a door to understanding each other more clearly, rather than persuading someone." },
      { ko: "사람들과 함께하는 자리에서 당신의 활기가 뜻밖의 연결을 만듭니다. 무리하게 돋보이려 하지 않아도 자연스러운 온기가 좋은 인연을 부릅니다.", en: "Time with others may bring an unexpected connection through your natural energy. You do not have to perform; a genuine warmth can be invitation enough." },
      { ko: "다음 장은 더 크게 타오르는 데 있지 않고, 오래 지킬 수 있는 온기를 찾는 데 있습니다. 서로의 리듬을 존중하는 관계가 그 중심에 놓입니다.", en: "Your next chapter is less about burning brighter and more about finding a warmth you can sustain. A relationship that respects both people's rhythm may be at its heart." },
    ],
  },
  earth: {
    opening: [
      { ko: "당신에게는 누구나 잠시 기대어 숨을 돌릴 수 있는 땅의 기운이 있습니다. 서두르는 상황에서도 본질을 지키며, 말한 것을 행동으로 옮겨 신뢰를 쌓습니다.", en: "You carry the grounded energy of a place where others can pause and catch their breath. Even in a rush, you hold on to what matters and build trust by following through." },
      { ko: "대지처럼 묵직한 당신의 존재감은 주변에 안정감을 줍니다. 쉽게 흔들리지 않으면서도 눈앞의 사람과 일을 현실적으로 보살필 줄 압니다.", en: "Your steady presence offers others a sense of ground beneath their feet. You are not easily shaken, yet you know how to care for the people and work right in front of you." },
      { ko: "당신의 중심에는 시간이 지나도 남는 것을 만들어내는 힘이 있습니다. 큰 변화보다 매일의 작은 책임을 쌓아 오래 가는 결과를 만듭니다.", en: "At your center is the capacity to make things that last. Rather than relying on grand gestures, you build enduring results through small responsibilities met each day." },
      { ko: "흙의 기운은 당신에게 현실을 읽는 눈과 오래 품는 인내심을 줍니다. 막연한 생각을 차근차근 손에 잡히는 계획으로 바꿀 수 있습니다.", en: "Earth gives you a practical eye and the patience to stay with something. You can turn an uncertain idea into a plan people can actually hold and use." },
      { ko: "당신은 관계와 일에 든든한 기반을 마련하는 편입니다. 빠른 주목보다 서로 믿고 기댈 수 있는 구조가 얼마나 중요한지 알고 있습니다.", en: "You tend to create a dependable foundation for both relationships and work. You understand the value of structures where people can rely on one another, beyond quick recognition." },
    ],
    strength: [
      { ko: "상황이 복잡할수록 우선순위를 가려내고 지금 할 수 있는 일부터 시작합니다.", en: "When things become complicated, you can sort out the priorities and start with what is possible now." },
      { ko: "맡은 책임을 쉽게 내려놓지 않는 모습이 오랜 신뢰와 깊은 유대를 만듭니다.", en: "Your willingness to stay responsible creates long-standing trust and deep bonds." },
      { ko: "말뿐인 약속보다 꾸준한 행동으로 사람에게 안심을 건네는 능력이 있습니다.", en: "You reassure people through consistent action rather than promises that are only words." },
      { ko: "서로 다른 필요를 조율해 많은 사람이 머물 수 있는 공통의 기반을 찾습니다.", en: "You can balance different needs and find common ground where more people can feel at home." },
    ],
    reflection: [
      { ko: "다른 사람의 걱정까지 책임지려다 보면 변화의 기회를 짐처럼 느낄 수 있습니다.", en: "Taking responsibility for other people's worries can make a promising change feel like a burden." },
      { ko: "익숙한 방식을 지키느라 이미 끝난 일에 필요한 작별을 미루고 있지는 않은지 살펴보세요.", en: "Notice whether protecting a familiar routine is delaying a goodbye that something finished may need." },
      { ko: "누구든 의지할 수 있는 사람이 되려 애쓰면서 자신의 필요를 마지막 순서에 둘 때가 있습니다.", en: "In trying to be someone everyone can rely on, you may put your own needs last." },
      { ko: "조심스러운 판단이 계속 쌓이면 새로운 선택을 시작하기에 너무 많은 근거를 기다릴 수 있습니다.", en: "If every cautious judgment needs one more reason, you may wait too long to begin a worthwhile new choice." },
      { ko: "끈기와 고집이 비슷해지는 순간에는 지금의 노력에 다른 방법이 필요한지 되돌아볼 필요가 있습니다.", en: "When persistence starts to resemble stubbornness, it can help to ask whether your current effort needs a different approach." },
    ],
    practice: [
      { ko: "이번 주에 맡을 일과 맡지 않을 일을 구분해보세요. 경계도 안정감을 지키는 기반입니다.", en: "Name what you will take on this week and what you will not. Boundaries are part of a stable foundation." },
      { ko: "끝난 일에 작은 마무리 의식을 만들어주세요. 비워진 자리가 새로 심을 것을 위한 땅이 됩니다.", en: "Create a small closing ritual for something that has ended. The space it frees can become ground for what comes next." },
      { ko: "믿을 만한 사람 한 명에게 실질적으로 필요한 도움을 구체적으로 부탁해보세요.", en: "Ask one trustworthy person for a specific, practical kind of support you genuinely need." },
      { ko: "정보를 더 모으기 전에 가장 작은 시험 단계부터 정해 가능성을 직접 확인해보세요.", en: "Before gathering more information, choose the smallest test you can run to check the possibility for yourself." },
    ],
    outlook: [
      { ko: "차근히 다져온 노력이 가시적인 결실로 이어질 가능성이 있습니다. 결과를 지키는 힘은 다음 성장을 위한 기반이 됩니다.", en: "Work you have steadily tended may begin to show visible results. The ability to protect those gains becomes ground for your next stage of growth." },
      { ko: "관계에서는 화려한 말보다 평소의 작은 배려가 더 큰 답을 건넵니다. 서로 믿을 수 있는 일상을 함께 만드는 것이 가까워지는 길입니다.", en: "In relationships, everyday consideration may answer more than grand words. Creating a dependable routine together can be a way of drawing closer." },
      { ko: "새 책임을 맡을 기회가 오면 혼자 감당할 몫과 함께 나눌 몫을 먼저 살펴보세요. 건강한 협력이 더 오래가는 성과를 만듭니다.", en: "If a new responsibility appears, first sort what is yours to carry from what can be shared. Healthy cooperation builds results that last longer." },
      { ko: "그동안 미뤄왔던 생활의 정리가 마음의 여유를 되찾아줄 수 있습니다. 작은 공간을 비우면 다음 계획을 위한 자리도 생깁니다.", en: "Tending to a practical matter you have postponed may restore some breathing room. Clearing a small space can make room for the next plan, too." },
      { ko: "안정은 모든 것이 변하지 않는 상태가 아니라, 변화 속에서도 기댈 기반이 있는 상태입니다. 서로의 속도를 존중하는 관계가 힘이 됩니다.", en: "Stability does not mean nothing changes; it means having something to lean on while it does. A relationship that honors each person's pace can help." },
    ],
  },
  metal: {
    opening: [
      { ko: "당신 안에는 복잡한 일에서 핵심을 찾아내는 맑고 단단한 금속의 기운이 있습니다. 기준이 분명하고, 옳다고 믿는 일에는 책임 있게 나섭니다.", en: "Within you is the clear, resilient quality of metal: the ability to find what matters in a complicated situation. Your standards are distinct, and you take responsibility for what you believe is right." },
      { ko: "금의 기운은 당신에게 섬세한 분별력과 정직함을 줍니다. 겉으로 드러난 모습에만 머물지 않고, 무엇이 진짜 중요한지 살펴보는 편입니다.", en: "Metal gives you discernment and honesty. You tend to look past appearances and ask what is genuinely important in a situation." },
      { ko: "당신은 불필요한 것을 걷어내고 본질을 남기는 데 능숙합니다. 분명한 표현과 일관된 태도가 흔들리는 순간의 방향을 잡아줍니다.", en: "You are good at clearing away what is unnecessary and preserving what matters. Clear expression and a consistent stance can offer direction in unsettled moments." },
      { ko: "당신의 기운은 잘 다듬어진 금속처럼 강인함과 섬세함을 함께 지닙니다. 책임을 맡았을 때 끝까지 해내며, 작은 완성도도 소중히 여깁니다.", en: "Your energy holds both resilience and refinement, like carefully worked metal. When you take responsibility for something, you see it through and care about the details." },
      { ko: "당신은 경계가 흐려진 자리에서 기준을 세우고, 말과 행동이 일치하는 모습을 중요하게 여깁니다. 그 신뢰가 당신의 조용한 영향력입니다.", en: "When boundaries blur, you can establish a standard and value consistency between words and actions. That trust is a quiet form of influence." },
    ],
    strength: [
      { ko: "복잡한 선택지에서 핵심 기준을 찾아 우선순위를 세우는 감각이 있습니다.", en: "You can identify the deciding principle in a complicated choice and set a clear priority." },
      { ko: "정직한 피드백을 부드럽고 명확하게 전해 함께 더 나은 결과를 만들 수 있습니다.", en: "You can offer honest feedback with enough care and clarity to help everyone do better work." },
      { ko: "눈앞의 보상보다 오랫동안 지켜온 가치를 택하는 일관성이 있습니다.", en: "You have the consistency to choose a value you have held for a long time over an immediate reward." },
      { ko: "꼼꼼한 마무리와 약속을 지키는 태도로 결과물에 신뢰를 더합니다.", en: "Your careful finishing and dependable follow-through make the work easier to trust." },
    ],
    reflection: [
      { ko: "높은 기준이 자신을 향한 지나친 엄격함으로 바뀌지는 않는지 살펴보세요.", en: "Notice whether your high standards are turning into unnecessary severity toward yourself." },
      { ko: "정답을 찾는 동안 지금 충분히 좋은 선택을 시작할 기회를 놓칠 때도 있습니다.", en: "While looking for the perfect answer, you may miss a chance to begin with a choice that is already good enough." },
      { ko: "분명한 말이 필요할 때도 있지만, 상대가 받아들일 여백까지 함께 살펴야 합니다.", en: "A clear statement may be needed, yet it also helps to leave room for how the other person will receive it." },
      { ko: "실수를 바로잡는 데 집중하면 이미 잘 해낸 부분까지 작게 보일 수 있습니다.", en: "Focusing on correcting mistakes can make the parts you have already done well seem smaller." },
      { ko: "통제하기 어려운 변수까지 정리하려다 보면 뜻밖의 배움이 들어올 자리가 줄어듭니다.", en: "Trying to control every uncertain variable can leave less room for an unexpected lesson to reach you." },
    ],
    practice: [
      { ko: "완성도보다 시작이 중요한 일 하나를 정하고, 오늘의 초안을 만들어보세요.", en: "Choose one task where starting matters more than polish, and make a first draft today." },
      { ko: "피드백을 건넬 때 잘된 점과 다음에 시도할 점을 함께 말해 균형을 잡아보세요.", en: "When giving feedback, balance what is working with one thing to try next." },
      { ko: "지금까지 해낸 일 세 가지를 기록해보세요. 아직 고칠 점과 이미 이룬 것을 함께 보세요.", en: "Write down three things you have accomplished. Let what is already done sit beside what still needs work." },
      { ko: "오늘은 계획에 없던 작은 선택 하나를 허용하고, 결과를 평가하기보다 경험해보세요.", en: "Allow one small, unplanned choice today, and experience it before deciding what it means." },
    ],
    outlook: [
      { ko: "중요한 대화가 복잡했던 상황을 한층 분명하게 만들 수 있습니다. 기준을 공유하고 서로의 관점도 들으면 믿을 수 있는 답이 가까워집니다.", en: "An important conversation may bring clarity to a situation that felt tangled. Share your standards and listen to the other view; a dependable answer may come closer." },
      { ko: "맡아온 일의 세부를 다듬는 과정에서 새로운 책임이나 인정이 생길 수 있습니다. 결과를 혼자 떠안지 않고 성과를 함께 나누세요.", en: "Refining the details of work you have carried may lead to new responsibility or recognition. Let the credit be shared instead of carrying the result alone." },
      { ko: "관계에서는 침묵으로 상대를 시험하기보다 원하는 바를 정직하게 말하는 것이 오해를 줄입니다. 부드럽고 분명한 표현이 다음 장을 엽니다.", en: "In relationships, saying what you want honestly can clear more than testing someone through silence. A gentle, clear expression can open the next chapter." },
      { ko: "선택지가 몇 가지 나타나도 완벽한 확신을 기다릴 필요는 없습니다. 핵심 가치에 맞는 쪽을 고르면 나머지는 걸으며 다듬을 수 있습니다.", en: "Even if several options appear, you do not need to wait for perfect certainty. Choose the one aligned with your core values and refine the rest as you go." },
      { ko: "오래 지켜온 기준에 작은 유연성을 더할 때 협력의 문이 열릴 수 있습니다. 원칙을 버리지 않으면서 더 나은 방법을 함께 찾을 때입니다.", en: "Adding a little flexibility to a value you have long kept may open a door to collaboration. This is a chance to preserve the principle while finding a better shared method." },
    ],
  },
  water: {
    opening: [
      { ko: "당신 안에는 여러 길을 돌아 결국 바다에 닿는 물의 기운이 흐릅니다. 사람과 상황의 미묘한 변화를 빠르게 읽고, 정답이 하나가 아닐 때도 길을 찾아갑니다.", en: "Within you is the energy of water, able to travel many paths before finding the sea. You read subtle shifts in people and situations and can find a way when there is no single right answer." },
      { ko: "물의 기운은 당신에게 깊이 느끼고 넓게 생각하는 힘을 줍니다. 하나의 시선에 갇히지 않고 여러 가능성을 살피며 상황을 이해합니다.", en: "Water gives you the capacity to feel deeply and think broadly. You are not easily confined to one point of view and can understand a situation through several possibilities." },
      { ko: "당신은 흐름을 살피며 방향을 조정할 줄 아는 사람입니다. 예상하지 못한 변화 앞에서도 굳어버리기보다 새 길을 찾아 움직입니다.", en: "You know how to read a current and adjust your direction. Faced with an unexpected change, you are more likely to find a new route than to freeze." },
      { ko: "잔잔한 수면 아래 깊은 감수성과 통찰이 자리합니다. 말로 다 표현되지 않은 마음을 알아차리고, 필요한 순간에 조용한 이해를 건넵니다.", en: "Beneath a calm surface lives sensitivity and insight. You notice feelings that have not been put into words and can offer quiet understanding at the right moment." },
      { ko: "당신의 기운은 서두르지 않고도 먼 곳에 닿는 강물과 닮았습니다. 한동안 보이지 않는 곳에서 준비해온 생각이 적절한 때에 힘을 얻습니다.", en: "Your energy resembles a river that reaches far without needing to hurry. An idea you have been shaping out of view can gather strength at the right time." },
    ],
    strength: [
      { ko: "서로 다른 사람의 관점을 이해하고 중간에서 의미 있는 연결을 만듭니다.", en: "You can understand different perspectives and build a meaningful connection between them." },
      { ko: "불확실한 상황에서 정보와 감정을 함께 읽어 유연한 대응을 찾아냅니다.", en: "In uncertain situations, you can read both information and emotion to find a flexible response." },
      { ko: "깊이 듣는 태도로 상대가 자기 생각을 발견할 수 있는 안전한 공간을 만듭니다.", en: "Your deep listening creates a safe space where someone else can discover what they think." },
      { ko: "잠시 물러나 큰 흐름을 바라본 뒤, 알맞은 순간에 행동하는 감각이 있습니다.", en: "You can step back to see the wider current, then act when the timing feels right." },
    ],
    reflection: [
      { ko: "모든 감정과 가능성을 헤아리다 결정을 내려야 할 순간을 지나칠 수 있습니다.", en: "Considering every feeling and possibility can carry you past the moment when a decision is due." },
      { ko: "상대의 마음을 잘 읽는 만큼, 그 마음까지 자신의 책임처럼 품을 때가 있습니다.", en: "Because you read others well, you may sometimes carry their feelings as if they were yours to resolve." },
      { ko: "상황에 맞추는 유연함이 자신이 진짜 원하는 것을 숨기는 방식이 되지는 않는지 보세요.", en: "Notice whether adapting to a situation is becoming a way to hide what you genuinely want." },
      { ko: "생각이 깊어질수록 시작 전에 더 많은 확신을 요구할 수 있습니다.", en: "The deeper your thinking goes, the more certainty you may demand before beginning." },
      { ko: "혼자 조용히 정리하는 시간이 길어지면 필요한 대화까지 뒤로 밀릴 수 있습니다.", en: "If you spend too long processing alone, an important conversation can keep getting postponed." },
    ],
    practice: [
      { ko: "선택지마다 장단점을 더 적기 전에, 지금 가장 끌리는 방향을 먼저 말로 표현해보세요.", en: "Before listing more pros and cons, say aloud which direction you feel most drawn to right now." },
      { ko: "도움을 주기 전에 상대의 문제와 자신의 감정을 구분할 잠깐의 거리를 가져보세요.", en: "Before offering help, take a moment to separate the other person's problem from your own feelings." },
      { ko: "이번 주에는 다른 사람의 계획보다 자신의 바람을 담은 약속 하나를 먼저 일정에 넣으세요.", en: "This week, put one commitment that reflects your own wish on the calendar before someone else's plan." },
      { ko: "완벽한 확신이 오기를 기다리는 일 하나를 작은 실험으로 시작해보세요.", en: "Turn one thing you are waiting to feel certain about into a small experiment you can begin." },
    ],
    outlook: [
      { ko: "앞으로의 흐름은 오래 미뤄둔 대화에 새로운 물길을 낼 수 있습니다. 먼저 판단하기보다 상대의 생각을 물을 때 뜻밖의 연결이 생깁니다.", en: "The coming current may open a new channel for a conversation you have put off. An unexpected connection can emerge when you ask about the other person's view before judging." },
      { ko: "새로운 방향이 보이면 모든 것을 바꾸기보다 작은 시험부터 해보세요. 직접 움직이는 동안 당신에게 맞는 길의 윤곽이 드러납니다.", en: "If you spot a new direction, try a small experiment rather than changing everything at once. The shape of your path can emerge while you are moving." },
      { ko: "마음속 감정을 나눌 때 관계에 더 깊은 이해가 들어옵니다. 정답을 요구하지 않는 솔직한 대화가 부드럽게 문을 엽니다.", en: "Sharing what you feel can bring deeper understanding into a relationship. An honest conversation without demands for an answer can open the door gently." },
      { ko: "그동안 조용히 준비해온 생각이 협력자를 만날 수 있습니다. 필요한 것을 구체적으로 말하면 당신의 흐름에 기꺼이 함께할 사람을 알아봅니다.", en: "An idea you have been quietly preparing may find a collaborator. Name what you need clearly and you can recognize someone willing to join your current." },
      { ko: "당신의 다음 장은 더 많은 선택지를 모으는 것보다 한 방향으로 흐르기 시작하는 데 있습니다. 작고 분명한 첫걸음이 마음의 물길을 엽니다.", en: "Your next chapter is less about gathering more options and more about letting yourself flow in one direction. A small, clear first step can open the way." },
    ],
  },
};

function stableHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function getReadingAtIndex(element: ElementKey, index: number, locale: Locale) {
  if (!Number.isInteger(index) || index < 0 || index >= 400) throw new RangeError("Reading index must be between 0 and 399.");
  const parts = catalog[element];
  const openingIndex = Math.floor(index / 80);
  const strengthIndex = Math.floor(index / 20) % 4;
  const reflectionIndex = Math.floor(index / 4) % 5;
  const practiceIndex = index % 4;
  const outlookIndex = index % 5;
  return {
    index,
    first: `${parts.opening[openingIndex][locale]} ${parts.strength[strengthIndex][locale]}`,
    second: `${parts.reflection[reflectionIndex][locale]} ${parts.practice[practiceIndex][locale]}`,
    locked: parts.outlook[outlookIndex][locale],
  };
}

export function getReading(element: ElementKey, identity: string, locale: Locale) {
  return getReadingAtIndex(element, stableHash(`${element}|${identity}`) % 400, locale);
}

const focusReadings: Record<ElementKey, Record<FocusKey, Line>> = {
  wood: {
    love: { ko: "관계에서는 함께 성장할 수 있는 대화가 중요합니다. 마음을 읽어주기만 기다리기보다 원하는 친밀감과 각자의 시간을 차분히 나눠보세요. 새로운 인연을 찾는 중이라면 익숙한 유형보다 가치관을 존중해주는 사람에게 주의를 기울이세요.", en: "In love, the conversations that make room for mutual growth matter most. Rather than waiting for someone to read your mind, talk calmly about the closeness and personal space you want. If you are meeting someone new, notice who respects your values—not only who feels familiar." },
    wealth: { ko: "재정에서는 급격한 확장보다 꾸준히 자라는 구조가 잘 맞습니다. 오래 가져갈 목표와 단기 지출을 나누고, 새로운 투자나 구매는 충분히 이해한 뒤 결정하세요. 당신의 아이디어가 수입으로 연결되려면 반복 가능한 계획과 현실적인 숫자가 필요합니다.", en: "Your financial energy favors structures that grow steadily over dramatic expansion. Separate long-term goals from near-term spending, and understand an investment or purchase before committing. For an idea to become income, give it a repeatable plan and realistic numbers." },
    career: { ko: "일에서는 배우고 발전할 여지가 있는 프로젝트가 당신의 몰입을 깨웁니다. 동시에 새 기회를 좇느라 현재의 성과를 미완성으로 남기지 않도록 하세요. 다음 단계로 가기 전에 지금까지 만든 것을 정리하고, 협업 상대와 책임 범위를 분명히 합의하면 성장의 기반이 단단해집니다.", en: "At work, projects with room to learn and improve can bring out your best focus. Take care not to leave current progress unfinished while chasing the next opportunity. Before moving on, gather what you have built and agree on clear responsibilities with collaborators." },
  },
  fire: {
    love: { ko: "사랑에서는 열정만큼 일관된 관심이 신뢰를 만듭니다. 마음이 뜨거운 날의 약속을 실제 생활에서 지킬 수 있는지 살피고, 상대가 편안하게 말할 수 있는 속도도 존중하세요. 좋은 인연은 서로를 빛내면서 각자의 불씨도 지켜줍니다.", en: "In love, dependable attention builds trust alongside passion. Notice whether a promise made in a bright moment can be kept in ordinary life, and respect the pace at which the other person feels safe to speak. A good bond lets both people shine without dimming their own light." },
    wealth: { ko: "재정에서는 자신감 있는 선택이 강점이지만, 흥분이 큰 제안일수록 조건을 천천히 확인해야 합니다. 기분에 따라 달라지는 지출을 살피고, 즐거움과 안전을 함께 지키는 예산을 세워보세요. 에너지가 오를 때 자동 저축이나 구체적인 한도를 정해두면 더 큰 목표도 현실에 가까워집니다.", en: "Confidence can help you act on financial opportunities, but the more exciting an offer feels, the more slowly you should review its terms. Notice spending that follows your mood and budget for both enjoyment and security. Automatic savings or a clear limit can protect your bigger goals." },
    career: { ko: "커리어에서는 발표와 시작에 강한 에너지가 있습니다. 그 힘을 오래 가는 성과로 연결하려면 팀이 기대하는 결과와 마감 조건을 초반에 확인하고, 진행 상황을 꾸준히 공유하세요. 당신의 리더십은 주목을 받는 순간뿐 아니라 다른 사람의 성장을 도울 때 더욱 선명해집니다.", en: "Your career energy is strong in launches and presentations. To turn that spark into lasting results, confirm the team's outcomes and deadlines early, then share progress consistently. Your leadership becomes most compelling not only when it draws attention, but when it helps others grow." },
  },
  earth: {
    love: { ko: "관계에서 안정은 중요하지만, 익숙함만으로 서로를 이해했다고 여기지는 마세요. 일상의 책임을 나누고, 각자에게 필요한 변화도 함께 이야기해보세요. 믿음직한 유대는 한 사람이 버티는 구조가 아니라 두 사람이 기대고 조정하는 관계에서 깊어집니다.", en: "Stability matters in love, but familiarity alone does not mean you have stopped needing to understand each other. Share everyday responsibilities and talk about the changes each of you needs. Dependable love deepens when two people can lean and adjust together, rather than one person doing all the holding." },
    wealth: { ko: "재정에서는 기반을 점검하고 장기 목표를 현실적인 단계로 나누는 접근이 어울립니다. 가족이나 가까운 사람의 필요를 돕더라도 자신을 위한 여유와 비상 자금을 먼저 확보하세요. 큰 약속을 서두르기보다 조건을 비교하고, 감당할 수 있는 범위 안에서 꾸준히 이어가는 편이 단단합니다.", en: "Your financial focus suits checking the foundation and breaking long-term goals into practical steps. Even when helping family or friends, reserve breathing room and an emergency buffer for yourself. Compare terms before making a large commitment, and build steadily within what you can sustain." },
    career: { ko: "일에서는 운영과 신뢰가 필요한 역할에서 실력이 드러납니다. 모든 세부를 혼자 챙기는 대신, 책임을 나누고 반복 업무를 정리해 중요한 일에 쓸 시간을 확보하세요. 꾸준한 기여를 눈에 보이게 기록하고 자신의 다음 성장에 필요한 지원을 구체적으로 요청해도 좋습니다.", en: "Your strengths show in roles that depend on operations and trust. Instead of carrying every detail yourself, share responsibilities and simplify recurring work so you can focus on what matters. Keep a visible record of your contribution and ask specifically for the support your next stage requires." },
  },
  metal: {
    love: { ko: "사랑에서는 분명한 기준과 솔직한 표현이 큰 장점입니다. 다만 완벽한 상대를 평가하듯 찾기보다, 서로 실수를 고치고 신뢰를 쌓을 의지가 있는지를 보세요. 필요한 것을 비난 없이 구체적으로 말하고, 상대의 방식이 다를 때는 먼저 맥락을 물어보세요.", en: "Clear standards and honest expression are strengths in love. Instead of searching for a flawless partner, notice whether both people are willing to repair mistakes and build trust. Name what you need without blame, and ask about the context when the other person's approach differs from yours." },
    wealth: { ko: "재정에서는 비교와 기록이 당신의 판단력을 잘 살려줍니다. 익숙한 선택이라도 수수료와 위험을 다시 확인하고, 단기 절약이 장기 목표를 해치지 않는지 살펴보세요. 정보를 충분히 검토한 뒤 마감 시점을 정하면, 분석을 계속 미루지 않고 실용적인 결정을 내릴 수 있습니다.", en: "Comparison and clear records bring out your financial judgment. Recheck fees and risk even in a familiar choice, and make sure short-term savings do not undercut a long-term goal. After reviewing enough information, set a decision date so analysis does not become indefinite delay." },
    career: { ko: "커리어에서 품질과 공정한 기준을 만드는 능력이 돋보입니다. 다만 완벽함을 혼자 책임지면 팀의 속도와 자신의 여유가 모두 줄어들 수 있습니다. '완료'의 기준을 미리 합의하고, 다른 사람에게 맡길 일과 직접 다듬을 일을 구분하면 영향력과 균형을 함께 지킬 수 있습니다.", en: "Your career strength is setting a high standard for quality and fairness. But carrying perfection alone can reduce both your team's momentum and your own capacity. Agree on what 'done' means, then separate what can be delegated from what truly needs your refinement." },
  },
  water: {
    love: { ko: "관계에서 깊이 듣는 능력은 선물이지만, 자신의 바람도 같은 무게로 나눠야 합니다. 상대가 무엇을 느끼는지 추측하기보다 궁금한 것을 묻고, 당신에게 필요한 안정과 자유도 말해보세요. 진짜 연결은 두 사람의 마음이 모두 대화 안에 있을 때 만들어집니다.", en: "Your ability to listen deeply is a gift in love, but your own wishes deserve equal room. Ask what you are curious about instead of guessing how the other person feels, and name the steadiness and freedom you need. Real connection happens when both people's inner lives enter the conversation." },
    wealth: { ko: "재정에서는 여러 선택지를 살피는 감각이 좋지만, 정보가 많을수록 결정을 미루기 쉽습니다. 고정비와 목표를 간단히 정리하고, 감당할 수 있는 위험의 선을 먼저 정하세요. 중요한 선택은 믿을 만한 자료와 전문가 의견으로 확인하고, 당신의 장기 방향과 맞는 한 가지 계획을 이어가보세요.", en: "You are good at seeing financial options, though more information can make decisions drift. Map your fixed costs and goals, then define the level of risk you can live with. Check important choices against reliable sources and qualified advice, and keep one plan aligned with your longer direction." },
    career: { ko: "일에서는 복잡한 정보를 연결하고 사람 사이의 빈틈을 메우는 능력이 자산입니다. 여러 프로젝트에 동시에 흘러가지 않도록 우선순위를 문서로 정하고, 중요한 협의는 말로만 남기지 마세요. 깊이 생각하는 시간과 실제 실행 시간을 따로 확보하면 통찰이 결과물로 이어집니다.", en: "Your career asset is connecting complex information and bridging gaps between people. Write down priorities so your energy does not flow into too many projects, and capture important agreements in writing. Protect separate time for deep thought and execution so insight becomes a finished result." },
  },
};

export function getPremiumFocus(element: ElementKey, focus: FocusKey, locale: Locale) {
  return focusReadings[element][focus][locale];
}
