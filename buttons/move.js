class Move_Slider extends Button
{

    constructor(x_ratio, y_ratio, radius_ratio, canvas, extra)
    {
        super(x_ratio, y_ratio, radius_ratio, canvas);
        this.button_fill = 'rgba(100, 100, 100, 1)';
        this.knob_fill = 'rgba(150, 150, 150, 1)';
        this.stroke_style = 'rgba(0, 0, 0, 1)';
        this.label = 'MOVE';
        this.name = 'move_slider';

        //put this at the bottom of the screen
        this.draw_x = game_info['inner_offset'];
        this.y = game_info['inner_width'] * 4 / 3;
        this.draw_width = game_info['inner_width'];
        this.height = game_info['inner_height'] - this.y;

        //check for touches along the full span of the bottom of the screen
        this.x = 0;
        this.width = game_info['width'];

        //make the knob as wide as the player ship
        this.knob_width = (game_info['tile_size'] * game_info['inner_ratio']) / 2;

        //start the knob in the middle
        this.knob_offset = (this.draw_width / 2) - (this.knob_width / 2);

    }

    click_check(touches)
    {
        for(var i = 0; i < touches.length; i++)
        {
            if(touches[i]['touch_x'] >= this.x && touches[i]['touch_x'] <= this.x + this.width && touches[i]['touch_y'] >= this.y && touches[i]['touch_y'] <= this.y + this.width)
            {
                //move to the player's touch
                this.knob_offset = touches[i]['touch_x'] - this.draw_x - (this.knob_width / 2);

                //don't move past the left edge of the slider
                this.knob_offset = Math.max(this.knob_offset, 0);

                //don't move past the right edge of the slider
                this.knob_offset = Math.min(this.knob_offset, this.draw_width - this.knob_width);

                return;
            }
        }

    }

    draw()
    {

        //the entire slider bar
        this.canvas.context_get().strokeStyle = this.stroke_style;
        this.canvas.context_get().fillStyle = this.button_fill;
        this.canvas.context_get().beginPath();
        this.canvas.context_get().rect(this.draw_x, this.y, this.draw_width, this.height);
        this.canvas.context_get().fill();
        this.canvas.context_get().stroke();

        //the slider knob
        this.canvas.context_get().strokeStyle = this.stroke_style;
        this.canvas.context_get().fillStyle = this.knob_fill;
        this.canvas.context_get().beginPath();
        this.canvas.context_get().rect(this.draw_x + this.knob_offset, this.y, this.knob_width, this.height);
        this.canvas.context_get().fill();
        this.canvas.context_get().stroke();

    }

    knob_offset_get()
    {
        return this.knob_offset;
    }

}

constructors['Move'] = Move_Slider;
