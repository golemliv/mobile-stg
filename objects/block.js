class Block extends GObject
{

    constructor(x, y, extra)
    {
        super(x, y, extra, 'block');

        this.width = game_info['tile_size'];
        this.height = game_info['tile_size'];
        this.stroke_style = '#000000';

        if(extra != null && extra['height'] != null)
        {
            this.height *= parseFloat(extra['height']);
        }
    }

    collide(keys, objects)
    {

    }

    draw(canvas_context)
    {
        canvas_context.strokeStyle = this.stroke_style;
        canvas_context.beginPath();
        canvas_context.rect(this.x, this.y, this.width, this.height);
        canvas_context.stroke();
    }

    height_get()
    {
        return this.height;
    }

    move()
    {

    }

    name_get()
    {
        return 'Block';
    }

    width_get()
    {
        return this.width;
    }

    x_get()
    {
        return this.x;
    }

    y_get()
    {
        return this.y;
    }

}

constructors['Block'] = Block;
