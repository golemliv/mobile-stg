class List_Button extends Button
{

    constructor(x_ratio, y_ratio, radius_ratio, canvas, extra)
    {
        super(x_ratio, y_ratio, radius_ratio, canvas);
        this.name = 'list';
        this.label = this.name;

        this.options = new Array();

        this.width = game_info['inner_width'] / 2;
        this.height = game_info['inner_height'] * (1 / 4);

        this.x = game_info['inner_offset'] + this.width;
        this.y = game_info['inner_height'] * (3 / 4);

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

        this.option_index = -1;

        this.list_y_offset = 0;
    }

    click_check(touches)
    {

        for(var i = 0; i < touches.length; i++)
        {

            //if the user clicks the button itself, open/close the menu and do nothing else

            if(touches[i]['event'] == 'press' && touches[i]['touch_x'] > this.x && touches[i]['touch_x'] < this.x + this.width && touches[i]['touch_y'] > this.y && touches[i]['touch_y'] < this.y + this.height)
            {

                //initial click
                if(!this.pressed)
                {
                    this.pressed = true;
                    this.option_index = -1;
                }
                else
                {
                    this.pressed = false;
                }

                return;

            }

            //otherwise, check if the user is interacting with the list

            //make sure this touch is touching the bar
            if(this.pressed && touches[i]['touch_x'] > this.list_x && touches[i]['touch_x'] < this.list_x + this.list_width && touches[i]['touch_y'] > this.list_y && touches[i]['touch_y'] < this.list_y + this.list_height)
            {

                //get the distance dragged
                var dist = button_canvas.drag_get_y(touches[i]);
                this.list_y_offset -= dist;

                //limit the drag within the bounds of the object list
                if(this.list_y_offset > 0)
                {
                    this.list_y_offset = 0;
                }
                else if(this.list_y_offset < (this.list_height - ((this.button_height + this.button_margin) * this.options.length)))
                {
                    this.list_y_offset = (this.list_height - ((this.button_height + this.button_margin) * this.options.length));
                }

                this.option_index = Math.floor((touches[i]['touch_y'] - this.list_y_offset) / (this.button_height + this.button_margin));

                if(this.option_index > this.options.length - 1)
                {
                    this.option_index = this.options.length - 1;
                }
                else if(this.option_index < 0)
                {
                    this.option_index = 0;
                }

            }

        }

    }

    curr_obj_get()
    {
        return this.options[this.option_index];
    }

    draw()
    {

        //the list of objects

        if(this.pressed)
        {

            for(var i = 0; i < this.options.length; i++)
            {

                var starting_y = this.list_y_offset + this.list_y + (i * (this.button_height + this.button_margin));

                //don't print stuff outside of the list area
                if(starting_y > this.list_y + this.list_height)
                {
                    break;
                }

                this.canvas.context_get().beginPath();
                this.canvas.context_get().rect(this.list_x, starting_y, this.button_width, this.button_height);
                if(this.option_index == i)
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

                var name_arr = this.options[i]['display'].split(' ');
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

        var text = this.canvas.context_get().measureText(this.label);

        //text is anchored by its bottom, NOT by its top
        this.canvas.context_get().fillText(this.label, this.x - (text.width / 2) + (this.width / 2), this.y + (this.height / 2) + (this.font_size / 2));

    }

    press()
    {
        super.press();
    }

}

constructors['List_Button'] = List_Button;
