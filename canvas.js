class Canvas
{

    constructor(dom_obj)
    {
        this.dom_obj = dom_obj;
        this.context = this.dom_obj.getContext('2d');
        this.touches = new Array();
        this.buttons = new Array();
        this.keys = {};
        this.hud_elements = new Array();
        this.objects = new Array();
        this.level = null;
        this.x = 0;
        this.y = 0;
        this.debug_text = [];
        this.last_touch = null;
        this.right_click_callback = null;
        this.hold_length = 0;
        this.hold_to_right_click = 60;
    }

    button_add(button)
    {
        this.buttons.push(button);
    }

    button_get(name)
    {
        for(var i = 0; i < this.buttons.length; i++)
        {
            if(this.buttons[i].name_get() == name)
            {
                return this.buttons[i];
            }
        }
    }

    buttons_get()
    {
        return this.buttons;
    }

    buttons_clean()
    {
        this.buttons = new Array();
    }

    context_get()
    {
        return this.context;
    }

    debug_write(out_text)
    {
        if(this.debug_text.length > 0 && this.debug_text[0]['text'] == out_text)
        {
            this.debug_text[0]['num']++;
        }
        else
        {
            this.debug_text.unshift({
                'ctime': Date.now(),
                'num':   1,
                'text':  out_text,
            });
        }
        this.debug_text = this.debug_text.slice(0, 10);
    }

    dom_obj_get()
    {
        return this.dom_obj;
    }

    drag_get_x(new_touch)
    {

        if(this.last_touch == null || this.last_touch['touch_x'] == null)
        {
            return 0;
        }
        else
        {
            var last_x = this.last_touch['touch_x']
            this.last_touch['touch_x'] = new_touch['touch_x'];
            return last_x - new_touch['touch_x'];
        }
    }

    drag_get_y(new_touch)
    {

        if(this.last_touch == null || this.last_touch['touch_y'] == null)
        {
            return 0;
        }
        else
        {
            var last_y = this.last_touch['touch_y']
            this.last_touch['touch_y'] = new_touch['touch_y'];
            return last_y - new_touch['touch_y'];
        }

    }

    is_pressed(name)
    {
        if(this.keys[name] === true)
        {
            return true;
        }

        for(var i = 0; i < this.buttons.length; i++)
        {
            if(this.buttons[i].name_get() == name)
            {
                return this.buttons[i].is_pressed();
            }
        }
        return false;
    }

    hud_element_add(hud_element)
    {
        this.hud_elements.push(hud_element);
    }

    key_down(evt)
    {
        var name = '';
        switch(evt['keyCode'])
        {
            case 37:
                name = 'left';
                break;
            case 38:
                name = 'jump';
                break;
            case 39:
                name = 'right';
                break;
        }

        this.keys[name] = true;

    }

    key_up(evt)
    {
        var name = '';
        switch(evt['keyCode'])
        {
            case 37:
                name = 'left';
                break;
            case 38:
                name = 'jump';
                break;
            case 39:
                name = 'right';
                break;
        }

        this.keys[name] = false;

    }

    level_get()
    {
        return this.level;
    }

    level_load(name)
    {

        if(game_info['levels'][name] != null)
        {
            this.level = new Level(name, this.context);
        }

    }

    mouse_down(evt)
    {

        if(evt == null)
        {
            return;
        }

        //don't handle right-clicks here
        //https://www.w3schools.com/jsref/event_which.asp#:~:text=The%20which%20property%20returns%20a,together%20with%20the%20onmousedown%20event.
        if(evt['which'] == 3)
        {
            return;
        }

        this.touches.push({
            'touch_x': evt.clientX,
            'touch_y': evt.clientY,
            'identifier': 'mouse',
            'event': 'press',
            'x_dist': 0,
            'y_dist': 0,
        });

        this.last_touch = {
            'touch_x': evt.clientX,
            'touch_y': evt.clientY,
            'identifier': 'mouse',
            'event': 'press',
            'x_dist': 0,
            'y_dist': 0,
        };

    }

    mouse_move(evt)
    {
        for(var i = 0; i < this.touches.length; i++)
        {
            if(this.touches[i]['identifier'] == 'mouse')
            {
                this.touches[i]['last_x'] = this.touches[i]['touch_x'];
                this.touches[i]['last_y'] = this.touches[i]['touch_y'];

                this.touches[i]['touch_x'] = evt.clientX;
                this.touches[i]['touch_y'] = evt.clientY;

                this.touches[i]['x_dist'] += (this.touches[i]['last_x'] - this.touches[i]['touch_x']);
                this.touches[i]['y_dist'] += (this.touches[i]['last_y'] - this.touches[i]['touch_y']);
            }
        }
    }

    mouse_up(evt)
    {
        this.touches = new Array();
        this.last_touch = null;

        if(evt != null)
        {
            evt = evt || window.event;

            if (evt.stopPropagation)
                evt.stopPropagation();

            evt.cancelBubble = true;
            return false;
        }

    }

    resize()
    {

        for(var i = 0; i < buttons.length; i++)
        {
            buttons[i].find_position();
        }

    }

    right_click(evt)
    {
        if(evt != null & this.right_click_callback != null)
        {
            this.right_click_callback(evt.clientX, evt.clientY);
        }
    }

    right_click_callback_set(callback)
    {
        this.right_click_callback = callback;
    }

    rotate(deg_angle)
    {
        this.context.rotate(deg_angle * Math.PI/180);
    }

    scale(x_mult, y_mult)
    {
        this.context.scale(x_mult, y_mult);
    }

    segment_load()
    {

    }

    size_set(width, height)
    {
        this.dom_obj.setAttribute('width', width);
        this.dom_obj.setAttribute('height', height);
    }

    step()
    {

//        this.context.clearRect(this.x, this.y, game_info['inner_width'], game_info['inner_height']);
        this.context.clearRect(this.x, this.y, game_info['inner_ratio'] * parseFloat(this.dom_obj.getAttribute('width')),  game_info['inner_ratio'] * parseFloat(this.dom_obj.getAttribute('height')));

        for(var i = 0; i < this.debug_text.length; i++)
        {
            this.context.fillText(this.debug_text[i]['text'] + ' (' + this.debug_text[i]['num'] + ')', 0, (i + 1) * 16);
        }

        //check buttons
        for(var i = 0; i < this.buttons.length; i++)
        {
            this.buttons[i].click_check(this.touches);
        }

        //don't run the game if you're paused
        if(!game_info['paused'] && this.level != null)
        {
            this.level.step();
        }

        //check buttons
        for(var i = 0; i < this.buttons.length; i++)
        {
            this.buttons[i].draw();
        }

        //draw the user's touch
        for(var i = 0; i < this.touches.length; i++)
        {
            this.context.beginPath();
            this.context.arc(this.touches[i]['touch_x'], this.touches[i]['touch_y'], game_info['width'] / 20, 0, 2 * Math.PI);
            this.context.fillStyle = 'rgba(100, 255, 255, 0.5)';
            this.context.fill();

            //now that the step is over, swap user touches from press to hold
            this.touches[i]['event'] = 'hold';

            if(Math.abs(this.touches[i]['x_dist']) < game_info['tile_size'] / 2 && Math.abs(this.touches[i]['y_dist']) < game_info['tile_size'] / 2)
            {
                this.hold_length++;
            }
            else
            {
                this.hold_length = 0;
            }

            if(this.hold_length > this.hold_to_right_click)
            {
                var evt = {
                    'clientX': this.touches[i]['touch_x'],
                    'clientY': this.touches[i]['touch_y'],
                };
                this.right_click(evt);
                this.touches.splice(i, 1);
                i--;
            }

        }

        if(this.touches.length == 0)
        {
            this.hold_length = 0;
        }

    }

    touch_activate()
    {

        this.dom_obj.addEventListener('contextmenu', this.right_click.bind(this), false);

        //https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events/Using_Pointer_Events

        this.dom_obj.addEventListener("touchstart", this.touch_start.bind(this), false);
        this.dom_obj.addEventListener("touchend", this.touch_end.bind(this), false);
        this.dom_obj.addEventListener("touchcancel", this.touch_cancel.bind(this), false);
        this.dom_obj.addEventListener("touchmove", this.touch_move.bind(this), false);

        this.dom_obj.addEventListener('mousedown', this.mouse_down.bind(this), false);
        this.dom_obj.addEventListener('mousemove', this.mouse_move.bind(this), false);
        this.dom_obj.addEventListener('mouseup', this.mouse_up.bind(this), false);

        //for canvases, keys are bound to the document, not the DOM object
        document.addEventListener('keydown', this.key_down.bind(this), false);
        document.addEventListener('keyup', this.key_up.bind(this), false);

    }

    touch_cancel(evt)
    {

        evt.preventDefault();
        var new_touches = evt.changedTouches;
  
        for (var i = 0; i < new_touches.length; i++)
        {
            var idx = ongoingTouchIndexById(new_touches[i].identifier);
            this.touches.splice(idx, 1);  // remove it; we're done
        }

    }

    touch_copy(touch)
    {
        var obj = {
            'identifier': touch.identifier,
        };
        if(screen_orientation == 'portrait')
        {
            obj['touch_x'] = touch['clientY'];
            obj['touch_y'] = game_height - touch['clientX'];
        }
        else
        {
            obj['touch_x'] = touch['clientX'];
            obj['touch_y'] = touch['clientY'];
        }
        obj['event'] = touch['event'];
        return obj;
    }

    touch_end(evt)
    {
        evt.preventDefault();
        var new_touches = evt.changedTouches;

        for (var i = 0; i < new_touches.length; i++)
        {
            var idx = this.touch_find(new_touches[i].identifier);

            if(idx >= 0)
            {
                this.touches.splice(idx, 1);  // remove it; we're done
            }
        }

    }

    touch_find(idToFind)
    {
        for (var i = 0; i < this.touches.length; i++)
        {
            var id = this.touches[i]['identifier'];

            if(id == idToFind)
            {
                return i;
            }
        }
        return -1;    // not found
    }

    touch_move(evt)
    {

        evt.preventDefault();
        var new_touches = evt.changedTouches;

        for (var i = 0; i < new_touches.length; i++)
        {
            var idx = this.touch_find(new_touches[i].identifier);

            if (idx >= 0)
            {
                new_touches[i]['event'] = 'hold';

                var curr_touch = this.touch_copy(new_touches[i]);

                curr_touch['last_x'] = this.touches[idx]['touch_x'];
                curr_touch['last_y'] = this.touches[idx]['touch_y'];

                curr_touch['x_dist'] += curr_touch['last_x'] - curr_touch['touch_x'];
                curr_touch['y_dist'] += curr_touch['last_y'] - curr_touch['touch_y'];

                this.touches.splice(idx, 1, curr_touch);  // swap in the new touch record
            }
        }

    }

    touch_start(evt)
    {
        evt.preventDefault();
        var new_touches = evt.changedTouches;

        for (var i = 0; i < new_touches.length; i++)
        {
            new_touches[i]['event'] = 'press';
            var curr_touch = this.touch_copy(new_touches[i]);
            curr_touch['x_dist'] = 0;
            curr_touch['y_dist'] = 0;
            curr_touch['last_x'] = curr_touch['touch_x'];
            curr_touch['last_y'] = curr_touch['touch_y'];
            this.touches.push(curr_touch);
        }
    }

    translate(x, y)
    {
        this.x -= x;
        this.y -= y;
        this.context.translate(x, y);
    }

}
