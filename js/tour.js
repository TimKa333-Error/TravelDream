document.addEventListener('DOMContentLoaded', function() {
    // Проверяем статус авторизации
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isLoggedIn = !!currentUser;

    // Обновляем UI в зависимости от статуса авторизации
    updateAuthUI(isLoggedIn, currentUser?.firstName);

    // Обработчик для кнопок "Забронировать"
    document.querySelectorAll('.btn-book').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!isLoggedIn) {
                alert('Для бронирования тура необходимо войти в систему');
                window.location.href = 'login.html';
                return;
            }
            
            // Получаем данные о туре из карточки
            const card = this.closest('.tour-card');
            const tourData = {
                id: card.dataset.tourId,
                title: card.querySelector('h3').textContent,
                price: card.querySelector('.price').textContent,
                duration: card.querySelector('.tour-meta span:nth-child(1)').textContent,
                people: card.querySelector('.tour-meta span:nth-child(2)').textContent,
                image: card.querySelector('img').src
            };

            // Открываем модальное окно с деталями тура
            openTourModal(tourData);
        });
    });

    // Проверка параметра URL и открытие соответствующего тура
    const urlParams = new URLSearchParams(window.location.search);
    const tourId = urlParams.get('tour');
    
    if (tourId && toursData[tourId]) {
        openTourModal(toursData[tourId]);
    }

    // Обработчик кнопки бронирования в модальном окне
    document.getElementById('bookTourBtn')?.addEventListener('click', function() {
        if (!isLoggedIn) {
            alert('Для бронирования тура необходимо войти в систему');
            window.location.href = 'login.html';
            return;
        }
        
        try {
            const modalTitle = document.getElementById('modalTourTitle').textContent;
            const modalPriceText = document.getElementById('modalTourPrice').textContent;
            const modalPricePerText = document.getElementById('modalTourPricePer').textContent;
            const modalDuration = document.getElementById('modalTourDuration').textContent;
            const modalPeople = document.getElementById('modalTourPeople').textContent;

            // Извлекаем числовые значения цен
            const modalPrice = parseFloat(modalPriceText.replace(/[^\d.]/g, ''));
            const modalPricePer = parseFloat(modalPricePerText.split('/')[0].replace(/[^\d.]/g, ''));

            // Создаем объект бронирования
            const booking = {
                id: 'TD-' + Math.floor(Math.random() * 1000000),
                title: modalTitle,
                price: modalPrice,
                pricePer: modalPricePer,
                pricePerText: modalPricePerText,
                duration: parseInt(modalDuration.replace(/\D/g, '')),
                people: modalPeople.includes('взрослых') ? 
                       parseInt(modalPeople.replace(/\D/g, '')) : 
                       parseInt(modalPeople.replace(/\D/g, '')),
                date: new Date().toISOString(),
                status: 'confirmed',
                image: document.querySelector('.tour-gallery img')?.src || ''
            };

            // Добавляем бронирование к текущему пользователю
            addUserBooking(currentUser.email, booking);

            // Переходим на страницу бронирований
            window.location.href = 'profile-bookings.html';
        } catch (error) {
            console.error("Ошибка при бронировании:", error);
            alert("Произошла ошибка при бронировании. Пожалуйста, попробуйте снова.");
        }
    });

    // Обработчики для кнопок "Подробнее"
    document.querySelectorAll('.btn-details').forEach(btn => {
        btn.addEventListener('click', function() {
            const tourId = this.getAttribute('data-tour');
            const tour = toursData[tourId];
            
            if (tour) {
                openTourModal(tour);
            }
        });
    });

    // Закрытие модального окна
    document.querySelector('.close-modal')?.addEventListener('click', function() {
        document.getElementById('tourModal').style.display = 'none';
    });

    // Закрытие модального окна при клике вне его
    window.addEventListener('click', function(e) {
        if (e.target === document.getElementById('tourModal')) {
            document.getElementById('tourModal').style.display = 'none';
        }
    });

    // Инициализация пагинации
    if (document.querySelector('.tour-card')) {
        initPagination();
    }

    // Сортировка туров
    const sortSelect = document.getElementById('sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortTours(this.value);
        });
    }
});

