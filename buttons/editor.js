class Editor_Button extends Button
{

    constructor(x_ratio, y_ratio, radius_ratio, canvas, extra)
    {
        super(x_ratio, y_ratio, radius_ratio, canvas);
        this.button_fill = 'rgba(255, 0, 0, 1)';
        this.label = 'EDITOR';
    }

    press()
    {
        game_canvas.level_load('editor');
    }

}

constructors['Editor_Button'] = Editor_Button;
