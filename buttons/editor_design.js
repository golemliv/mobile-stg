class Editor_Design extends List_Button
{

    constructor(x_ratio, y_ratio, radius_ratio, canvas, extra)
    {
        super(x_ratio, y_ratio, radius_ratio, canvas);
        this.name = 'Editor_Design';
        this.label = 'Design';

        this.options = [
            {
                'display': 'Objects',
                'extra':   null,
            },
            {
                'display': 'Paths',
                'extra':   null,
            },
        ];

        this.width = game_info['inner_width'] / 2;
        this.height = game_info['inner_height'] * (1 / 4);

        this.x = game_info['inner_offset'] + this.width;
        this.y = game_info['inner_height'] * (3 / 4);

        this.list_x = game_info['inner_offset'];
        this.list_y = 0;
        this.list_height = this.y;

        this.list_y_offset = 0;
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
            case 'Objects':
                this.canvas.mouse_up(null);

button_canvas.button_add(new constructors['Modal_Obj_List'](0, 0, 0, button_canvas, null));

                break;

            case 'Paths':
console.log('paths');
                break;

        }

        this.option_index = -1;

        this.pressed = false;

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

constructors['Editor_Design'] = Editor_Design;