// Данные о турах
const toursData = {
    1: {
        title: "Анталия - все включено",
        duration: "10 дней",
        people: "2 взрослых",
        rating: "4.8",
        price: "650$",
        pricePer: "325$ / чел",
        description: `
            <p>Отдых в 5-звездочном отеле с собственным пляжем, питание "все включено", экскурсии по историческим местам.</p>
            <p>Отель расположен в живописном месте с видом на море. В стоимость включено: проживание, питание, авиаперелет, трансферы, медицинская страховка.</p>
            <p>Экскурсионная программа включает посещение древнего города, музея под открытым небом и круиз по морю.</p>
            <p>Для детей предусмотрена анимация и детский клуб. На территории отеля: 3 ресторана, 4 бара, фитнес-центр, СПА-центр.</p>
            <p>Дополнительные услуги: аренда автомобиля, индивидуальные экскурсии, услуги няни.</p>
            <p>Рекомендуемый сезон: май-октябрь. Средняя температура воздуха: +28°C, воды: +24°C.</p>
        `,
        images: [
            "https://blog.obilet.com/wp-content/uploads/2021/11/anagorsel-min-scaled.jpeg",
            "https://dev.atorus.ru/sites/default/files/styles/head_carousel/public/2021-11/c4dba1.jpg.webp?itok=vXi0zVGe",
            "https://i.pinimg.com/originals/13/b5/33/13b53385f95d7e8a57b0531fdb46df13.jpg",
            "https://i.pinimg.com/originals/e5/15/ff/e515fff4c891d439fb2d053333988670.jpg"
        ]
    },
    2: {
        title: "Рим - Венеция - Флоренция",
        duration: "8 дней",
        people: "1-4 человека",
        rating: "4.9",
        price: "850$",
        pricePer: "425$ / чел",
        description: `
            <p>Экскурсионный тур по главным городам Италии с посещением музеев, галерей и исторических мест.</p>
            <p>Программа тура включает: обзорные экскурсии по Риму, Венеции и Флоренции, посещение Ватикана, Колизея, собора Святого Петра.</p>
            <p>В стоимость включено: проживание в отелях 4*, завтраки, экскурсии с русскоговорящим гидом, транспортное обслуживание.</p>
            <p>Дополнительно можно заказать: гастрономические туры, посещение виноделен, индивидуальные экскурсии.</p>
        `,
        images: [
            "https://www.onthegotours.com/repository/Rome--Best-places-to-visit-in-Italy--On-The-Go-Tours-352451500906401.jpg",
            "https://s1.1zoom.ru/big3/156/Rome_Italy_Ruins_Arch_Septimius_Severus_Temple_532568_5541x3641.jpg",
            "https://s1.1zoom.ru/big3/156/Rome_Italy_Ruins_Arch_Septimius_Severus_Temple_532568_5541x3641.jpg",
            "https://proza.ru/pics/2024/07/14/1210.jpg"
        ]
    },
    3: {
        title: "Пхукет + острова",
        duration: "12 дней",
        people: "2 взрослых",
        rating: "4.7",
        price: "720$",
        pricePer: "360$ / чел",
        description: `
            <p>Пляжный отдых на лучших курортах Пхукета с экскурсиями на острова Пхи-Пхи, Джеймса Бонда и др.</p>
            <p>Отель расположен на первой линии пляжа. В стоимость включено: проживание, питание (завтраки), авиаперелет, трансферы.</p>
            <p>Экскурсионная программа: круиз по островам, посещение национального парка, шоу слонов.</p>
        `,
        images: [
            "https://cdnn21.img.ria.ru/images/07e7/07/13/1885095162_0:319:3074:2048_1920x1080_80_0_0_8ee6e05e23a52239f7e54b30816a8af3.jpg",
            "https://image.kkday.com/v2/image/get/s1.kkday.com/product_131375/20220719135244_65fmN/jpg",
            "https://i.pinimg.com/originals/fb/57/67/fb576777ef2270ef31acca13e483eb63.jpg",
            "https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_65b392d56a2a670380207475_65b392e46a2a6703802076cb/scale_1200"
        ]
    },
    4: {
        title: "Дубай - роскошный отдых",
        duration: "7 дней",
        people: "2 взрослых",
        rating: "4.9",
        price: "1200$",
        pricePer: "600$ / чел",
        description: `
            <p>Отдых в 5-звездочном отеле Burj Al Arab, экскурсии по городу, шопинг в лучших торговых центрах.</p>
            <p>Включено: проживание в люксовом номере, завтраки, трансферы, экскурсия по городу, посещение Бурдж-Халифа.</p>
            <p>Дополнительно: ужин в ресторане на высоте, сафари в пустыне, посещение аквапарка.</p>
        `,
        images: [
            "https://pluralia.forumverona.com/wp-content/uploads/2023/07/shutterstock_1757555312-scaled.jpg",
            "https://monolith-realty.ru/upload/iblock/45b/rxj6lmwnqirmi7hsmnvqss6m2h13xauj.jpg",
            "https://avatars.mds.yandex.net/i?id=b7fa7fb1b3c00d818ad7ea556d3d8fe9_l-2769679-images-thumbs&n=13",
            "https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_5b6c2cff8ea8d600a9f38956_66194958b1e0a65d706914cb/scale_1200"
        ]
    },
    5: {
        title: "Острова Санторини и Миконос",
        duration: "9 дней",
        people: "2 взрослых",
        rating: "4.8",
        price: "780$",
        pricePer: "390$ / чел",
        description: `
            <p>Романтический тур по самым красивым островам Греции с посещением Афин и круизом по Эгейскому морю.</p>
            <p>Проживание в отелях с видом на кальдеру, завтраки, экскурсии по островам, круиз на закате.</p>
            <p>Дополнительно: дегустация греческих вин, ужин в традиционной таверне.</p>
        `,
        images: [
            "https://cdn1.ntv.com.tr/gorsel/40B_Mjol5EycoFHIG20jbg.jpg?width=1000&mode=both&scale=both&v=1689665126073",
            "https://www.gateway-travel.com/wp-content/uploads/2022/10/City-Island-tour-1.jpg",
            "https://s0.rbk.ru/v6_top_pics/media/img/7/81/346897620673817.webp",
            "https://i.pinimg.com/originals/e6/b7/8d/e6b78d96e4e427573742e605f732a8c4.jpg"
        ]
    },
    6: {
        title: "Мальдивы - бунгало над водой",
        duration: "10 дней",
        people: "2 взрослых",
        rating: "5.0",
        price: "1500$",
        pricePer: "750$ / чел",
        description: `
            <p>Отдых в роскошном бунгало над лазурной водой, дайвинг, спа-процедуры и романтические ужины.</p>
            <p>Включено: проживание в бунгало, питание "все включено", трансфер на гидросамолете, сноркелинг.</p>
            <p>Дополнительно: подводная фотосессия, романтический ужин на пляже, экскурсия на соседний остров.</p>
        `,
        images: [
            "https://avatars.mds.yandex.net/i?id=d55fd9419a7da453f9718f169a42ebd1_l-10142557-images-thumbs&n=13",
            "https://avatars.mds.yandex.net/get-altay/9428388/2a00000189d5e72654c6844d509f154bea2f/XXXL",
            "https://thepointsguy.global.ssl.fastly.net/us/originals/2021/08/Overwater-bungalows-in-the-Maldives.jpg?width=3840",
            "https://www.anbosta.by/images/conrad-min.jpg"
        ]
    },
    7: {
        title: "Париж и Лазурный берег",
        duration: "10 дней",
        people: "1-4 человека",
        rating: "4.7",
        price: "950$",
        pricePer: "475$ / чел",
        description: `
            <p>Экскурсии по Парижу, посещение Лувра и Эйфелевой башни, отдых в Ницце и Каннах.</p>
            <p>Включено: проживание в отелях 3-4*, завтраки, экскурсии с гидом, транспорт между городами.</p>
            <p>Дополнительно: ужин в ресторане на Эйфелевой башне, посещение парфюмерной фабрики в Грасе.</p>
        `,
        images: [
            "https://media.baamboozle.com/uploads/images/1052105/02573e9b-b2db-472c-b476-760c53f46d53.jpeg",
            "https://resize.elle.fr/original/var/plain_site/storage/images/loisirs/sorties/que-faire-a-paris-le-week-end-du-8-9-et-10-octobre-3966236/95589366-1-fre-FR/Que-faire-a-Paris-le-week-end-du-8-9-et-10-octobre.jpg",
            "https://i.pinimg.com/originals/4c/b2/4b/4cb24b6eccce085746399df9dbc4d8ba.jpg",
            "https://kingstonyouthlacrosse.org/800/600/https/cap-dail.ru/wp-content/uploads/2018/01/Sobor-Parizhskoj-Bogomateri.jpg"
        ]
    },
    8: {
        title: "Хургада - дайвинг и пирамиды",
        duration: "8 дней",
        people: "2 взрослых",
        rating: "4.5",
        price: "450$",
        pricePer: "225$ / чел",
        description: `
            <p>Пляжный отдых в Хургаде с экскурсиями к пирамидам Гизы и дайвингом в Красном море.</p>
            <p>Включено: проживание в отеле 4*, питание "все включено", экскурсия к пирамидам, дайвинг для начинающих.</p>
            <p>Дополнительно: ночное сафари в пустыне, круиз по Нилу, посещение Луксора.</p>
        `,
        images: [
            "https://images.ctfassets.net/qacv5m4pr8sy/g3kA0lfwrZ0a2wwZbhhM3/27e77d8e6a14090a79cf58021874bfa3/hurghada-coast-egypt.jpg?q=95&fm=webp",
            "https://img.pac.ru/resorts/213085/461181/big/C431DC497F00010105E0C3300BE658D7.jpg",
            "https://ru.aegeanair.com/-/media/Destinations/hurghada/hurghada_final_cover.jpg",
            "https://cdn.logitravel.fr/cloudcontent/fotos/tours/alex/1001523/900_900.jpg?46A3099BC20D501CA2B0949134F747F6"
        ]
    },
    9: {
        title: "Барселона и Коста-Брава",
        duration: "7 дней",
        people: "1-4 человека",
        rating: "4.8",
        price: "680$",
        pricePer: "340$ / чел",
        description: `
            <p>Экскурсии по Барселоне, посещение творений Гауди, отдых на пляжах Коста-Бравы.</p>
            <p>Включено: проживание в отеле в центре Барселоны, завтраки, обзорная экскурсия, трансферы.</p>
            <p>Дополнительно: посещение шоу фламенко, дегустация испанских вин, экскурсия в монастырь Монтсеррат.</p>
        `,
        images: [
            "https://www2.naz.edu/files/6916/4503/0653/Spain_1.jpg",
            "https://images.stopgame.ru/uploads/images/495256/form/2018/11/07/r1694x948/0oqmkTNhkeA6eDvF-g7BQA/1541609031.jpg",
            "https://i.pinimg.com/originals/9b/ac/b0/9bacb0410d22a19406acf8d2fd99579a.jpg",
            "https://i.pinimg.com/originals/ad/ba/8e/adba8ea72bb14dbc828b4c29c6a8b634.jpg"
        ]
    },
    10: {
        title: "Бали",
        duration: "12 дней",
        people: "2 взрослых",
        rating: "4.9",
        price: "1100$",
        pricePer: "550$ / чел",
        description: `
            <p>Экзотический отдых на Бали с посещением храмов, водопадов и рисовых террас.</p>
            <p>Включено: проживание в вилле с бассейном, завтраки, экскурсии по острову, трансферы.</p>
            <p>Дополнительно: уроки серфинга, спа-процедуры, ужин на пляже Джимбаран.</p>
        `,
        images: [
            "https://molniya.info/wp-content/uploads/2019/07/y-staggering-luxury-spa-resort-viceroy-auf-bali.jpg",
            "https://avatars.mds.yandex.net/get-altay/7810332/2a000001842987fec795325e0cd6e2e1c1fa/XXXL",
            "https://i.pinimg.com/736x/bc/f8/45/bcf845b1ced007a80483ac7cca563481.jpg",
            "https://snob.ru/indoc/tilda/995317/images/tild3235-3532-4063-b562-373634663866____2020-02-01__234041.png"
        ]
    },
    11: {
        title: "Вьетнам - Нячанг и Хошимин",
        duration: "10 дней",
        people: "2 взрослых",
        rating: "4.6",
        price: "750$",
        pricePer: "375$ / чел",
        description: `
            <p>Пляжный отдых в Нячанге и экскурсии по Хошимину с посещением дельты Меконга.</p>
            <p>Включено: проживание в отелях 4*, завтраки, экскурсии, внутренний перелет.</p>
            <p>Дополнительно: посещение грязелечебницы, круиз по бухте Халонг, кулинарный мастер-класс.</p>
        `,
        images: [
            "https://avatars.mds.yandex.net/i?id=8ed588f2b39bf3f337df794564b5703c_l-9182312-images-thumbs&n=13",
            "https://avatars.mds.yandex.net/i?id=749ab70470486ac7a9fb6892c540b8a3_l-5232503-images-thumbs&n=13",
            "https://img.pac.ru/landmarks/473783/big/7AD4B45A7F0001016EC4CA7B3B84B14F.jpg",
            "https://i.pinimg.com/originals/19/ee/af/19eeaf083c6585ad4f356ff0ec1cfa2a.jpg"
        ]
    },
    12: {
        title: "Прага - романтика Старого города",
        duration: "7 дней",
        people: "1-4 человека",
        rating: "4.8",
        price: "600$",
        pricePer: "300$ / чел",
        description: `
            <p>Экскурсии по Праге, посещение Пражского града, Карлова моста и старинных замков.</p>
            <p>Включено: проживание в историческом центре, завтраки, обзорная экскурсия, входные билеты.</p>
            <p>Дополнительно: вечерняя прогулка по Влтаве, посещение пивоварни, экскурсия в Карловы Вары.</p>
        `,
        images: [
            "https://img1.wallspic.com/attachments/originals/2/3/0/2/92032-da_dou_hui-tian_kong-lu_you_jing_dian-cheng_zhen_guang_chang-zi_ben_shi-2560x1600.jpg",
            "https://i.pinimg.com/originals/ad/ad/cb/adadcb5b759aec9c7dff92ab2c70165e.jpg",
            "https://avatars.mds.yandex.net/get-mpic/5250150/img_id3880055703277401539.jpeg/orig",
            "https://avatars.mds.yandex.net/get-mpic/8109518/img_id4452827889969704931.jpeg/orig"
        ]
    }
};

