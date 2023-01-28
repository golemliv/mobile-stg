class List extends Button
{

    constructor(x_ratio, y_ratio, radius_ratio, canvas, extra)
    {

        super(x_ratio, y_ratio, radius_ratio, canvas);
        this.name = 'list';
        this.label = this.name;

        this.options = new Array();

        this.x = game_info['inner_offset'];
        this.y = 0;
        this.width = game_info['inner_width'];
        this.height = this.y;

        this.fill_style = 'rgba(255, 255, 255, 1)';
        this.stroke_style = 'rgba(120, 120, 120, 1)';
        this.line_width = 1 * game_info['inner_ratio'];

        this.normal_style = 'rgba(255, 255, 255, 1)';
        this.highlight_style = 'rgba(255, 255, 100, 1)';
        this.font_fill = 'rgba(0, 0, 0, 1)';
        this.font_size = game_info['inner_ratio'] * 10;
        this.font_style = this.font_size.toString() + 'px ' + game_info['font_face'];

        this.button_height = game_info['tile_size'] + this.font_size + (this.line_width * 2);
        this.button_margin = game_info['inner_ratio'] * 4;

        this.option_index = -1;

        this.list_y_offset = 0;

        this.scratch_canvas = document.createElement('canvas');
        this.scratch_context = this.scratch_canvas.getContext('2d');

        //make sure to redo this every time you change x, y, width, or height
        this.scratch_canvas.setAttribute('width', this.width + this.x);
        this.scratch_canvas.setAttribute('height', this.height + this.y);

    }

    click_check(touches)
    {

        for(var i = 0; i < touches.length; i++)
        {

            //make sure this touch is touching the bar
            if(touches[i]['touch_x'] > this.x && touches[i]['touch_x'] < this.x + this.width && touches[i]['touch_y'] > this.y && touches[i]['touch_y'] < this.y + this.height)
            {

                //get the distance dragged
                var dist = button_canvas.drag_get_y(touches[i]);
                this.list_y_offset -= dist;

                //limit the drag within the bounds of the object list
                if(this.list_y_offset > 0)
                {
                    this.list_y_offset = 0;
                }
                else if(this.list_y_offset < (this.height - ((this.button_height + this.button_margin) * this.options.length)) + this.button_margin)
                {
                    this.list_y_offset = (this.height - ((this.button_height + this.button_margin) * this.options.length) + this.button_margin);
                }

                this.option_index = Math.floor((touches[i]['touch_y'] - this.list_y_offset - this.y) / (this.button_height + this.button_margin));

                if(this.option_index > this.options.length - 1)
                {
                    this.option_index = this.options.length - 1;
                }
                else if(this.option_index < 0)
                {
                    this.option_index = 0;
                }

                return true;

            }

        }

        return false;

    }

    curr_obj_get()
    {
        return this.options[this.option_index];
    }

    draw()
    {

        this.scratch_context.lineWidth = this.line_width;
        this.scratch_context.fillStyle = this.fill_style;
        this.scratch_context.strokeStyle = this.stroke_style;

        //draw the background

        this.scratch_context.beginPath();
        this.scratch_context.rect(this.x + (this.line_width / 2), this.y + this.line_width, this.width - (this.line_width / 2), this.height - (this.line_width * 2));
        this.scratch_context.fill();

        //the list of objects

        for(var i = 0; i < this.options.length; i++)
        {

            var starting_y = this.list_y_offset + this.y + (i * (this.button_height + this.button_margin));

            //don't print stuff outside of the list area
            if(starting_y > this.y + this.height)
            {
                //break;
            }

            this.scratch_context.beginPath();
            this.scratch_context.rect(this.x, starting_y, this.width, this.button_height);
            if(this.option_index == i)
            {
                this.scratch_context.fillStyle = this.highlight_style;
            }
            else
            {
                this.scratch_context.fillStyle = this.normal_style;
            }
            this.scratch_context.fill();
            this.scratch_context.stroke();

            this.scratch_context.fillStyle = this.font_fill;
            this.scratch_context.font = this.font_style;

            var name_arr = this.options[i]['display'].split(' ');
            var curr_row = '';
            var row_num = 0;
            for(var j = 0; j < name_arr.length; j++)
            {
                var pixel_length = this.scratch_context.measureText(curr_row + name_arr[j] + ' ').width;
                if(pixel_length < this.button_width)
                {
                    curr_row += name_arr[j] + ' ';
                }
                else
                {
                    var text_width = this.scratch_context.measureText(curr_row).width;
                    this.scratch_context.fillText(curr_row, this.x + (this.width * 0.5) - (text_width * 0.5), starting_y + (row_num * this.font_size));
                    row_num++;
                    curr_row = name_arr[j];
                }
            }
            if(curr_row.length > 0)
            {
                var text_width = this.scratch_context.measureText(curr_row).width;
                this.scratch_context.fillText(curr_row, this.x + (this.width * 0.5) - (text_width * 0.5), starting_y + (row_num * this.font_size) + (game_info['tile_size'] * 0.5));
            }

        }

        //draw a knob representing how far the user has scrolled

        var knob_size = (game_info['tile_size'] * 0.25 * game_info['inner_ratio']);

        var total_height = (-1 * (this.height - ((this.button_height + this.button_margin) * this.options.length))) - this.button_margin + knob_size;

        var knob_pos = -1 * this.list_y_offset / total_height;

        this.scratch_context.beginPath();

        this.scratch_context.rect(this.x + this.width - knob_size, this.y + (this.height * knob_pos), knob_size, knob_size);

        this.scratch_context.fillStyle = this.fill_style;
        this.scratch_context.strokeStyle = this.stroke_style;
        this.scratch_context.stroke();
        this.scratch_context.fill();

        //draw the outline

        this.scratch_context.beginPath();
        this.scratch_context.rect(this.x, this.y, this.width - (this.line_width / 2), this.height - (this.line_width * 0.5));
        this.scratch_context.stroke();

        //move this image from the scratch canvas to the real button canvas
        //i couldn't get clip() and restore() to work, and i couldn't get drawImage() to work
        var imgData = this.scratch_context.getImageData(this.x, this.y, this.width, this.height);
        this.canvas.context_get().putImageData(imgData, this.x, this.y);

    }

    press()
    {
        super.press();
    }

}

constructors['List'] = List;
