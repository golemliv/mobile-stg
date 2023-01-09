class Editor_Save extends Button
{

    constructor(x_ratio, y_ratio, radius_ratio, canvas, extra)
    {
        super(x_ratio, y_ratio, radius_ratio, canvas);
        this.name = 'obj_list';

        this.options = [
            'Save',
            'Load',
            'Play',
        ];

        this.x = game_info['inner_offset'] + game_info['inner_width'];
        this.y = 0;
        this.width = game_info['inner_offset'];
        this.height = game_info['height'];

        this.button_width = this.width;
        this.button_height = game_info['inner_ratio'] * 40;
        this.button_margin = game_info['inner_ratio'] * 4;
        this.option_index = 0;
        this.normal_style = 'rgba(255, 255, 255, 1)';
        this.highlight_style = 'rgba(255, 255, 100, 1)';
        this.font_fill = 'rgba(0, 0, 0, 1)';
        this.font_size = game_info['inner_ratio'] * 10;
        this.font_style = this.font_size.toString() + 'px Arial';

        this.y_offset = 0;
    }

    click_check(touches)
    {

        for(var i = 0; i < touches.length; i++)
        {
            //make sure this touch is touching the bar
            if(touches[i]['touch_x'] > this.x && touches[i]['touch_x'] < this.x + this.width && touches[i]['touch_y'] > this.y && touches[i]['touch_y'] < this.y + this.height)
            {

/*
                //if you're already pressed, scroll based on the user's movement
                if(this.pressed)
                {

                    //get the distance dragged
                    this.y_offset -= button_canvas.drag_get_y(touches[i]);

                    //limit the drag within the bounds of the object list
                    if(this.y_offset > 0)
                    {
                        this.y_offset = 0;
                    }
                    else if(this.y_offset < (this.height - ((this.button_height + this.button_margin) * this.options.length)))
                    {
                        this.y_offset = (this.height - ((this.button_height + this.button_margin) * this.options.length));
                    }

                }
*/

                this.option_index = Math.floor((touches[i]['touch_y'] - this.y_offset) / (this.button_height + this.button_margin));

                if(!this.pressed)
                {
                    this.press();
                }
                return;
            }
        }

        this.pressed = false;
    }

    draw()
    {

        for(var i = 0; i < this.options.length; i++)
        {

            var starting_y = this.y_offset + this.y + (i * (this.button_height + this.button_margin));

            this.canvas.context_get().beginPath();
            this.canvas.context_get().rect(this.x, starting_y, this.button_width, this.button_height);
            if(this.obj_index == i)
            {
                this.canvas.context_get().fillStyle = this.highlight_style;
            }
            else
            {
                this.canvas.context_get().fillStyle = this.normal_style;
            }
            this.canvas.context_get().fill();
            this.canvas.context_get().stroke();

            this.canvas.context_get().fillStyle = this.font_fill;
            this.canvas.context_get().font = this.font_style;

            var name_arr = this.options[i].split(' ');
            var curr_row = '';
            var row_num = 0;
            for(var j = 0; j < name_arr.length; j++)
            {
                var pixel_length = this.canvas.context_get().measureText(curr_row + name_arr[j] + ' ');
                if(pixel_length < this.button_width)
                {
                    curr_row += name_arr[j] + ' ';
                }
                else
                {
                    this.canvas.context_get().fillText(curr_row, this.x, starting_y + (row_num * this.font_size));
                    row_num++;
                    curr_row = name_arr[j];
                }
            }
            if(curr_row.length > 0)
            {
                this.canvas.context_get().fillText(curr_row, this.x, starting_y + (row_num * this.font_size));
            }

        }

/*
        this.canvas.context_get().font = this.font_style;
        this.canvas.context_get().fillStyle = this.font_fill;
        var text = this.canvas.context_get().measureText(this.label);
        this.canvas.context_get().fillText(this.label, this.x - (text.width / 2), this.y + (this.font_size / 2));
*/
    }

    file_load(contents)
    {

        var new_level = JSON.parse(contents);

        if(new_level == null || new_level['objects'] == null)
        {
            return;
        }

        var objects = game_canvas.level_get().object_get('obj_grid_draw').objects_get();
        objects.splice(0, objects.length);

        for(var i = 0; i < new_level['objects'].length; i++)
        {

            var settings = new_level['objects'][i];

            var new_obj = new constructors[settings['name']](settings['x'], settings['y'], settings['extra']);

            game_canvas.level_get().object_get('obj_grid_draw').object_add(new_obj);

        }

    }

    press()
    {

        switch(this.options[this.option_index])
        {
            case 'Save':
                this.canvas.mouse_up(null);
                game_canvas.level_get().object_get('obj_grid_draw').save();
                break;

            case 'Load':
                this.canvas.mouse_up(null);
                file_upload(this.file_load.bind(this));
                break;

            case 'Play':
                this.canvas.mouse_up(null);
                this.options[this.options.indexOf('Play')] = 'Stop';
                game_canvas.level_get().object_get('obj_grid_draw').play();
                break;

            case 'Stop':
                this.canvas.mouse_up(null);
                this.options[this.options.indexOf('Stop')] = 'Play';
                game_canvas.level_get().object_get('obj_grid_draw').stop();
                break;

        }

        super.press();
    }

}

constructors['Editor_Save'] = Editor_Save;