// Функция для добавления бронирования пользователю
function addUserBooking(email, booking) {
    try {
        // Получаем текущие бронирования из localStorage
        let bookings = JSON.parse(localStorage.getItem('bookings')) || {};
        
        // Если для этого пользователя еще нет бронирований, создаем массив
        if (!bookings[email]) {
            bookings[email] = [];
        }
        
        // Добавляем новое бронирование
        bookings[email].push(booking);
        
        // Сохраняем обновленный список
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        return true;
    } catch (error) {
        console.error('Ошибка при добавлении бронирования:', error);
        return false;
    }
}

// Функция для открытия модального окна с туром
function openTourModal(tour) {
    document.getElementById('modalTourTitle').textContent = tour.title;
    document.getElementById('modalTourDuration').textContent = tour.duration;
    document.getElementById('modalTourPeople').textContent = tour.people;
    document.getElementById('modalTourRating').textContent = tour.rating || '4.5';
    document.getElementById('modalTourPrice').textContent = tour.price;
    document.getElementById('modalTourPricePer').textContent = tour.pricePer || `${tour.price} /чел`;
    document.getElementById('modalTourDescription').innerHTML = tour.description || 'Описание тура';
    
    // Обновляем галерею изображений
    const gallery = document.querySelector('.tour-gallery');
    gallery.innerHTML = '';
    const images = tour.images || [tour.image || 'default-tour.jpg'];
    images.forEach(img => {
        gallery.innerHTML += `<img src="${img}" alt="${tour.title}">`;
    });
    
    // Показываем модальное окно
    document.getElementById('tourModal').style.display = 'block';
    
    // Прокручиваем к модальному окну
    setTimeout(() => {
        document.querySelector('.modal-content').scrollIntoView({
            behavior: 'smooth'
        });
    }, 100);
}

