class Stop_Button extends Button
{

    constructor(x_ratio, y_ratio, radius_ratio, canvas)
    {
        super(x_ratio, y_ratio, radius_ratio, canvas);
        this.button_fill = 'rgba(200, 200, 200, 0.5)';
        this.stroke_style = 'rgba(0, 0, 0, 0.5)';
        this.font_style = 'rgba(0, 0, 0, 0.5)';
        this.name = 'Stop_Button';
        this.label = 'Stop';

        this.radius = game_info['inner_width'] / 10;

        this.x = game_info['inner_offset'] + game_info['inner_width'] - this.radius;
        this.y = this.radius;
        this.font_size = game_info['inner_ratio'] * 7;
        this.font_style = this.font_size.toString() + 'px Arial';
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
        this.canvas.context_get().fillText(this.label, this.x - (text.width / 2), this.y + (this.font_size / 3));
    }

    press()
    {

        this.canvas.mouse_up(null);
        game_canvas.level_get().object_get('Obj_Grid_Draw').stop();
    }

}

constructors['Stop_Button'] = Stop_Button;
