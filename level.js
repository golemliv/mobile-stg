class Level
{

    constructor(name, canvas_context)
    {

        this.data = game_info['levels'][name];

        if(this.data == null)
        {
            return false;
        }

        this.canvas_context = canvas_context;

        this.tile_size = game_info['tile_size'];
        this.segment_width = game_info['def_width'];
        this.segment_height = game_info['def_height'];
        this.num_tiles_wide = this.segment_width / this.tile_size;
        this.num_tiles_tall = this.segment_height / this.tile_size;
        this.curr_segment_x = 0;
        this.curr_segment_y = 0;
        this.segments = [];
        this.objects = {}; //object, not array
        this.hud = [];
        this.camera_x = 0;
        this.camera_y = 0;
        this.player = null;

        this.camera_inner_left = this.camera_x;
        this.camera_inner_right = this.camera_x + game_info['def_width'];
        this.camera_inner_top = this.camera_y;
        this.camera_inner_bottom = this.camera_y + game_info['def_height'];

        this.camera_tile_outer_bound = 2;

        this.camera_outer_left = this.camera_x - (this.camera_tile_outer_bound * this.tile_size);
        this.camera_outer_right = this.camera_x + game_info['def_width'] + (this.camera_tile_outer_bound * this.tile_size);
        this.camera_outer_top = this.camera_y - (this.camera_tile_outer_bound * this.tile_size);
        this.camera_outer_bottom = this.camera_y + game_info['def_height'] + (this.camera_tile_outer_bound * this.tile_size);

        this.camera_speed = 5;

        button_canvas.buttons_clean();

        if(this.data['buttons'] != null)
        {
            for(var i = 0; i < this.data['buttons'].length; i++)
            {
                this.button_add(this.data['buttons'][i], i);
            }
        }

        if(this.data['objects'] != null)
        {
            for(var i = 0; i < this.data['objects'].length; i++)
            {
                this.queue(this.data['objects'][i], i);
            }
        }

        if(this.data['hud'] != null)
        {
            for(var i = 0; i < this.data['hud'].length; i++)
            {
                this.hud.push(this.data['hud'][i]);
            }
        }

    }

    button_add(obj, id)
    {
        button_canvas.button_add(new constructors[obj['name']](obj['x'], obj['y'], obj['size'], button_canvas, obj['extra']));
    }

    hud_add(obj, id)
    {

    }

    camera_find()
    {

        var old_camera_x = this.camera_x;
        var old_camera_y = this.camera_y;

        if(this.player != null)
        {
            this.camera_x = this.player.x_get() + (this.player.width_get() / 2) - (game_info['def_width'] / 2);
            this.camera_y = this.player.y_get() + (this.player.height_get() / 2) - (game_info['def_height'] / 2);

            this.curr_segment_x = Math.floor(this.camera_x / game_info['def_width']);
            this.curr_segment_y = Math.floor(this.camera_y / game_info['def_height']);
        }

        this.camera_inner_left = this.camera_x;
        this.camera_inner_right = this.camera_x + game_info['def_width'];
        this.camera_inner_top = this.camera_y;
        this.camera_inner_bottom = this.camera_y + game_info['def_height'];

        this.camera_tile_outer_bound = 2;

        this.camera_outer_left = this.camera_x - (this.camera_tile_outer_bound * this.tile_size);
        this.camera_outer_right = this.camera_x + game_info['def_width'] + (this.camera_tile_outer_bound * this.tile_size);
        this.camera_outer_top = this.camera_y - (this.camera_tile_outer_bound * this.tile_size);
        this.camera_outer_bottom = this.camera_y + game_info['def_height'] + (this.camera_tile_outer_bound * this.tile_size);

        var x_dist = -1 * (this.camera_x - old_camera_x);
        var y_dist = -1 * (this.camera_y - old_camera_y);

        if(x_dist < this.camera_speed * -1)
        {
            x_dist = this.camera_speed * -1;
        }
        else if(x_dist > this.camera_speed)
        {
            x_dist = this.camera_speed;
        }

        if(y_dist < this.camera_speed * -1)
        {
            y_dist = this.camera_speed * -1;
        }
        else if(y_dist > this.camera_speed)
        {
            y_dist = this.camera_speed;
        }

        this.camera_x = old_camera_x - x_dist;
        this.camera_y = old_camera_y - y_dist;

        game_canvas.translate(x_dist, y_dist);

    }

    hud_draw(data, canvas_context)
    {
        var string = data.name + ': ';

        if(game_info[data.index] != null)
        {
            string += game_info[data.index].toString();
        }

        canvas_context.fillText(data.name + ':', data.x, data.y);

    }

    level_clear()
    {

        var obj_keys = Object.keys(this.objects);

        for(var i = 0; i < obj_keys.length; i++)
        {
            if(this.objects[obj_keys[i]].name_get() != 'obj_grid_draw')
            {
                delete this.objects[obj_keys[i]];
            }
        }

        for(var x = this.curr_segment_x - 1; x <= this.curr_segment_x + 1; x++)
        {

            if(this.segments[x] == null)
            {
                continue;
            }

            for(var y = this.curr_segment_y - 1; y <= this.curr_segment_y + 1; y++)
            {

                if(this.segments[x][y] == null)
                {
                    continue;
                }

                for(var i = 0; i < this.segments[x][y]['objects'].length; i++)
                {
                    if(this.segments[x][y]['objects'][i].name_get() != 'obj_grid_draw')
                    {
                        delete this.segments[x][y]['objects'][i];
                        this.segments[x][y]['objects'].splice(i, 1);
                        i--;
                    }
                }

            }

        }

    }

    object_add(obj)
    {
        this.objects[Date.now()] = obj;
    }

    object_get(name)
    {

        var object_keys = Object.keys(this.objects);

        for(var i = 0; i < object_keys.length; i++)
        {
            this.objects[object_keys[i]].move();

            if(this.objects[object_keys[i]].name_get() == name)
            {
                return this.objects[object_keys[i]];
            }
        }

    }

    objects_get()
    {
        return this.objects;
    }

    queue(obj, id)
    {

        //build out a two-dimensional array representing the level

        var x_seg = Math.floor(obj['x'] / this.segment_width);
        var y_seg = Math.floor(obj['y'] / this.segment_height);

        if(this.segments[x_seg] == null)
        {
            this.segments[x_seg] = [];
        }

        if(this.segments[x_seg][y_seg] == null)
        {
            this.segments[x_seg][y_seg] = {
                'loaded':  false,
                'objects': [],
            };
        }

        this.segments[x_seg][y_seg]['objects'].push(new Level_Object(obj, id));

        //start in the segment where the player spawns
        if(obj['name'] == 'Player')
        {
            this.curr_segment_x = x_seg;
            this.curr_segment_y = y_seg;
        }

    }

    step()
    {

        for(var x = this.curr_segment_x - 1; x <= this.curr_segment_x + 1; x++)
        {

            if(this.segments[x] == null)
            {
                continue;
            }

            for(var y = this.curr_segment_y - 1; y <= this.curr_segment_y + 1; y++)
            {

                if(this.segments[x][y] == null)
                {
                    continue;
                }

                for(var i = 0; i < this.segments[x][y]['objects'].length; i++)
                {

                    if(this.objects[this.segments[x][y]['objects'][i].id_get()] == null)
                    {

                        var new_obj = this.segments[x][y]['objects'][i].load(this.camera_outer_left, this.camera_outer_right, this.camera_outer_top, this.camera_outer_bottom);
                        if(new_obj != false)
                        {

                            this.objects[this.segments[x][y]['objects'][i].id_get()] = new_obj;
                            if(this.segments[x][y]['objects'][i].name_get() == 'Player')
                            {
                                this.player = new_obj;
                            }
                        }
                    }
                }

            }

        }

        var object_keys = Object.keys(this.objects);

        //move everything
        for(var i = 0; i < object_keys.length; i++)
        {
            this.objects[object_keys[i]].move();
        }

        //check for collisions
        for(var i = 0; i < object_keys.length; i++)
        {
            this.objects[object_keys[i]].collide(object_keys, this.objects);
        }

        //draw everything
        for(var i = 0; i < object_keys.length; i++)
        {
            this.objects[object_keys[i]].draw(this.canvas_context);
        }

        for(var i = 0; i < this.hud.length; i++)
        {
            this.hud_draw(this.hud[i], this.canvas_context);
        }

        this.camera_find();

    }

}
