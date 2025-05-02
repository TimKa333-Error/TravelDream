    document.addEventListener('DOMContentLoaded', function() {
    // Обработчик для кнопок "Забронировать"
    document.querySelectorAll('.btn-book').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Проверяем, авторизован ли пользователь
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            
            if (!isLoggedIn) {
                // Если пользователь не авторизован, показываем сообщение и перенаправляем на страницу входа
                alert('Для бронирования тура необходимо войти в систему');
                window.location.href = 'login.html';
                return;
            }
            
            // Получаем данные о туре из карточки
            const card = this.closest('.tour-card');
            const title = card.querySelector('h3').textContent;
            const price = card.querySelector('.price').textContent;
            const duration = card.querySelector('.tour-meta span:nth-child(1)').textContent;
            const people = card.querySelector('.tour-meta span:nth-child(2)').textContent;
            
           
        });
    });
});
// Проверка параметра URL и открытие соответствующего тура
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tourId = urlParams.get('tour');
    
    if (tourId && toursData[tourId]) {
        // Показываем модальное окно с выбранным туром
        const tour = toursData[tourId];
        
        document.getElementById('modalTourTitle').textContent = tour.title;
        document.getElementById('modalTourDuration').textContent = tour.duration;
        document.getElementById('modalTourPeople').textContent = tour.people;
        document.getElementById('modalTourRating').textContent = tour.rating;
        document.getElementById('modalTourPrice').textContent = tour.price;
        document.getElementById('modalTourPricePer').textContent = tour.pricePer;
        document.getElementById('modalTourDescription').innerHTML = tour.description;
        
        // Обновляем галерею изображений
        const gallery = document.querySelector('.tour-gallery');
        gallery.innerHTML = '';
        tour.images.forEach(img => {
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
            "https://avatars.mds.yandex.net/i?id=49b2bb829fab0a476f8cd1944978f0e4_l-12361708-images-thumbs&n=13",
            "https://avatars.mds.yandex.net/i?id=5b29ab1343a35ba908e6f54a1d8813cf_l-4373599-images-thumbs&n=13",
            "https://avatars.mds.yandex.net/i?id=cc57580f8a80e8bc9bd594ab95ec2b9e_l-5248826-images-thumbs&n=13",
            "https://avatars.mds.yandex.net/i?id=6389f7860643ceb394fd03d3273e77bc_l-5247581-images-thumbs&n=13"
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
            "https://avatars.mds.yandex.net/i?id=85207f242be17a3c823efab255324f4296c2c050-4118262-images-thumbs&n=13",
            "https://aws-tiqets-cdn.imgix.net/images/content/009d673615524908bc0ff918131dac3b.jpg?auto=format&fit=crop&ixlib=python-3.2.1&q=70&s=52da77c690c8d82dd84879ff9957d0e9",
            "https://main-cdn.sbermegamarket.ru/big1/hlr-system/573/509/549/101/319/39/600004799635b0.jpeg",
            "https://avatars.mds.yandex.net/i?id=2c5966cf0e044ea31fa25d503b0ed1621106badd-4011747-images-thumbs&n=13"
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
            "https://avatars.mds.yandex.net/i?id=764a0a063325067bf63911684aafcafa_l-5878053-images-thumbs&n=13",
            "https://cdnn21.img.ria.ru/images/07e7/07/13/1885095162_0:319:3074:2048_1920x1080_80_0_0_8ee6e05e23a52239f7e54b30816a8af3.jpg",
            "https://avatars.mds.yandex.net/i?id=5e9a61c06d67628ff09fcc7a490e8bc5_l-8289735-images-thumbs&n=13",
            "https://avatars.mds.yandex.net/i?id=add235508cbdf720af0fa6c340a834db_l-5257463-images-thumbs&n=13"
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
            "https://avatars.mds.yandex.net/i?id=21fa6b52593ab78c0fbf2803a4369300_l-7043025-images-thumbs&n=13",
            "https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_5b6c2cff8ea8d600a9f38956_66194958b1e0a65d706914cb/scale_1200",
            "https://avatars.mds.yandex.net/i?id=001886b0dc9892e3b301eab18cf90405_l-12630942-images-thumbs&n=13",
            "https://avatars.mds.yandex.net/i?id=b7fa7fb1b3c00d818ad7ea556d3d8fe9_l-2769679-images-thumbs&n=13"
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
            "https://i.pinimg.com/originals/e8/82/2d/e8822d93c3da9e337b26e6533d7cbe24.jpg",
            "https://cdn1.ntv.com.tr/gorsel/40B_Mjol5EycoFHIG20jbg.jpg?width=1000&mode=both&scale=both&v=1689665126073",
            "https://avatars.mds.yandex.net/i?id=609023df05db7f0a771cb158af949d11_l-10216894-images-thumbs&n=13",
            "https://avatars.mds.yandex.net/i?id=a97044b77c34d630691f64f3ee4d9797_l-11547768-images-thumbs&n=13"
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
            "https://avatars.mds.yandex.net/get-altay/9428388/2a00000189d5e72654c6844d509f154bea2f/XXXL",
            "https://avatars.mds.yandex.net/i?id=2a7572b6811ade6b21d4fd71022511f0_l-5432883-images-thumbs&n=13",
            "https://avatars.mds.yandex.net/i?id=6dfa6f9c4c44ded752d1dd32e75731da_l-5888733-images-thumbs&n=13",
            "https://avatars.mds.yandex.net/i?id=895a04b7ce26b9144cf79d49fb19c66b_l-4826347-images-thumbs&n=13"
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
            "https://resize.elle.fr/original/var/plain_site/storage/images/loisirs/sorties/que-faire-a-paris-le-week-end-du-8-9-et-10-octobre-3966236/95589366-1-fre-FR/Que-faire-a-Paris-le-week-end-du-8-9-et-10-octobre.jpg",
            "https://i.pinimg.com/originals/d6/2c/6e/d62c6ea21311085409f151a4c815b964.jpg",
            "https://avatars.mds.yandex.net/get-vertis-journal/4220003/24.jpg_1712647473447/orig",
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
            "https://cdn.tripster.ru/thumbs2/f1915cac-af8d-11ee-ad93-62cf10701fef.1600x900.jpeg?width=1200&height=630",
            "https://avatars.mds.yandex.net/i?id=d28841857a77278e0ffe8b24dd126ae1_l-5291937-images-thumbs&n=13",
            "https://s01.cdn.pegast.ru/get/97/8a/e5/f304066d55045a2232e7c8ba9396703e8aa42dfd6dac1007ccb7b34212/%D0%A8%D0%B0%D1%80%D0%BC1.jpg",
            "https://albatross-travel-egypt.com/wp-content/uploads/2019/01/hurgada8.jpg"
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
            "https://i.pinimg.com/originals/ad/ba/8e/adba8ea72bb14dbc828b4c29c6a8b634.jpg",
            "https://i.pinimg.com/originals/a1/b3/09/a1b3097aef85de787195f00c0fa42f53.jpg",
            "https://avatars.mds.yandex.net/get-vertis-journal/4220003/shutterstock_377505535.jpg_1682067967119/1600x1600",
            "https://avatars.mds.yandex.net/i?id=3cb70e772d009923a4641367a73cd6d8_l-8172987-images-thumbs&n=13"
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
            "https://avatars.mds.yandex.net/i?id=c42eac4f630974b0f5a5c62961cabab8_l-5235096-images-thumbs&n=13",
            "https://cs13.pikabu.ru/post_img/2023/04/17/7/og_og_1681728737281229602.jpg",
            "https://avatars.mds.yandex.net/i?id=c0bba346340ec474ef82c4540d91d5b3_l-5235559-images-thumbs&n=13",
            "https://avatars.mds.yandex.net/get-marketcms/1357599/img-57cc118e-7dfb-440a-9721-351f9cdb3d96.jpeg/optimize"
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
            "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Asia_Cruise_Junk_in_Halong_bay.JPG/1200px-Asia_Cruise_Junk_in_Halong_bay.JPG",
            "https://avatars.mds.yandex.net/i?id=96dda72f1f855e1f9419ded654cea4e5_l-5218965-images-thumbs&n=13"
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
            "https://i.pinimg.com/originals/f7/2a/51/f72a511f053164de427604412e30b607.jpg",
            "https://res.cloudinary.com/iibbank/image/upload/fl_progressive,w_2560,c_limit/publications/xCnG6e1MDWC9tBQJtO3dYdl3FC8MpjHNsKI.jpg",
            "https://avatars.mds.yandex.net/get-mpic/5352299/img_id3320336667317224132.jpeg/orig",
            "https://avatars.mds.yandex.net/get-mpic/8109518/img_id4452827889969704931.jpeg/orig"
        ]
    }
};

