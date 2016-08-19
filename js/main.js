window.electronOpenLinkInBrowser = require('../node_modules/electron-open-link-in-browser/build/electron-open-link-in-browser.js');
window.$ = window.jQuery = require('./vendor/jquery-1.12.0.min');

var myTimers = {
    timers: {},

    init: function() {
        myTimers.loadTimers();
        myTimers.addTimerButton();
        myTimers.toggleTimerButton();
        myTimers.removeTimerButton();
        myTimers.timerLink();

        $('.floating-placeholder input').keydown(myTimers.updateText);
        $('.floating-placeholder input').change(myTimers.updateText);
    },

    timerLink: function() {
        $('.js-timer-list').on('click', 'a.timer-name', function(e) {
            e.preventDefault();

            require('electron').shell.openExternal(this.href);
        })
    },

    loadTimers: function() {
        var value = localStorage.getItem('timers');
        var timers = value && JSON.parse(value);
        myTimers.timers = timers || {};

        for (var id in myTimers.timers) {
            myTimers.timers[id].timer = new Stopwatch(id, myTimers.stopWatchTick);
            myTimers.timers[id].timer.setElapsed(myTimers.timers[id].elapsed.hours, myTimers.timers[id].elapsed.minutes, myTimers.timers[id].elapsed.seconds);
            if (myTimers.timers.hasOwnProperty(id)) {
                myTimers.displayTimer(myTimers.timers[id]);
            }
        }
    },

    saveTimers: function() {
        localStorage.setItem('timers', JSON.stringify(myTimers.timers));
    },

    addTimerButton: function() {
        $('.js-add-timer').on('click', function() {
            var $timerName = $('.js-timer-name');
            var $timerLink = $('.js-timer-link');

            if ($timerName.val().length === 0) {
                return;
            }

            myTimers.addTimer($timerName.val(), $timerLink.val());

            $timerName.val('');
            $timerLink.val('');

            $timerName.trigger('change');
            $timerLink.trigger('change');
        });
    },

    removeTimerButton: function() {
        $('.js-timer-list').on('click', '.js-remove-timer', function() {
            var $timer = $(this).closest('.js-timer');
            var id = $timer.attr('data-timer-id');
            $timer.remove();

            myTimers.timers[id].timer.stop();
            myTimers.timers.removeItem(id);

            myTimers.saveTimers();
        });
    },

    toggleTimerButton: function() {
        $('.js-timer-list').on('click', '.js-toggle-timer', function() {
            var $this = $(this);
            var $timer = $this.closest('.js-timer');
            var id = $timer.attr('data-timer-id');

            if (myTimers.timers[id].timer.started) {
                myTimers.timers[id].timer.stop();
                $this.text('start');
                $this.removeClass('pause').addClass('start');
                myTimers.saveTimers();

                return;
            }

            myTimers.timers[id].timer.start();
            $this.text('pause');
            $this.removeClass('start').addClass('pause');
            myTimers.saveTimers();
        });
    },

    addTimer: function(name, link) {
        var id = Date.now();
        var timer = {
            id: id,
            name: name,
            link: link,
            elapsed: {
                hours: 0,
                minutes: 0,
                seconds: 0,
                milliseconds: 0,
            },
            timer: new Stopwatch(id, myTimers.stopWatchTick)
        };

        myTimers.timers[timer.id] = timer;
        myTimers.saveTimers();

        myTimers.displayTimer(timer);
    },

    displayTimer: function(timer) {
        var $timer = $('.js-timer[data-timer-id=' + timer.id + ']');

        if ($timer.length > 0) {
            $timer.find('.timer-title').html(myTimers.timerToHtml(timer));
            return;
        }

        $timer = $('<div class="js-timer timer-list-item"></div>');
        $timer.attr('data-timer-id', timer.id);

        var $timerTitle = $('<h3 class="timer-title"></h3>');
        $timerTitle.html(myTimers.timerToHtml(timer));
        $timerTitle.appendTo($timer);

        var $timerButton = $('<button class="btn-toggle start js-toggle-timer">start</button>');
        $timerButton.appendTo($timer);

        var $removeButton = $('<button class="btn-remove js-remove-timer">remove</button>');
        $removeButton.appendTo($timer);

        $timer.appendTo($('.js-timer-list'));
    },

    timerToHtml: function(timer) {
        var name = '<span class="timer-name">' + timer.name + '</span>';
        if (timer.link.length > 0) {
            name = '<a class="timer-name js-timer-link" href="' + timer.link + '">' + timer.name + '</a>';
        }

        return name
            + '<span class="js-timer-elapsed timer-time">'
                + '<span class="js-timer-elapsed-hours">' + myTimers.zeroFill(timer.elapsed.hours, 2) + '</span>:'
                + '<span class="js-timer-elapsed-minutes">' + myTimers.zeroFill(timer.elapsed.minutes, 2) + '</span>:'
                + '<span class="js-timer-elapsed-seconds">' + myTimers.zeroFill(timer.elapsed.seconds, 2) + '</span>'
            + '</span>'
    },

    zeroFill: function(number, width)
    {
        width -= number.toString().length;
        if (width > 0) {
            return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
        }
        return number + ""; // always return a string
    },

    stopWatchTick: function(stopwatch) {
        myTimers.timers[stopwatch.id].elapsed = stopwatch.getElapsed();

        myTimers.displayTimer(myTimers.timers[stopwatch.id]);
        myTimers.saveTimers();
    },

    updateText: function() {
        var input = $(this);
        setTimeout(function() {
            var val = input.val();
            if (val != "") {
                input.parent().addClass("floating-placeholder-float");
            }
            else {
                input.parent().removeClass("floating-placeholder-float");
            }
        }, 1)
    }
};

$(myTimers.init);
