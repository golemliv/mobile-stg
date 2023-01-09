class Button
{

    constructor(x_ratio, y_ratio, radius_ratio, canvas, extra)
    {
        this.name = name;
        this.pressed = false;
        this.canvas = canvas;
        this.extra = extra;

        this.x = parseFloat(this.canvas.dom_obj_get().getAttribute('width')) * x_ratio;
        this.y = parseFloat(this.canvas.dom_obj_get().getAttribute('height')) * y_ratio;
        this.radius = parseFloat(this.canvas.dom_obj_get().getAttribute('width')) * radius_ratio;

        this.button_fill = 'rgba(255, 255, 255, 1)';
        this.font_fill = 'rgba(0, 0, 0, 1)';
        this.font_size = 20 * game_info['inner_ratio'];
        this.font_style = this.font_size.toString() + 'px Arial';

        this.label = '';
    }

    click_check(touches)
    {
        for(var i = 0; i < touches.length; i++)
        {
            if(touches[i]['touch_x'] > this.x - this.radius && touches[i]['touch_x'] < this.x + this.radius && touches[i]['touch_y'] > this.y - this.radius && touches[i]['touch_y'] < this.y + this.radius)
            {
//                this.pressed = true;
                if(!this.pressed)
                {
                    this.press();
                }
                return;
            }
        }
        this.pressed = false;
    }

    draw()
    {
        this.canvas.context_get().fillStyle = this.button_fill;
        this.canvas.context_get().beginPath();
        this.canvas.context_get().arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.canvas.context_get().fill();
        this.canvas.context_get().stroke();

        this.canvas.context_get().font = this.font_style;
        this.canvas.context_get().fillStyle = this.font_fill;
        var text = this.canvas.context_get().measureText(this.label);
        this.canvas.context_get().fillText(this.label, this.x - (text.width / 2), this.y + (this.font_size / 2));
    }

    is_pressed()
    {
        return this.pressed;
    }

    name_get()
    {
        return this.name;
    }

    press()
    {
        this.pressed = true;
    }

    unpress()
    {
        this.pressed = false;
    }

}

constructors['Button'] = Button;
