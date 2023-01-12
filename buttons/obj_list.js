class Obj_List extends List_Button
{

    constructor(x_ratio, y_ratio, radius_ratio, canvas, extra)
    {
        super(x_ratio, y_ratio, radius_ratio, canvas);
        this.name = 'obj_list';
        this.label = 'Objects';

        this.options = [
            {
                'display':     'Block',
                'constructor': 'Block',
                'extra':       null,
            },
            {
                'display':     'Block2',
                'constructor': 'Block',
                'extra':       null,
            },
            {
                'display':     'Block3',
                'constructor': 'Block',
                'extra':       null,
            },
            {
                'display':     'Block4',
                'constructor': 'Block',
                'extra':       null,
            },
            {
                'display':     'Block5',
                'constructor': 'Block',
                'extra':       null,
            },
        ];

        this.width = game_info['inner_width'] / 2;
        this.height = (game_info['width'] * (1 / 4)) - ((game_info['tile_size'] / 2) * game_info['inner_ratio']);

        this.x = game_info['inner_offset'] + this.width;
        this.y = game_info['inner_width'] * (4 / 3);

        this.list_x = game_info['inner_offset'];
        this.list_y = 0;
        this.list_width = game_info['inner_width'];
        this.list_height = this.y;

        this.button_width = this.list_width;
        this.button_height = game_info['inner_ratio'] * 40;
        this.button_margin = game_info['inner_ratio'] * 4;

        this.normal_style = 'rgba(255, 255, 255, 1)';
        this.highlight_style = 'rgba(255, 255, 100, 1)';
        this.font_fill = 'rgba(0, 0, 0, 1)';
        this.font_size = game_info['inner_ratio'] * 10;
        this.font_style = this.font_size.toString() + 'px Arial';

        this.list_y_offset = 0;
    }

    click_check(touches)
    {

        if(button_canvas.button_get('obj_grid').playing_get())
        {
            return;
        }

        super.click_check(touches);

    }

    curr_obj_get()
    {
        return this.options[this.option_index];
    }

    press()
    {
        super.press();
    }

}

constructors['Obj_List'] = Obj_List;
