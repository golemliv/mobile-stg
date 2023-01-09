class Obj_List extends Button
{

    constructor(x_ratio, y_ratio, radius_ratio, canvas, extra)
    {
        super(x_ratio, y_ratio, radius_ratio, canvas);
        this.name = 'obj_list';

        this.obj_list = [
            {
                'display':     'Player',
                'constructor': 'Player',
                'extra':       null,
            },
            {
                'display':     'Block',
                'constructor': 'Block',
                'extra':       null,
            },
            {
                'display':     'Slope slight right bottom',
                'constructor': 'Slope',
                'extra':       {'dir': 'slight right bottom'},
            },
            {
                'display':     'Slope right bottom',
                'constructor': 'Slope',
                'extra':       {'dir': 'right bottom'},
            },
            {
                'display':     'Slope steep right bottom',
                'constructor': 'Slope',
                'extra':       {'dir': 'steep right bottom'},
            },
            {
                'display':     'Slope steep right top',
                'constructor': 'Slope',
                'extra':       {'dir': 'steep right top'},
            },
            {
                'display':     'Slope right top',
                'constructor': 'Slope',
                'extra':       {'dir': 'right top'},
            },
            {
                'display':     'Slope slight right top',
                'constructor': 'Slope',
                'extra':       {'dir': 'slight right top'},
            },
            {
                'display':     'Slope slight left bottom',
                'constructor': 'Slope',
                'extra':       {'dir': 'slight left bottom'},
            },
            {
                'display':     'Slope left bottom',
                'constructor': 'Slope',
                'extra':       {'dir': 'left bottom'},
            },
            {
                'display':     'Slope steep left bottom',
                'constructor': 'Slope',
                'extra':       {'dir': 'steep left bottom'},
            },
            {
                'display':     'Slope slight left top',
                'constructor': 'Slope',
                'extra':       {'dir': 'slight left top'},
            },
            {
                'display':     'Slope left top',
                'constructor': 'Slope',
                'extra':       {'dir': 'left top'},
            },
            {
                'display':     'Slope steep left top',
                'constructor': 'Slope',
                'extra':       {'dir': 'steep left top'},
            },
        ];

        this.y = 0;
        this.x = 0;
        this.width = game_info['inner_offset'];
        this.height = game_info['height'];

        this.button_width = this.width;
        this.button_height = game_info['inner_ratio'] * 40;
        this.button_margin = game_info['inner_ratio'] * 4;
        this.obj_index = 0;
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
                    else if(this.y_offset < (this.height - ((this.button_height + this.button_margin) * this.obj_list.length)))
                    {
                        this.y_offset = (this.height - ((this.button_height + this.button_margin) * this.obj_list.length));
                    }

                }

                this.obj_index = Math.floor((touches[i]['touch_y'] - this.y_offset) / (this.button_height + this.button_margin));

                if(!this.pressed)
                {
                    this.press();
                }
                return;
            }
        }

        this.pressed = false;
    }

    curr_obj_get()
    {
        return this.obj_list[this.obj_index];
    }

    draw()
    {

        for(var i = 0; i < this.obj_list.length; i++)
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

/*
        this.canvas.context_get().font = this.font_style;
        this.canvas.context_get().fillStyle = this.font_fill;
        var text = this.canvas.context_get().measureText(this.label);
        this.canvas.context_get().fillText(this.label, this.x - (text.width / 2), this.y + (this.font_size / 2));
*/
    }

    press()
    {
        super.press();
    }

}

constructors['Obj_List'] = Obj_List;
