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
        this.height = game_info['inner_height'] * (1 / 4);

        this.x = game_info['inner_offset'];
        this.y = game_info['inner_height'] * (3 / 4);

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

        this.init_y_offset = 0;

        this.y_offset = 0;
    }

    click_check(touches)
    {

        if(button_canvas.button_get('obj_grid').playing_get())
        {
            return;
        }

        super.click_check(touches);

        if(this.option_index == -1)
        {
            return;
        }

        switch(this.options[this.option_index]['display'])
        {
            case 'Save':
                this.canvas.mouse_up(null);
                if(game_canvas.level_get().object_get('Obj_Grid_Draw') == null)
                {
                    return;
                }
                game_canvas.level_get().object_get('Obj_Grid_Draw').save();
                break;

            case 'Load':
                this.canvas.mouse_up(null);
                file_upload(this.file_load.bind(this));
                break;

            case 'Play':
                this.canvas.mouse_up(null);
//                this.options[this.option_index]['display'] = 'Stop';
                this.init_y_offset = game_canvas.level_get().camera_get('y');
                game_canvas.level_get().object_get('Obj_Grid_Draw').play();
                break;

            case 'Stop':
                this.canvas.mouse_up(null);
                this.options[this.option_index]['display'] = 'Play';
                game_canvas.level_get().object_get('Obj_Grid_Draw').stop();
                break;

        }

        this.option_index = -1;

        this.pressed = false;

    }

    draw()
    {

        //don't show this button if you're doing a test play
        if(button_canvas.button_get('obj_grid').playing_get())
        {
            return;
        }

        super.draw();

    }

    file_load(contents)
    {

        var new_level = JSON.parse(contents);

        if(new_level == null || new_level['objects'] == null)
        {
            return;
        }

        game_canvas.level_get().level_clear();

        console.log('before', JSON.parse(JSON.stringify(game_canvas.level_get().objects_get())), game_canvas.level_get().camera_get('y'));

        var offset = game_canvas.level_get().camera_get('y');

        for(var i = 0; i < new_level['objects'].length; i++)
        {

            var settings = new_level['objects'][i];

            var new_obj = new constructors[settings['name']](settings['x'], settings['y'], settings['extra']);

            game_canvas.level_get().object_get('Obj_Grid_Draw').object_add(new_obj);

        }

        console.log('after', JSON.parse(JSON.stringify(game_canvas.level_get().objects_get())), game_canvas.level_get().camera_get('y'));

        //move the game canvas back into place, where it was before the player clicked "play"
        game_canvas.translate(0, offset - this.init_y_offset);

    }

}

constructors['Editor_Save'] = Editor_Save;
