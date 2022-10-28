
# slider gallery js v0.1.1


## описание 

универсальльный горизонтальный слайдер для веб-страниц.  
Слайдер автоматически встраивается в элемент, и не требует особой донастройки.  


## инициализация слайдера 

для инициальзации достаточно разместить каталог `lib/` в своём проекте и добавить несколько строк настройки.

### подключение к веб-странице 

подключить JS и CSS файлы в HEAD.

	<link rel="stylesheet" href="lib/slider_gallery.css">
	<script src="lib/slider_gallery.js"></script>

#### HTML 

добавить классы `slider_gallery` и `slide` к блоку, который требуется сделать слайдером.

	<div class="slider_gallery">
		<div class="slide"></div>
		<div class="slide"></div>
		<div class="slide"></div>
		. . .	
	</div>

#### JS 

инициализировать свой слайдер в коде после загрузки DOM.

	slider1 = new SliderGallery(
		document.querySelector('.slider_gallery')
	);

#### настройка свойств слайдера

если стандартные настройки слайдера не подходят, можно использовать метод `.congigure()`, который принимает словарь из пар свойство-значение, и поменять конфигурацию слайдера

	slider1.configure({
    'slide_poses_count': 3,
    'slide_max_rot_angle': 0,
    'slide_min_scale': .6,
    'transition': .75,
	});

### свойства слайдера
| свойство							| значение по умолчанию	| единица измерения	| диапазон											| описание																								|
|-----------------------|-----------------------|-------------------|-------------------------------|---------------------------------------------------------|
| slide_selected				| 0											| 									| 0 .. кол-во слайдов - 1				| номер активного слайда																	|
| slide_poses_count			| 7											| 									| 3 .. кол-во сл. (нечётное)		| количество отображаемых слайдов													|
| slide_max_rot_angle		| 75										| deg								| 0 .. 360											| максимальный угол поворота слайда												|
| slide_min_opacity			| 0											| 									| 0 .. 1												| минимальная прозрачность крайних слайдов								|
| slide_min_scale				| .1										| 									| 0 .. 1												| минимальный масштаб крайних слайдов											|
| perspective						| 1000									| px								| 0 .. бесконечность						| глубина перспективы искажения 3d												|
| transition						| 1.25									| s									| 0 .. бесконечность						| время анимации																					|
| reverse_rotation			| false									| bool							| true / false									| изменить направление вращения														|
| circle_scroll					| true									| bool							| true / false									| разрешить пролистывание слайдера по кругу								|
| slide_click_scroll		| true									| bool							| true / false									| разрешить перелистывать кликом													|
| mouse_swipe_scroll		| true									| bool							| true / false									| разрешить свайпы мышью																	|
| mouse_wheel_scroll		| true									| bool							| true / false									| разрешить перелистывать прокруткой мыши									|
| finger_swipe_scroll		| true									| bool							| true / false									| разрешить свайпы пальцами																|
| keys_scroll						| true									| bool							| true / false									| разрешить переключение стрелками клавиатуры							|
| keys_scroll_mouseover	| false									|	bool							|	true / false									| прокручивать стрелками только если курсор над слайдером	|