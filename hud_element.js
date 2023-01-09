class HUD_Element
{

    constructor(x, y, name, index)
    {
        this.x = x;
        this.y = y;
        this.name = name;
        this.index = index;
    }

    draw(canvas_context)
    {
        if(game_info[this.index] != null)
        {
            canvas_context.fillText(this.name + ': ' + game_info[this.index].toString(), x, y);
        }
    }

}