// Функция для инициализации пагинации
function initPagination() {
    const toursPerPage = 6;
    let currentPage = 1;
    const tourCards = Array.from(document.querySelectorAll('.tour-card'));
    const totalPages = Math.ceil(tourCards.length / toursPerPage);

    function updatePagination() {
        // Обновляем активную страницу
        document.querySelectorAll('.page-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page == currentPage) {
                link.classList.add('active');
            }
        });
        
        // Показываем/скрываем кнопки "назад" и "вперед"
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        if (prevBtn) prevBtn.style.visibility = currentPage === 1 ? 'hidden' : 'visible';
        if (nextBtn) nextBtn.style.visibility = currentPage === totalPages ? 'hidden' : 'visible';
        
        // Показываем только туры для текущей страницы
        tourCards.forEach((card, index) => {
            const startIndex = (currentPage - 1) * toursPerPage;
            const endIndex = startIndex + toursPerPage;
            
            card.style.display = (index >= startIndex && index < endIndex) ? 'block' : 'none';
        });
    }

    // Обработчики для кнопок пагинации
    document.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.classList.contains('prev')) {
                if (currentPage > 1) {
                    currentPage--;
                    updatePagination();
                }
            } else if (this.classList.contains('next')) {
                if (currentPage < totalPages) {
                    currentPage++;
                    updatePagination();
                }
            } else if (this.dataset.page) {
                currentPage = parseInt(this.dataset.page);
                updatePagination();
            }
        });
    });

    updatePagination();
}

