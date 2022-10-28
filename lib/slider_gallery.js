
class SliderGallery {
	constructor(object) {//, attributes = {}) {
		this.object = object;
		this.slides_objects = this.object.querySelectorAll('.slide');
		
		this.config = {};
		this.system_config = {}
		this.configure({
			'slide_selected': 0,        		// номер активного слайда
			'slide_poses_count': 7,     		// количество отображаемых слайдов
			'slide_max_rot_angle': 75,  		// максимальный угол поворота слайда (град)
			'slide_min_opacity': 0,     		// минимальная прозрачность крайних слайдов (0..1)
			'slide_min_scale': .1,					// минимальный масштаб крайних слайдов (0..1)
			'perspective': 1000,        		// глубина перспективы искажения 3d (пикс)
			'transition': 1.25,         		// время анимации (сек)
			'reverse_rotation': false,  		// изменить направление вращения (true/false)
			'circle_scroll': true,					// разрешить пролистывание слайдера по кругу
			'slide_click_scroll': true,			// разрешить перелистывать кликом
			'mouse_swipe_scroll': true,			// разрешить свайпы мышью
			'mouse_wheel_scroll': true,			// разрешить перелистывать прокруткой мыши
			'finger_swipe_scroll': true,		// разрешить свайпы пальцами
			'keys_scroll': true,						// разрешить переключение стрелками клавиатуры
			'keys_scroll_mouseover': false,	// прокручивать стрелками только если курсор над слайдером
		});

		this.add_events();
	}

