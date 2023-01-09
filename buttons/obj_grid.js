class Obj_Grid extends Button
{

    constructor(x_ratio, y_ratio, radius_ratio, canvas, extra)
    {
        super(x_ratio, y_ratio, radius_ratio, canvas);
        this.name = 'obj_grid';

        this.x = game_info['inner_offset'];
        this.y = 0;
        this.width = game_info['inner_width'];
        this.height = game_info['inner_height'];
        this.fill_style = '#87CEEB';

        this.font_fill = 'rgba(0, 0, 0, 1)';
        this.font_size = game_info['inner_ratio'] * 10;
        this.font_style = this.font_size.toString() + 'px Arial';

        this.grid_style = '#000000';

//        this.tile_size = game_info['tile_size'] * game_info['inner_ratio'];
        this.tile_size = game_info['tile_size'] / 2;

        this.x_offset_old = 0;
        this.y_offset_old = 0;
        this.x_offset = 0;
        this.y_offset = 0;
        this.x_curr_drag = 0;
        this.y_curr_drag = 0;

        this.click_x = null;
        this.click_y = null;

        this.objects = new Array();

        canvas.right_click_callback_set(this.right_click.bind(this));

        this.context_obj = null;
        this.context_menu = null;

        this.playing = false;

    }

    click_check(touches)
    {

        if(this.playing)
        {
            return;
        }

        if(this.context_menu != null)
        {
            this.context_menu.click_check(touches);
            this.click_x = null;
            this.click_y = null;
            this.x_curr_drag = 0;
            this.y_curr_drag = 0;
            return;
        }

        this.x_offset_old = this.x_offset;
        this.y_offset_old = this.y_offset;

        for(var i = 0; i < touches.length; i++)
        {

            //make sure this touch is touching the bar
            if(touches[i]['touch_x'] > this.x && touches[i]['touch_x'] < this.x + this.width && touches[i]['touch_y'] > this.y && touches[i]['touch_y'] < this.y + this.height)
            {

                //if you're already pressed, scroll based on the user's movement
                if(touches[i]['event'] == 'hold')
                {

                    this.x_offset_old = this.x_offset;
                    this.y_offset_old = this.y_offset;

                    //get the distance dragged
                    var x_drag = button_canvas.drag_get_x(touches[i]);
                    var y_drag = button_canvas.drag_get_y(touches[i]);

                    this.x_offset -= x_drag;
                    this.y_offset -= y_drag;

                    this.x_offset = 0;

                    //go from the bottom up
                    if(this.y_offset < 0)
                    {
                        this.y_offset = 0;
                    }

                    this.x_curr_drag -= x_drag;
                    this.y_curr_drag -= y_drag;

                    //don't count a press if you move too far
                    if(Math.abs(this.x_curr_drag) > this.tile_size || Math.abs(this.y_curr_drag) > this.tile_size)
                    {
                        this.click_x = null;
                        this.click_y = null;
                    }

                }

                if(touches[i]['event'] == 'press')
                {
                    this.click_x = touches[i]['touch_x'] - this.x - this.x_offset;
                    this.click_y = touches[i]['touch_y'] - this.y - this.y_offset;
                }

                game_canvas.level_get().object_get('obj_grid_draw').offset_set(this.x_offset, this.y_offset);

                return;
            }
        }

        game_canvas.level_get().object_get('obj_grid_draw').offset_set(this.x_offset, this.y_offset);

        if(touches.length == 0)
        {
            this.x_curr_drag = 0;
            this.y_curr_drag = 0;
            if(this.click_x != null && this.click_y != null)
            {
                this.press();
                this.click_x = null;
                this.click_y = null;
            }
        }

        this.pressed = false;
    }

    context_menu_return(item)
    {
        this.context_menu = null;

        if(item == 'Delete')
        {
            var objects = game_canvas.level_get().object_get('obj_grid_draw').objects_get();
            objects.splice(this.context_obj, 1);
        }
    }

    draw()
    {

        this.canvas.context_get().fillStyle = this.font_fill;
        this.canvas.context_get().font = this.font_style;

        var obj_button = button_canvas.button_get('obj_list');
        var obj = obj_button.curr_obj_get();
        this.canvas.context_get().fillText(obj['display'], this.x, this.y + this.font_size);

        //draw context menu when right-clicking

        if(this.context_menu != null)
        {
            this.context_menu.draw();
        }

    }

    press()
    {

        var obj_button = button_canvas.button_get('obj_list');
        var obj = obj_button.curr_obj_get();

        var obj_x = Math.floor((this.click_x / game_info['inner_ratio']) / this.tile_size) * this.tile_size;
        var obj_y = Math.floor((this.click_y / game_info['inner_ratio']) / this.tile_size) * this.tile_size;

        var new_obj = new constructors[obj['constructor']](obj_x, obj_y, obj['extra']);

        game_canvas.level_get().object_get('obj_grid_draw').object_add(new_obj);

        super.press();

    }

    right_click(canvas_x, canvas_y)
    {

        if(this.playing)
        {
            return;
        }

        var grid_x = (canvas_x - this.x - this.x_offset) / game_info['inner_ratio'];
        var grid_y = (canvas_y - this.y - this.y_offset) / game_info['inner_ratio'];

        this.click_x = canvas_x;
        this.click_y = canvas_y;

        if(game_canvas == null || game_canvas.level_get() == null || game_canvas.level_get().object_get('obj_grid_draw') == null || game_canvas.level_get().object_get('obj_grid_draw').objects_get() == null)
        {
            return;
        }

        var objects = game_canvas.level_get().object_get('obj_grid_draw').objects_get();

        for(var i = 0; i < objects.length; i++)
        {

            if(objects[i].x_get() <= grid_x && objects[i].y_get() <= grid_y && objects[i].x_get() + objects[i].width_get() >= grid_x && objects[i].y_get() + objects[i].height_get() >= grid_y)
            {
                this.context_obj = i;
                this.context_menu = new List(this.click_x, this.click_y, ['Delete'], this.context_menu_return.bind(this), this.canvas);
            }

        }

    }

}

constructors['Obj_Grid'] = Obj_Grid;
