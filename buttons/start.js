class Start_Button extends Button
{

    constructor(x_ratio, y_ratio, radius_ratio, canvas)
    {
        super(x_ratio, y_ratio, radius_ratio, canvas);
        this.button_fill = 'rgba(255, 0, 0, 1)';
    }

    press()
    {
//        game_canvas.level_load('editor');
    }

}

constructors['start_button'] = Start_Button;
