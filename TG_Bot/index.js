const TelegramBot = require('node-telegram-bot-api');

const token = '8062095652:AAFt1nJn6xnZ-9nLPw0S696QLnOwiQG-spI';
const bot = new TelegramBot(token, { polling: true });

console.log('Бот запущен и готов работать');

const tours = {
  'Анталия': [
    { name: 'Старый город (Калеичи)', 
      desc: 'Этот город - сердце Анталии, окружённое древней крепостной стеной. Узкие мощёные улочки, османские особняки с резными балконами и апельсиновые деревья создают атмосферу уюта и старины. Здесь можно прогуляться мимо древнеримской башни Хыдырлык, полюбоваться закатом у старого порта и почувствовать дыхание веков в каждом камне.', 
      photo: 'https://extraguide.ru/images/sp/198d6c59a1edaa5b066eb53c45e06acc7c849026.jpg' },
    { name: 'Водопад Дюден', 
      desc: 'Водопад Дюден — одна из самых впечатляющих природных жемчужин Анталии. Его мощные струи падают прямо в Средиземное море с 40-метровой скалы, создавая живописное зрелище. Вокруг — уютный парк, пещеры и смотровые площадки, идеальные для прогулок и фото.', 
      photo: 'https://antcol.ru/wp-content/uploads/2021/02/WhatsApp-Image-2021-02-16-at-12.11.24.jpeg' },
    { name: 'Порт Анталии', 
      desc: 'Порт Анталии — живописная гавань, окружённая старинными каменными постройками и уютными кафе. Здесь средневековая атмосфера сочетается с современным уютом: яхты, прогулочные катера и набережная с видом на лазурные воды создают идеальное место для неспешных прогулок и морских экскурсий.', 
      photo: 'https://fileservice.sevenseashotels.com/files/md/resources/img/40c7518d-9d99-4566-b5f7-e9764d9d6d22.jpg' }
  ],

  'Рим - Венеция - Флоренция': [
    { name: 'Колизей', 
      desc: 'Колизей — символ величия Древнего Рима и один из самых узнаваемых памятников мира. Этот гигантский амфитеатр вмещал до 50 000 зрителей и был ареной для гладиаторских боёв, охот на зверей и грандиозных представлений, олицетворяя римскую страсть к зрелищам и архитектурному совершенству.', 
      photo: 'https://7d9e88a8-f178-4098-bea5-48d960920605.selcdn.net/43718e42-d4c7-45e6-ab03-0d08a9b46320/-/resize/x600/-/quality/smart_retina/' },
    { name: 'Площадь Сан-Марко', 
      desc: 'Площадь Сан-Марко — сердце Венеции и её главная достопримечательность, окружённая архитектурными шедеврами. Здесь возвышается величественный собор Святого Марка с золотыми мозаиками, колокольня Кампанила и Дворец дожей. Атмосфера площади пронизана историей, искусством и духом морской республики.', 
      photo: 'https://cdn.culture.ru/images/60476195-3bcf-5944-a8df-9e5d48ee5e83' },
    { name: 'Собор Санта-Мария-дель-Фьоре', 
      desc: 'Главный символ Флоренции, поражающий своим грандиозным куполом работы Брунеллески. Фасад собора украшен мрамором трёх цветов, а внутри — величественные фрески и панорама города с колокольни Джотто.', 
      photo: 'https://avatars.mds.yandex.net/i?id=c05f8b06827515141979e4b4e1d4fe57_l-4893015-images-thumbs&n=13' }
  ],

  'Пхукет': [
    { name: 'Пляж Патонг', 
      desc: 'Пляж Патонг — самый оживлённый и популярный пляж Пхукета, известный своей широкой полосой белого песка, чистой бирюзовой водой и активной ночной жизнью. Идеальное место для купания, водных развлечений и вечерних прогулок по набережной.', 
      photo: 'https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_65ca489a9472bd5004431657_65ca61dae13b2434bd716693/scale_1200' },
    { name: 'Большой Будда', 
      desc: 'Большой Будда — величественная 45-метровая статуя, расположенная на вершине холма Наккед. Отсюда открывается панорамный вид на южную часть Пхукета. Это не только религиозный символ, но и место уединения, умиротворения и духовного вдохновения.', 
      photo: 'https://i.pinimg.com/originals/9f/81/3f/9f813fc1975a61d6cb951f369c44d808.jpg' },
    { name: 'Храм Чалонг', 
      desc: 'Главный буддийский храм Пхукета и центр духовной жизни местных жителей.', 
      photo: 'https://i.pinimg.com/originals/dd/50/fb/dd50fbf28210b84eb9ea09f104d57e92.jpg' }
  ],

  'Дубай': [
    { name: 'Бурдж-Халифа', 
      desc: 'Самое высокое здание в мире (828 м) — символ инженерного чуда и амбиций Дубая. С его смотровой площадки открываются захватывающие панорамы города и пустыни.', 
      photo: 'https://photobooth.cdn.sports.ru/preset/post/6/dc/11e4853e8400c8c66b5e07b3f60bf.jpeg?f=webp&q=90' },
    { name: 'Дубай Молл и аквариум', 
      desc: 'Один из крупнейших торговых центров мира. Здесь находятся сотни магазинов, каток, водопад и огромный аквариум с подводным тоннелем, где можно увидеть акул и скатов.', 
      photo: 'https://avatars.dzeninfra.ru/get-zen_doc/118779/pub_5bd5d6d9fc8dfa00afd4547a_5bd5db4932ca1500aac63ff0/scale_1200' },
    { name: 'Бурдж-аль-Араб', 
      desc: 'Роскошный отель в форме паруса, ставший иконой современного Дубая. Его архитектура, сервис и внутреннее убранство делают его одним из самых фотографируемых зданий в мире.', 
      photo: 'https://s0.rbk.ru/v6_top_pics/media/img/2/45/756436380825452.jpg' }
  ],

  'Острова Санторини и Миконос': [
    { name: 'Белоснежные города', 
      desc: 'Миконос: Хора - сердце острова, где белоснежные домики, узкие мощеные улочки и знаменитые ветряные мельницы создают типичный кикладский пейзаж. Рядом – Маленькая Венеция: живописный район с домами на самом берегу моря, откуда открываются потрясающие закаты. Здесь царит оживлённая атмосфера: бутики, арт-галереи, бары и таверны с видом на волны.', 
      photo: 'https://images.skypicker.com/?image=https%3A%2F%2Fimages.kiwi.com%2Fphotos%2Foriginals%2Fmykonos_gr.jpg&width=992&height=600&quality=80&fit=crop&format=original' },
    { name: 'Легендарные пляжи', 
      desc: 'Пляж Камари – один из лучших на Санторини с чёрным вулканическим песком и кристально чистой водой. Здесь есть вся инфраструктура: шезлонги, таверны, бары и водные развлечения. Отличное место для спокойного отдыха с видом на скалы Меса-Вуно!', 
      photo: 'https://avatars.mds.yandex.net/get-altay/10328405/2a0000018ec8592415e422b527988f9f1bff/XXXL' },
    { name: 'Закаты и романтика', 
      desc: 'Санторини: Закат в Ойе — самый известный в Греции.', 
      photo: 'https://avatars.dzeninfra.ru/get-zen_doc/171054/pub_64f249f7712ba465335249b3_64f24ebbdef7f83261c06513/scale_1200' }
  ],

  'Мальдивы': [
    { name: 'Роскошные отели-над водой 🏝️', 
      desc: 'Визитная карточка Мальдив – знаменитые бунгало на сваях, стоящие прямо в бирюзовой лагуне. Лучшие: Conrad Maldives, Soneva Fushi, Four Seasons.', 
      photo: 'https://i.pinimg.com/originals/9a/f1/23/9af1235969b3cf0f2e64a81ace7c837d.jpg' },
    { name: 'Коралловые рифы и дайвинг 🐠', 
      desc: 'Мальдивы – одно из лучших мест для дайвинга с мантами, китовыми акулами и яркими кораллами. Топ-споты: Banana Reef, Maaya Thila, Hanifaru Bay.', 
      photo: 'https://static.tildacdn.com/tild3133-6630-4837-a639-633233303033/reef1.jpg' },
    { name: 'Романтические песчаные отмели 🌊', 
      desc: 'Уединённые белоснежные косы посреди океана – идеальное место для фото и пикников. Есть почти у всех резортов (например, на Veligandu Island).', 
      photo: 'https://www.escolhaviajar.com/wp-content/uploads/2018/01/jantar-sandbank.jpg' }
  ],

  'Париж': [
    { name: 'Эйфелева башня', 
      desc: 'Символ Парижа, построенный в 1889 году. С верхних этажей (276 м) открывается лучший вид на город. Вечером башня подсвечивается и мерцает.', 
      photo: 'https://proza.ru/pics/2021/03/01/294.jpg' },
    { name: 'Собор Парижской Богоматери (Нотр-Дам)⛪', 
      desc: 'Шедевр готической архитектуры (XII–XIV вв.) с витражами и химерами. После пожара 2019 года восстанавливается, но площадь перед ним по-прежнему впечатляет.', 
      photo: 'https://i.ytimg.com/vi/gaxjPf41wLc/maxresdefault.jpg' },
    { name: 'Лувр', 
      desc: 'Самый посещаемый музей мира с легендарными произведениями: «Мона Лиза», «Венера Милосская», античные скульптуры и коллекция Ренессанса.', 
      photo: 'https://cdn.culture.ru/images/414f4558-7a39-5cbe-b056-bb1110971e07' }
  ],

  'Хургада': [
    { name: 'Остров Махмья', 
      desc: 'Райский уголок с белоснежными пляжами и бирюзовой водой. Идеален для пляжного отдыха, снорклинга среди кораллов и пикников на берегу.', 
      photo: 'https://i.pinimg.com/736x/26/5c/fa/265cfa86070680beaea937f9e3cd15aa.jpg' },
    { name: 'Дворец «Тысяча и одна ночь»', 
      desc: 'Восточное шоу с танцами дервишей, фольклорными представлениями и ужином в арабском стиле. Погружение в атмосферу сказок Шахерезады.', 
      photo: 'https://extraguide.ru/images/blog/2021/09-04-02whd8-razvlekatelnyy-tsentr-dvorets-1001-nochi.jpg' },
    { name: 'Пустыня Сахара', 
      desc: 'Сафари на квадроциклах, катание на верблюдах, посещение бедуинских деревень и ужин под звёздами.', 
      photo: 'https://avatars.dzeninfra.ru/get-zen_doc/40663/pub_5c10d01246ef5c00aaa82b4a_5c10d3219ba2f700aa082392/scale_1200' }
  ],

  'Барселона и Коста-Брава': [
    { name: 'Собор Святого Семейства', 
      desc: 'Шедевр Гауди, в Барселоне строящийся с 1882 года. Фантастическая архитектура с библейскими сюжетами на фасадах и витражами, создающими «эффект радуги».', 
      photo: 'https://i.pinimg.com/736x/05/67/6f/05676fda4574c6d321805161ea39e2f4.jpg' },
    { name: 'Музей Сальвадора Дали в Фигерасе',   
      desc: 'Коста-Брава: сюрреализм в архитектуре: бывший театр, превращённый Дали в музей с его самыми странными работами.', 
      photo: 'https://i.pinimg.com/originals/04/99/00/04990010630acfd2dab51788521381a7.jpg' },
    { name: 'Бульвар Рамбла', 
      desc: 'Сердце города Барселона: уличные артисты, старинные здания, кафе и атмосферные переулки с историей со времён Средневековья.', 
      photo: 'https://avatars.mds.yandex.net/i?id=ed3054f66b4396569f50de47fda4290e_l-5435996-images-thumbs&n=13' }
  ],

  'Бали': [
    { name: 'Храм Танах Лот', 
      desc: 'Морской храм на скале, окружённый водой во время прилива. Главное место для встречи закатов и балийских ритуалов.', 
      photo: 'https://sun9-68.userapi.com/s/v1/ig2/o9migFdtJaC7-9wmLPd8ge9k35BDhJBv5mp6zhX3-9yYrqFq13JDF75mKUmVJV7iou2mktEIJwFS0Tn60kXv04V7.jpg?quality=95&as=32x18,48x27,72x40,108x60,160x89,240x134,360x201,480x268,540x301,640x357,720x402,1080x603,1186x662&from=bu&u=xuggCK-I-CkqX5AaNCC_aXNSEPbBBmbRJWDRQJ7xpX4&cs=807x450' },
    { name: 'Рисовые террасы Тегаллаланг',   
      desc: 'Знаменитые ступенчатые поля в джунглях Убуда. Возможность прогуляться среди зелени, попробовать "лювак-кофе" и сделать атмосферные фото.', 
      photo: 'https://cdn.tripster.ru/thumbs2/b2ecffb7-c590-11e8-a475-02b782d69cda.800x600.jpg' },
    { name: 'Водопад Тибумана', 
      desc: 'Живописный каскад в тропическом лесу с бирюзовой купелью. Идеален для купания и релакса вдали от толп туристов.', 
      photo: 'https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_6745df3b339b386c81937deb_67484653008d8d0412fa777b/scale_1200' }
  ],

  'Вьетнам': [
    { name: 'Бухта Халонг', 
      desc: 'Объект ЮНЕСКО с тысячами известняковых скал, вырастающих из изумрудных вод.', 
      photo: 'https://avatars.mds.yandex.net/i?id=6e37b6b549e2296ee4a61267f888a2c1_l-5489111-images-thumbs&n=13' },
    { name: 'Древний город Хойан',   
      desc: 'Японский мост, разноцветные фонари и старинные дома XVI–XVIII веков. Вечером город превращается в сказку с плавучими свечами на реке.', 
      photo: 'https://www.agoda.com/wp-content/uploads/2024/05/hoi-an-1.jpg' },
    { name: 'Дельта Меконга', 
      desc: '«Рисовая корзина Вьетнама»: плавучие рынки (Кайран, Фонгдьен), фруктовые сады и деревни на сваях.', 
      photo: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/56/d3/f0/known-by-vietnamese-as.jpg?w=1200&h=1200&s=1' }
  ],

  'Прага': [
    { name: 'Пражский Град', 
      desc: 'Самый большой замковый комплекс в мире (по Книге рекордов Гиннесса). Здесь находятся собор Святого Вита, Злата улочка и королевские сады. Открывается потрясающий вид на город!', 
      photo: 'https://i.pinimg.com/originals/37/a1/cb/37a1cb5b197fd4ce33454f1d29e49cad.jpg' },
    { name: 'Карлов мост',   
      desc: 'Легендарный мост XIV века с 30 барочными статуями. Лучшее время для посещения — рассвет или закат, когда нет толп туристов.', 
      photo: 'https://avatars.mds.yandex.net/get-mpic/4355034/img_id5912612882542195240.jpeg/orig' },
    { name: 'Староместская площадь', 
      desc: 'Сердце Старого города с астрономическими часами (Орлой), Тынским храмом и яркими домиками в стиле барокко. Каждый час кукольное шоу на часах собирает сотни зрителей.', 
      photo: 'https://avatars.mds.yandex.net/i?id=f2b5d2348a7f1a245a53da3cee2881d7_l-4398718-images-thumbs&n=13' }
  ],
};

const replyMenu = {
  reply_markup: {
    keyboard: [
      ['🌟 Топ 5 туров мира', '🗺️ Показать достопримечательности'],
      ['📋 О нас']
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  }
};

const inlineMenuButton = {
  reply_markup: {
    inline_keyboard: [[{ text: '🏠 Меню', callback_data: 'open_menu' }]]
  }
};

const userState = {};

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, '👋 Добро пожаловать в наш туристический бот!', replyMenu);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '🌟 Топ 5 туров мира') {
    // скрываем меню
    bot.sendMessage(chatId, '🏆 Самые популярные направления:\n\n1. Бали\n2. Париж\n3. Мальдивы\n4. Рим\n5. Бангкок', {
      reply_markup: {
        remove_keyboard: true
      }
    }).then(() => {
      bot.sendMessage(chatId, '👇 Нажмите "Меню", чтобы вернуться', inlineMenuButton);
    });
  }

  else if (text === '📋 О нас') {
    bot.sendMessage(chatId, 'TravelDream была основана в 2010 году группой энтузиастов, влюбленных в путешествия. Начав с небольшого офиса в Москве, сегодня мы стали одной из ведущих туристических компаний России. За 15 лет работы мы организовали более 15,000 путешествий в 50+ стран мира. Наши клиенты - это люди, которые ценят комфорт, качество и индивидуальный подход. Мы не просто продаем туры - мы создаем мечты. Каждое путешествие, организованное TravelDream, - это уникальная история, наполненная яркими эмоциями и незабываемыми впечатлениями. 🌍✈️', {
      reply_markup: {
        remove_keyboard: true
      }
    }).then(() => {
      bot.sendMessage(chatId, '👇 Нажмите "Меню", чтобы вернуться', inlineMenuButton);
    });
  }

  else if (text === '🗺️ Показать достопримечательности') {
    bot.sendMessage(chatId, '🔍 Загружаем список достопримечательностей...', {
      reply_markup: {
        remove_keyboard: true
      }
    }).then(() => {
      sendTourList(chatId);
    });
  }
});

bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data === 'open_menu') {
    bot.sendMessage(chatId, '🏠 Главное меню снова доступно:', replyMenu);
    return bot.answerCallbackQuery(callbackQuery.id);
  }

  if (data.startsWith('tour_')) {
    const tourName = data.replace('tour_', '');
    userState[chatId] = { tour: tourName, index: 0 };
    sendLandmark(chatId);
    return bot.answerCallbackQuery(callbackQuery.id);
  }

  if (data === 'next') {
    userState[chatId].index++;
    sendLandmark(chatId);
    return bot.answerCallbackQuery(callbackQuery.id);
  }

  if (data === 'back') {
    userState[chatId].index--;
    sendLandmark(chatId);
    return bot.answerCallbackQuery(callbackQuery.id);
  }
});

function sendTourList(chatId) {
  const buttons = Object.keys(tours).map(tour => [{ text: tour, callback_data: `tour_${tour}` }]);
  bot.sendMessage(chatId, '🌍 Выберите тур:', {
    reply_markup: {
      inline_keyboard: buttons.concat([[{ text: '🏠 Меню', callback_data: 'open_menu' }]])
    }
  });
}

function sendLandmark(chatId) {
  const state = userState[chatId];
  if (!state) return;

  const tour = tours[state.tour];
  const landmark = tour[state.index];

  const keyboard = [
    [
      ...(state.index > 0 ? [{ text: '⬅️ Назад', callback_data: 'back' }] : []),
      ...(state.index < tour.length - 1 ? [{ text: 'Далее ➡️', callback_data: 'next' }] : [])
    ],
    [{ text: '🏠 Меню', callback_data: 'open_menu' }]
  ];

  bot.sendPhoto(chatId, landmark.photo, {
    caption: `🏙️ *${landmark.name}*\n\n${landmark.desc}`,
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: keyboard }
  }).catch(err => {
    console.error('Ошибка при отправке фото:', err.message);
    bot.sendMessage(chatId, '❌ Не удалось загрузить фото. Попробуйте позже.', inlineMenuButton);
  });
}
