class List
{

    constructor(x, y, items, callback, canvas)
    {
        this.x = x;
        this.y = y;
        this.items = items;
        this.callback = callback;
        this.canvas = canvas;
        this.index = null;
        this.button_height = 100;
        this.button_width = 100;
        this.button_margin = 10;
        this.total_height = (this.button_height + this.button_margin) * this.items.length;
        this.max_height = 200;
        this.y_offset = 0;
        this.normal_style = 'rgba(255, 255, 255, 1)';
        this.highlight_style = 'rgba(255, 255, 100, 1)';
        this.font_fill = 'rgba(0, 0, 0, 1)';
        this.font_size = game_info['inner_ratio'] * 10;
        this.font_style = this.font_size.toString() + 'px Arial';
    }

    click_check(touches)
    {

        for(var i = 0; i < touches.length; i++)
        {

            //make sure this touch is touching the bar
            if(touches[i]['touch_x'] > this.x && touches[i]['touch_x'] < this.x + this.button_width && touches[i]['touch_y'] > this.y && touches[i]['touch_y'] < this.y + this.max_height)
            {

                //if you're already pressed, scroll based on the user's movement
                if(this.pressed)
                {

                    //get the distance dragged
                    this.y_offset -= button_canvas.drag_get_y(touches[i]);

                    //limit the drag within the bounds of the list
                    if(this.y_offset > 0)
                    {
                        this.y_offset = 0;
                    }
                    else if(this.y_offset < (this.total_height - ((this.button_height + this.button_margin) * this.items.length)))
                    {
                        this.y_offset = (this.total_height - ((this.button_height + this.button_margin) * this.items.length));
                    }

                }

                this.index = Math.floor((touches[i]['touch_y'] - this.y_offset - this.y) / (this.button_height + this.button_margin));

                if(!this.pressed)
                {
                    this.press();
                }
                return;
            }
            else if(touches[i]['event'] == 'press')
            {
                this.callback(null);
            }

        }

        this.pressed = false;
    }

    curr_obj_get()
    {
        return this.items[this.index];
    }

    draw()
    {

        for(var i = 0; i < this.items.length; i++)
        {

            var starting_y = this.y_offset + this.y + (i * (this.button_height + this.button_margin));

            this.canvas.context_get().beginPath();
            this.canvas.context_get().rect(this.x, starting_y, this.button_width, this.button_height);
            if(this.index == i)
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

            var name_arr = this.items[i].split(' ');
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

    press()
    {
        this.callback(this.items[this.index]);
    }

}

constructors['List'] = List;