	configure(conf) {
		for(let el in conf) {
			this.config[el] = conf[el];
		}
		if(this.config['slide_poses_count'] > this.slides_objects.length)
			this.config['slide_poses_count'] = this.slides_objects.length;
		if(this.config['slide_selected'] >= this.slides_objects.length)
			this.config['slide_selected'] = this.slides_objects.length - 1;
		this.object.style.perspective = this.config['perspective'] + 'px';
		this.object.style.transition = this.config['transition'] + 's';
		for(let i = 0; i < this.slides_objects.length; i++)
			this.slides_objects[i].style.transition = this.config['transition'] + 's';
		this.update();
	}
	add_events() {
		this.system_config['mousedown'] = false;
		this.system_config['mouse_position'] = [NaN, NaN];
		this.system_config['mouseover'] = false;
		this.system_config['wheel_scroll_count'] = 0;
		this.system_config['fingerdown'] = false;
		this.system_config['finger_position'] = [NaN, NaN];
		let self = this;
		this.resize_watcher(this);
		this.object.addEventListener('mousedown', function(e){ self.mousemove_watcher('mousedown') });
		this.object.addEventListener('mouseup', function(e){ self.mousemove_watcher('mouseup') });
		this.object.addEventListener('mousemove', function(e){ self.system_config['mouse_position'] = [e.clientX, e.clientY]; self.mousemove_watcher() });
		this.object.addEventListener('mouseover', function(e){ self.system_config['mouseover'] = true });
		this.object.addEventListener('mouseout', function(e){ self.system_config['mouseover'] = false });
		for(let i = 0; i < this.slides_objects.length; i++)
			this.slides_objects[i].addEventListener('click', function() { self.click_watcher(i) });
		this.object.addEventListener('wheel', function(e) { self.scroll_watcher(e) });
		this.object.addEventListener('touchstart', function(e){ self.swipe_watcher('touchstart', e) });
		this.object.addEventListener('touchend', function(e){ self.swipe_watcher('touchend', e) });
		this.object.addEventListener('touchmove', function(e){ self.system_config['finger_position'] = [e.clientX, e.clientY]; self.swipe_watcher('touchmove', e) });
		document.addEventListener('keydown', function(e) { self.keys_watcher(e) });
	}
	resize_watcher(self) {
		try {
			self.system_config['slider_last_size'] == undefined;
		}
		catch {}
		if(self.system_config['slider_last_size'] != self.object.clientWidth)
			self.update();
		self.system_config['slider_last_size'] = self.object.clientWidth;
		window.setTimeout(function() {self.resize_watcher(self)}, 1000);
	}
	mousemove_watcher(event = undefined) {
		if(event == 'mousedown') {
			this.system_config['mousedown'] = true;
			this.system_config['mousedown_position'] = this.system_config['mouse_position']
		}
		else if(event == 'mouseup') {
			//console.log(this.system_config);
			this.system_config['mousedown'] = false;
			let ms = this.system_config['mouse_position'];
			let ms_lst = this.system_config['mousedown_position'];
			let shift_x = ms[0] - ms_lst[0];
			let shift_y = Math.abs(ms[1] - ms_lst[1]);
			if(Math.abs(shift_x) > shift_y * 1.35
			&& Math.abs(shift_x) > 20
			&& this.config['mouse_swipe_scroll']) {
				if(shift_x < 0)
					this.next_slide();
				else
					this.previous_slide();
			}
		}
		//console.warn(event);
	}
	click_watcher(num) {
		if(this.config['slide_click_scroll']) {
			if(this.config['slide_selected'] != num)
				this.select_slide(num);
		}
	}
	scroll_watcher(event) {
		let dlt_x = event.deltaX;
		let dlt_y = event.deltaY;
		if(this.config['mouse_wheel_scroll']) {
			// console.log('scroll', event);
			if(Math.max(Math.abs(dlt_x), Math.abs(dlt_y)) > 10) {
				if(Math.max(dlt_x, dlt_y) > Math.abs(Math.min(dlt_x, dlt_y))) {
					// this.next_slide();
					this.system_config['wheel_scroll_count'] += 1;//Math.max(dlt_x, dlt_y);
					// console.log('next >>');
				}
				else {
					// this.previous_slide();
					this.system_config['wheel_scroll_count'] -= 1;//+= Math.min(dlt_x, dlt_y);
					// console.log('<< prev');
				}
				//console.log(this.system_config['wheel_scroll_count']);
				if(Math.abs(this.system_config['wheel_scroll_count']) > 10) {
					if(this.system_config['wheel_scroll_count'] > 0)
						this.next_slide();
					else
						this.previous_slide();
					this.system_config['wheel_scroll_count'] = 0;
				}
			}
			event.preventDefault();
			return false;
		}
	}
	swipe_watcher(event, e) {
		if(event == 'touchstart') {
			// console.log('touchDOWN \\/')
			this.system_config['fingerdown'] = true;
			this.system_config['fingerdown_position'] = [e.touches[0].clientX, e.touches[0].clientY];
		}
		else if(event == 'touchend') {
			// console.log('touchUP /\\')
			// console.log(this.system_config);

			this.system_config['fingerdown'] = false;
			let ms = this.system_config['finger_position'];
			// console.warn(ms);
			let ms_lst = this.system_config['fingerdown_position'];
			let shift_x = ms[0] - ms_lst[0];
			let shift_y = Math.abs(ms[1] - ms_lst[1]);
			if(Math.abs(shift_x) > shift_y * 1.35
			&& Math.abs(shift_x) > 40
			&& this.config['finger_swipe_scroll']) {
				if(shift_x < 0)
					this.next_slide();
				else
					this.previous_slide();
			}
		}
		else if(event == 'touchmove') {
			this.system_config['finger_position'] = [e.touches[0].clientX, e.touches[0].clientY];
		}
	}
	keys_watcher(e) {
		// console.log(e)
		// console.log(
		// 	this.config['keys_scroll'], 
		// 	this.config['keys_scroll_mouseover'],
		// 	);
		if(this.config['keys_scroll']
		&& ((this.config['keys_scroll_mouseover'] && this.system_config['mouseover'])
		|| !this.config['keys_scroll_mouseover']))
			if(e.key == 'ArrowLeft')
				this.previous_slide();
			else if(e.key == 'ArrowRight')
				this.next_slide();
	}

