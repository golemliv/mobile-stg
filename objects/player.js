class Player extends GObject
{

    constructor(x, y, extra)
    {
        super(x, y, extra, 'player');

        this.width = game_info['tile_size'] / 2;
        this.height = game_info['tile_size'];
        this.y_vel = -0.5; //scroll speed
        this.x_vel = 0; //current horizontal speed
        this.x_cap = 10; //maximum horizontal speed
        this.prev_x = 0; //your x position from the last frame
        this.prev_y = 0; //your y position from the last frame
        this.stroke_style = '#000000';

    }

    collide(keys, objects)
    {

        for(var i = 0; i < keys.length; i++)
        {

            var obj = objects[keys[i]];

            if(!collide(this.x, this.y, this.width, this.height, obj.x_get(), obj.y_get(), obj.width_get(), obj.height_get()))
            {
                continue;
            }

        }

    }

    draw(canvas_context)
    {
        canvas_context.strokeStyle = this.stroke_style;
        canvas_context.beginPath();
        canvas_context.rect(this.x, this.y, this.width, this.height);
        canvas_context.stroke();
        canvas_context.beginPath();
        canvas_context.arc(this.x + this.width / 2, this.y + this.height / 2, this.height / 2, 0, 2 * Math.PI);
        canvas_context.stroke();
    }

    height_get()
    {
        return this.height;
    }

    move()
    {

        this.prev_x = this.x;
        this.prev_y = this.y;

        this.y += this.y_vel;

    }

    name_get()
    {
        return 'Player';
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

constructors['Player'] = Player;
