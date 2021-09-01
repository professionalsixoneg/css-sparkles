/*!
 * sparkle.js
 * v1.0
 * author: @marzepani
 * page: gapcode.com/sparkle-js/
 */
var Sparkle = function() {
	'use strict';

	var settings = {

		totalStars: 8,		// number of stars

		verticalSlot: {
			start: 0,
			end: null
		},

		leftSlot: {
			start: 0,
			end: null
		},

		rightSlot: {
			start: null,
			end: null
		},

		starPng: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAS0lEQVQYGZXBQRGAIABFwVeCJBIG00AbwkgRKfE8c/kz7sLBQmIlsZE4SJwkPiRuTharze50udXX5XR4e1k4uUlcJE4SO4mNxIs/PsnOKsJwHzXnAAAAAElFTkSuQmCC'

	};

	var wrapper = null;

	var stars = [];

	var paused = false;



	/**
	 * initialize
	 */
	var init = function(wrapperId) {
		initSlots(wrapperId);
		buildStars();
		setTimeout(initAnimation, 0);

		// listen to resize event
		$(window).on('resize', function() {
			paused = false;
			initSlots();
		});

		// listen to focus event
		$(window).on('focus', function() {
			paused = false;
			initAnimation();
		});

		// listen to blur event
		$(window).on('blur', function() {
			paused = true;
		});
	};



	/**
	 * initialize slots
	 */
	var initSlots = function(wrapperId) {
		if (typeof wrapperId !== 'undefined') {
			wrapper = $(wrapperId);
		}
		else if (wrapper === null) {
			// fall back to first div if no wrapperId is set and wrapper is null
			wrapper = $('body > div').first();
		}

		/*
		// calc slots
		leftSlot.end = wrapper.position().left;		// FF ok, WebKit not

		rightSlot.start = leftSlot.end + wrapper.width() - 15;
		rightSlot.end = $(window).width() - 15;
		*/

		// calc slots; expect wrapper to be centered
		var wrapperWidth = wrapper.width()/2;
		var pageWidth = $(window).width();
		var slotWidth = (pageWidth - wrapperWidth) / 2;

		settings.leftSlot.start = 0;
		settings.leftSlot.end = slotWidth;

		settings.rightSlot.start = slotWidth + wrapperWidth;
		settings.rightSlot.end = pageWidth - 5;

		settings.verticalSlot.end = $(window).height() - settings.verticalSlot.start;
	};



	/**
	 * build stars
	 */
	var buildStars = function() {
		for (var i = 0; i < settings.totalStars; i++) {
			buildStar(i);
		}
	};



	/**
	 * build star
	 */
	var buildStar = function(id) {
		var star = document.createElement('div');
		star.id = 'star' + id;

		var pos = placeStar();
		star.style.cssText = 'position:fixed;width:15px;height:15px;left:' + pos.x + 'px;top:' + pos.y + 'px;opacity:1';

		var img = document.createElement('img');
		img.src = settings.starPng;
		star.appendChild(img);

		document.body.insertBefore(star, document.body.lastChild);

		stars.push(star);
	};



	/**
	 * place star
	 */
	var placeStar = function() {
		var pos = {
			x: null,
			y: null
		};

		var slot = Math.random() < 0.5 ? settings.leftSlot : settings.rightSlot;

		pos.x = Math.floor(slot.start + Math.random() * (slot.end - slot.start));
		pos.y = Math.floor(settings.verticalSlot.start + Math.random() * (settings.verticalSlot.end - settings.verticalSlot.start));

		return pos;
	};



	/**
	 * init animation
	 */
	var initAnimation = function() {
		var i, l = stars.length;

		for (i = 0; i < l; i++) {
			animateStar(stars[i]);
		}
	};



	/**
	 * animate star
	 */
	var animateStar = function(star) {
		var speed = 250 + Math.random() * 250;

		$(star).animate({
				opacity: 0
			},
			speed,
			function() {
				// animation complete
				if (paused === true) return;

				// restart at new position
				var pos = placeStar();
				// center
				pos.x -= 7;
				pos.y -= 7;
				star.style.cssText = 'position:fixed;width:15px;height:15px;left:' + pos.x + 'px;top:' + pos.y + 'px;opacity:1';
				animateStar(star);
			}
		);
	};

	return {
		init: init
	};

};