// Обработчик кнопки бронирования в модальном окне
document.getElementById('bookTourBtn')?.addEventListener('click', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
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
            date: new Date().toLocaleDateString('ru-RU'),
            status: 'confirmed',
            image: document.querySelector('.tour-gallery img')?.src || ''
        };

        // Получаем текущие бронирования из localStorage с обработкой ошибок
        let bookings = [];
        try {
            const bookingsData = localStorage.getItem('bookings');
            if (bookingsData && bookingsData !== "undefined") {
                bookings = JSON.parse(bookingsData) || [];
            }
        } catch (e) {
            console.error("Ошибка при чтении бронирований:", e);
        }

        // Добавляем новое бронирование
        bookings.push(booking);

        // Сохраняем обратно в localStorage
        localStorage.setItem('bookings', JSON.stringify(bookings));

        // Переходим на страницу бронирований
        window.location.href = 'profile-bookings.html';
    } catch (error) {
        console.error("Ошибка при бронировании:", error);
        alert("Произошла ошибка при бронировании. Пожалуйста, попробуйте снова.");
    }
});

// Функция для загрузки бронирований на странице profile-bookings.html
function loadBookings() {
    try {
        // Безопасное чтение из localStorage
        const bookingsData = localStorage.getItem('bookings');
        let bookings = [];
        
        if (bookingsData && bookingsData !== "undefined") {
            bookings = JSON.parse(bookingsData) || [];
        }

        const currentTab = document.getElementById('current');
        
        if (bookings.length === 0) {
            currentTab.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-suitcase"></i>
                    <h3>Нет текущих бронирований</h3>
                    <p>Здесь будут отображаться ваши активные бронирования</p>
                    <a href="tours.html" class="btn">Найти тур</a>
                </div>
            `;
        } else {
            currentTab.innerHTML = bookings.map(booking => `
                <div class="booking-card" data-id="${booking.id}">
                    <!-- Ваш HTML для отображения бронирования -->
                </div>
            `).join('');
        }
    } catch (error) {
        console.error("Ошибка при загрузке бронирований:", error);
        document.getElementById('current').innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Ошибка загрузки бронирований</h3>
                <p>Пожалуйста, попробуйте перезагрузить страницу</p>
            </div>
        `;
    }
}

// Обработчики для кнопок "Подробнее"
document.querySelectorAll('.btn-details').forEach(btn => {
    btn.addEventListener('click', function() {
        const tourId = this.getAttribute('data-tour');
        const tour = toursData[tourId];
        
        if (tour) {
            document.getElementById('modalTourTitle').textContent = tour.title;
            document.getElementById('modalTourDuration').textContent = tour.duration;
            document.getElementById('modalTourPeople').textContent = tour.people;
            document.getElementById('modalTourRating').textContent = tour.rating;
            document.getElementById('modalTourPrice').textContent = tour.price;
            document.getElementById('modalTourPricePer').textContent = tour.pricePer;
            document.getElementById('modalTourDescription').innerHTML = tour.description;
            
            
            
            // Показываем модальное окно
            document.getElementById('tourModal').style.display = 'block';
        }
    });
});

// Закрытие модального окна
document.querySelector('.close-modal').addEventListener('click', function() {
    document.getElementById('tourModal').style.display = 'none';
});

// Закрытие модального окна при клике вне его
window.addEventListener('click', function(e) {
    if (e.target === document.getElementById('tourModal')) {
        document.getElementById('tourModal').style.display = 'none';
    }
});

// Пагинация
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
    document.getElementById('prevPage').style.visibility = currentPage === 1 ? 'hidden' : 'visible';
    document.getElementById('nextPage').style.visibility = currentPage === totalPages ? 'hidden' : 'visible';
    
    // Показываем только туры для текущей страницы
    tourCards.forEach((card, index) => {
        const startIndex = (currentPage - 1) * toursPerPage;
        const endIndex = startIndex + toursPerPage;
        
        if (index >= startIndex && index < endIndex) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
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

// Инициализация пагинации
updatePagination();

// Сортировка туров
document.getElementById('sort').addEventListener('change', function() {
    const sortValue = this.value;
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
    currentPage = 1;
    updatePagination();
});
// Проверяем статус авторизации
document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('show');
    });
    
    // Авторизация
    const authButtons = document.getElementById('authButtons');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username') || 'Профиль';
    
    if (isLoggedIn) {
        // Если пользователь вошел, показываем кнопку профиля
        authButtons.innerHTML = `
            <a href="profile.html" class="btn-profile">
                <i class="fas fa-user"></i>
                ${username}
            </a>
            <button class="btn-logout" id="logoutBtn">
                <i class="fas fa-sign-out-alt"></i> Выход
            </button>
        `;
        
        // Обработчик выхода
        document.getElementById('logoutBtn').addEventListener('click', function() {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            window.location.href = 'index.html';
        });
    } else {
        // Если не вошел, показываем кнопки входа и регистрации
        authButtons.innerHTML = `
            <button class="btn-login" id="loginBtn">
                <i class="fas fa-sign-in-alt"></i> Вход
            </button>
            <button class="btn-register" id="registerBtn">
                <i class="fas fa-user-plus"></i> Регистрация
            </button>
        `;
        
        // Обработчики кнопок
        document.getElementById('loginBtn').addEventListener('click', function() {
            window.location.href = 'login.html';
        });
        
        document.getElementById('registerBtn').addEventListener('click', function() {
            window.location.href = 'register.html';
        });
    }
});