// Функция для сортировки туров
function sortTours(sortValue) {
    const toursContainer = document.getElementById('toursContainer');
    const tourCards = Array.from(document.querySelectorAll('.tour-card'));
    
    tourCards.sort((a, b) => {
        const aPrice = parseFloat(a.dataset.price);
        const bPrice = parseFloat(b.dataset.price);
        const aDuration = parseInt(a.dataset.duration);
        const bDuration = parseInt(b.dataset.duration);
        const aRating = parseFloat(a.dataset.rating);
        const bRating = parseFloat(b.dataset.rating);
        
        switch(sortValue) {
            case 'price_asc':
                return aPrice - bPrice;
            case 'price_desc':
                return bPrice - aPrice;
            case 'duration':
                return bDuration - aDuration;
            case 'rating':
                return bRating - aRating;
            default:
                return 0;
        }
    });
    
    // Перемещаем отсортированные карточки в контейнер
    tourCards.forEach(card => toursContainer.appendChild(card));
    
    // Возвращаемся на первую страницу после сортировки
    const currentPage = 1;
    initPagination();
}

// Функция для обновления UI авторизации
function updateAuthUI(isLoggedIn, userName) {
    const authButtons = document.getElementById('authButtons');
    if (!authButtons) return;

    if (isLoggedIn) {
        authButtons.innerHTML = `
            <a href="profile.html" class="btn-profile">
                <i class="fas fa-user"></i>
                ${userName || 'Профиль'}
            </a>
            <button class="btn-logout" id="logoutBtn">
                <i class="fas fa-sign-out-alt"></i> Выход
            </button>
        `;
        
        document.getElementById('logoutBtn')?.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    } else {
        authButtons.innerHTML = `
            <button class="btn-login" id="loginBtn">
                <i class="fas fa-sign-in-alt"></i> Вход
            </button>
            <button class="btn-register" id="registerBtn">
                <i class="fas fa-user-plus"></i> Регистрация
            </button>
        `;
        
        document.getElementById('loginBtn')?.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
        
        document.getElementById('registerBtn')?.addEventListener('click', function() {
            window.location.href = 'register.html';
        });
    }
}

// Мобильное меню
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('show');
    });
}