	get_rotation(pose) {
		let pos_cnt = this.config['slide_poses_count'];
		let sld_cnt = this.slides_objects.length;
		let pos_ctr = parseInt((pos_cnt+1) / 2);
		let max_ang = this.config['slide_max_rot_angle'];
		let rev_rot = this.config['reverse_rotation'] * 2 - 1;
		let sld_sel = this.config['slide_selected'];
		let angle = rev_rot * (pose - sld_sel) * (max_ang / (pos_ctr-1));
		if(angle > max_ang) angle = max_ang;
		if(angle < -max_ang) angle = -max_ang;
		return angle;
	}
	get_position_x(pose) {
		let slr_wdt = this.object.clientWidth;
		let sld_wdt = this.slides_objects[0].clientWidth;
		let sld_cnt = this.config['slide_poses_count'];
		let sld_sel = this.config['slide_selected'];
		let pos_ctr = parseInt((sld_cnt+1) / 2);
		let pos_stp = (slr_wdt-sld_wdt) / (sld_cnt-1);
		let position = ( sld_cnt - sld_cnt - sld_sel - (pose * -1) ) * pos_stp ;
		return position;
	}
	// get_position_z(pose) {
	// 	let slr_wdt = this.object.clientWidth;
	// 	let sld_wdt = this.slides_objects[0].clientWidth;
	// 	let sld_cnt = this.config['slide_poses_count'];
	// 	let sld_sel = this.config['slide_selected'];
	// 	let pos_ctr = parseInt((sld_cnt+1) / 2);
	// 	let pos_stp = (slr_wdt-sld_wdt) / (sld_cnt-1);
	// 	let position = -(Math.abs( sld_cnt - sld_cnt - sld_sel - (pose * -1) ) * pos_stp);
	// 	//console.log(position)
	// 	return position;
	// }
	get_scale(pose) {
		let slr_wdt = this.object.clientWidth;
		let sld_wdt = this.slides_objects[0].clientWidth;
		let sld_cnt = this.config['slide_poses_count'];
		let sld_sel = this.config['slide_selected'];
		let sld_msc = this.config['slide_min_scale'];
		let pos_ctr = parseInt((sld_cnt+1) / 2);
		let pos_stp = (slr_wdt-sld_wdt) / (sld_cnt-1);
		let scale = 1;
		if(pose != sld_sel)
			scale = (1-sld_msc) / Math.abs(sld_sel - pose) * .75 + sld_msc;
		// (1-min_opc) / Math.abs(sld_sel - pose) + min_opc;
		// let scale = 1 / (-(Math.abs( sld_cnt - sld_cnt - sld_sel - (pose * -1) ) * pos_stp)) * sld_msc;
		//console.log(pose, scale);
		return scale;
	}
	get_opacity(pose) {
		let pos_cnt = this.config['slide_poses_count'];
		let pos_ctr = parseInt((pos_cnt+1) / 2);
		let min_opc = this.config['slide_min_opacity'];
		let sld_sel = this.config['slide_selected'];
		let opacity = 1;
		if(pose != sld_sel)
			opacity = (1-min_opc) / Math.abs(sld_sel - pose) + min_opc;
		// add count!
		return opacity;
	}
	get_zindex(pose) {
		let pos_cnt = this.config['slide_poses_count'];
		let pos_ctr = parseInt((pos_cnt+1) / 2);
		let min_opc = this.config['slide_min_opacity'];
		let sld_sel = this.config['slide_selected'];
		let zindex = 0;
		zindex -= Math.abs(sld_sel - pose)+1;
		//console.log('z', zindex);
		return zindex;
	}
	
	update() {
		let slider_width = this.object.clientWidth;
		let slide_width  = this.slides_objects[0].clientWidth;
		let slides_count = this.slides_objects.length;
		for(let i = 0; i < slides_count; i++) {
			let posX = (slider_width-slide_width) / (slides_count-1) * i - (slider_width-slide_width)/2;
			let rotY = posX / 10;
			this.slides_objects[i].style.transform = ''
				+ ' translateX(' + this.get_position_x(i) + 'px)'
				+ ' rotateY(' + this.get_rotation(i) + 'deg)'
				+	' scale(' + this.get_scale(i) + ')'
			;
			this.slides_objects[i].style.opacity =
				this.get_opacity(i);
			this.slides_objects[i].style.zIndex =
				this.get_zindex(i);
		}
	}

	select_slide(num) {
		let sld_cnt = this.slides_objects.length;
		let crc_scr = this.config['circle_scroll'];
		if(num < 0 || num > sld_cnt-1) {
			if(!crc_scr) {
				if(num < 0)
					num = 0;
				if(num > sld_cnt-1)
					num = sld_cnt - 1;
			}
			else {
				while(num < 0)
					num += sld_cnt;
				while(num > sld_cnt-1)
					num -= sld_cnt;
			}
		}
		this.configure({
			'slide_selected': num
		});
	}
	change_slide(shift_size) {
		let sld_sel = this.config['slide_selected'];
		this.select_slide(sld_sel + shift_size);
	}
	next_slide() {
		this.change_slide(1);
	}
	previous_slide() {
		this.change_slide(-1);
	}

}
