class Editor_Save extends List_Button
{

    constructor(x_ratio, y_ratio, radius_ratio, canvas, extra)
    {
        super(x_ratio, y_ratio, radius_ratio, canvas);
        this.name = 'file';
        this.label = 'File';

        this.options = [
            {
                'display': 'Save',
            },
            {
                'display': 'Play',
            },
            {
                'display': 'Load',
            },
        ];

        this.width = game_info['inner_width'] / 2;
        this.height = (game_info['width'] * (1 / 4)) - ((game_info['tile_size'] / 2) * game_info['inner_ratio']);

        this.x = game_info['inner_offset'];
        this.y = game_info['inner_width'] * (4 / 3);

        this.list_x = game_info['inner_offset'];
        this.list_y = 0;
        this.list_width = game_info['inner_width'];
        this.list_height = this.y;

        this.button_width = this.width;
        this.button_height = game_info['inner_ratio'] * 40;
        this.button_margin = game_info['inner_ratio'] * 4;
        this.normal_style = 'rgba(255, 255, 255, 1)';
        this.highlight_style = 'rgba(255, 255, 100, 1)';
        this.font_fill = 'rgba(0, 0, 0, 1)';
        this.font_size = game_info['inner_ratio'] * 10;
        this.font_style = this.font_size.toString() + 'px Arial';

        this.y_offset = 0;
    }

    click_check(touches)
    {

        super.click_check(touches);

        if(this.option_index == -1)
        {
            return;
        }

        switch(this.options[this.option_index]['display'])
        {
            case 'Save':
                this.canvas.mouse_up(null);
                if(game_canvas.level_get().object_get('obj_grid_draw') == null)
                {
                    return;
                }
                game_canvas.level_get().object_get('obj_grid_draw').save();
                break;

            case 'Load':
                this.canvas.mouse_up(null);
                file_upload(this.file_load.bind(this));
                break;

            case 'Play':
                this.canvas.mouse_up(null);
                this.options[this.option_index]['display'] = 'Stop';
                game_canvas.level_get().object_get('obj_grid_draw').play();
                break;

            case 'Stop':
                this.canvas.mouse_up(null);
                this.options[this.option_index]['display'] = 'Play';
                game_canvas.level_get().object_get('obj_grid_draw').stop();
                break;

        }

        this.option_index = -1;

        this.pressed = false;

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

}

constructors['Editor_Save'] = Editor_Save;
