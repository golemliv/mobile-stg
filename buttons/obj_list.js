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

    curr_obj_get()
    {
        return this.options[this.option_index];
    }

/*
    draw()
    {

        //the list of objects

        if(this.pressed)
        {

            for(var i = 0; i < this.obj_list.length; i++)
            {

                var starting_y = this.list_y_offset + this.list_y + (i * (this.button_height + this.button_margin));

                //don't print stuff outside of the list area
                if(starting_y > this.list_y + this.list_height)
                {
                    break;
                }

                this.canvas.context_get().beginPath();
                this.canvas.context_get().rect(this.list_x, starting_y, this.button_width, this.button_height);
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

                var name_arr = this.obj_list[i]['display'].split(' ');
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

        }

        //the objects button itself

        this.canvas.context_get().beginPath();
        this.canvas.context_get().rect(this.x, this.y, this.width, this.height);

        if(this.pressed)
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

        var text = this.canvas.context_get().measureText('Objects');

        this.canvas.context_get().fillText('Objects', this.x - (text.width / 2) + (this.width / 2), this.y + (this.height / 2) - (this.font_size / 2));

    }
*/

    press()
    {
        super.press();
    }

}

constructors['Obj_List'] = Obj_List;
