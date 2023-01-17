class Obj_Grid_Draw
{

    constructor(x, y, extra)
    {

        this.name = 'Obj_Grid_Draw';
        this.objects = new Array();

        this.width = game_info['def_width'];
        this.height = this.width * (4 / 3);

        this.x = 0;
        this.y = 0;

        this.x_offset = 0;

        this.y_offset = game_info['def_height'];
        this.x_offset_old = 0;
        this.y_offset_old = game_info['def_height'];

        this.fill_style = '#87CEEB';
        this.font_fill = 'rgba(0, 0, 0, 1)';
        this.font_size = game_info['inner_ratio'] * 10;
        this.font_style = this.font_size.toString() + 'px Arial';
        this.grid_style = 'rgba(0,0,0,0.3)';
        this.tile_size = game_info['tile_size'] / 2;

        this.x_translate_total = 0;
        this.y_translate_total = game_info['def_height'];

        this.playing = false;

        this.test_object_index_start = 0;

    }

    collide()
    {

    }

    draw(canvas_context)
    {

        if(this.playing)
        {
            return;
        }

        canvas_context.fillStyle = this.fill_style;
        canvas_context.fillRect(this.x, this.y - (this.y_offset / game_info['inner_ratio']) - this.tile_size, this.width, this.height + this.tile_size);
        canvas_context.fill();

        for(var i = 0; i < this.objects.length; i++)
        {
            this.objects[i].draw(canvas_context);
        }

        canvas_context.strokeStyle = this.grid_style;
        var num_verts = Math.ceil(this.width / this.tile_size);
        var start_y = this.y + (this.y_offset / game_info['inner_ratio']) % this.tile_size - (this.y_offset / game_info['inner_ratio']) - this.tile_size;
        for(var i = 0; i < num_verts; i++)
        {
            canvas_context.beginPath();
            canvas_context.moveTo(this.x + (i * this.tile_size), this.y + (-1 * this.y_offset / game_info['inner_ratio']));
            canvas_context.lineTo(this.x + (i * this.tile_size), this.y + (-1 * (this.y_offset / game_info['inner_ratio']) + this.height));
            canvas_context.stroke();
        }

        var num_horis = Math.ceil(this.height / this.tile_size);

        for(var i = 0; i < num_horis; i++)
        {
            canvas_context.beginPath();
            canvas_context.moveTo(this.x, start_y + (i * this.tile_size));
            canvas_context.lineTo(this.x + this.width, start_y + (i * this.tile_size));
            canvas_context.stroke();
        }

        this.x_translate_total += (this.x_offset - this.x_offset_old);
        this.y_translate_total += (this.y_offset - this.y_offset_old);

        game_canvas.translate((this.x_offset - this.x_offset_old) / game_info['inner_ratio'], (this.y_offset - this.y_offset_old) / game_info['inner_ratio']);

        if(this.x_translate_total > 0)
        {
            this.x_translate_total -= (this.x_offset - this.x_offset_old);
            game_canvas.translate(-1 * ((this.x_offset - this.x_offset_old) / game_info['inner_ratio']), 0);
        }

//        if(this.y_translate_total > 0)
        if(this.y_translate_total <= game_info['def_height'])
        {
            this.y_translate_total -= (this.y_offset - this.y_offset_old);
            game_canvas.translate(0, -1 * ((this.y_offset - this.y_offset_old) / game_info['inner_ratio']));
        }

        game_canvas.level_get().camera_set(0, -1 * this.y_offset / game_info['inner_ratio']);

    }

    height_get()
    {
        return 0;
    }

    move()
    {

    }

    object_add(obj)
    {
        this.objects.push(obj);
    }

    objects_get()
    {
        return this.objects;
    }

    name_get()
    {
        return this.name;
    }

    offset_set(x_offset, y_offset)
    {

/*
        this.x_translate_total = (this.x_offset - x_offset);
        this.y_translate_total = (this.y_offset - y_offset);
*/

        x_offset = 0;

        this.x_offset_old = this.x_offset;
        this.y_offset_old = this.y_offset;

/*
        var old_x_offset = this.x_translate_total;
        var old_y_offset = this.y_translate_total;
*/
        this.x_offset = x_offset;
        this.y_offset = y_offset;

    }

    play()
    {

        this.playing = true;

        button_canvas.button_get('obj_grid').playing_set(true);

        game_info['levels']['custom'] = {
            'buttons': [
                {
                    'x':     0,
                    'y':     0,
                    'size':  0,
                    'name':  'Move',
                    'extra': {},
                },
                {
                    'x':     0,
                    'y':     0,
                    'size':  0,
                    'name':  'Stop_Button',
                    'extra': {},
                },
            ],
            'objects': [],
        }

        for(var i = 0; i < this.objects.length; i++)
        {
            game_info['levels']['custom']['objects'].push({
                'x':     this.objects[i].x_get(),
                'y':     this.objects[i].y_get(),
                'name':  this.objects[i].name_get(),
                'extra': this.objects[i].extra_get(),
            });
        }

        for(var i = 0; i < game_info['levels']['custom']['buttons'].length; i++)
        {
            game_canvas.level_get().button_add(game_info['levels']['custom']['buttons'][i], i);
        }

        this.test_object_index_start = 2;

        for(var i = 0; i < game_info['levels']['custom']['objects'].length; i++)
        {
            game_canvas.level_get().queue(game_info['levels']['custom']['objects'][i], i + this.test_object_index_start);
        }

        game_canvas.level_get().queue({
            'x':     (game_info['def_width'] / 2) - (game_info['tile_size'] / 4), //start the player in the middle of the screen
            'y':     (-1 * (this.y_offset / game_info['inner_ratio'])) + game_info['def_height'], //start the player towards the bottom of the screen you're looking at
            'name':  'Player',
            'extra': {},
        }, 1);

    }

    save()
    {
        var tmp_obj = {
            'buttons': [
                {
                    'x':    0,
                    'y':    0,
                    'size': 1,
                    'name': 'jump',
                },
            ],
            'objects': [],
        }

        for(var i = 0; i < this.objects.length; i++)
        {
            tmp_obj['objects'].push({
                'x':     this.objects[i].x_get(),
                'y':     this.objects[i].y_get(),
                'name':  this.objects[i].name_get(),
                'extra': this.objects[i].extra_get(),
            });
        }

        download('custom_' + Date.now().toString() + '.json', JSON.stringify(tmp_obj, null, 4));

    }

    stop()
    {

        this.playing = false;

        button_canvas.button_get('obj_grid').playing_set(false);

        button_canvas.button_remove('Stop_Button');
        button_canvas.button_remove('move_slider');

var contents = {'objects': this.objects};

button_canvas.button_get('file').file_load(JSON.stringify(contents));

    }

    width_get()
    {
        return 0;
    }

    x_get()
    {
        return 0;
    }

    y_get()
    {
        return 0;
    }

}

constructors['Obj_Grid_Draw'] = Obj_Grid_Draw;
