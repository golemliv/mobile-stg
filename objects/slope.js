class Slope extends GObject
{

    constructor(x, y, extra)
    {
        super(x, y, extra, 'slope');

        this.width = game_info['tile_size'];
        this.height = game_info['tile_size'];

        this.dir = extra['dir'];

        //clock angles are a hacky way to do this - they should be numeric values
        //rise and run assume the character is running right to left -
        //multiply both by -1 to get the left to right values

        switch(this.dir)
        {
            case 'slight right bottom':
                this.clock_angle = '5';
                this.rise = 0.25;
                this.run = 0.75;
                break;
            case 'right bottom':
                this.clock_angle = '4:30';
                this.rise = 0.5;
                this.run = 0.5;
                break;
            case 'steep right bottom':
                this.clock_angle = '4';
                this.rise = 0.75;
                this.run = 0.25;
                break;
            case 'steep right top':
                this.clock_angle = '2';
                this.rise = 0.75;
                this.run = -0.25;
                break;
            case 'right top':
                this.clock_angle = '1:30';
                this.rise = 0.5;
                this.run = -0.5;
                break;
            case 'slight right top':
                this.clock_angle = '1';
                this.rise = 0.25;
                this.run = -0.75;
                break;
            case 'slight left top':
                this.clock_angle = '11';
                this.rise = -0.25;
                this.run = -0.75;
                break;
            case 'left top':
                this.clock_angle = '10:30';
                this.rise = -0.5;
                this.run = -0.5;
                break;
            case 'steep left top':
                this.clock_angle = '10';
                this.rise = -0.75;
                this.run = -0.25;
                break;
            case 'steep left bottom':
                this.clock_angle = '8';
                this.rise = -0.75;
                this.run = 0.25;
                break;
            case 'left bottom':
                this.clock_angle = '7:30';
                this.rise = -0.5;
                this.run = 0.5;
                break;
            case 'slight left bottom':
                this.clock_angle = '7';
                this.rise = -0.25;
                this.run = 0.75;
                break;
        }
    }

    clock_angle_get()
    {
        return this.clock_angle;
    }

    collide(keys, objects)
    {

    }

    draw(canvas_context)
    {
        canvas_context.beginPath();
        switch(this.dir)
        {
            case 'slight right bottom':
                canvas_context.moveTo(this.x, this.y + this.height);
                canvas_context.lineTo(this.x + this.width, this.y + (this.height / 2));
                break;
            case 'right bottom':
                canvas_context.moveTo(this.x, this.y + this.height);
                canvas_context.lineTo(this.x + this.width, this.y);
                break;
            case 'steep right bottom':
                canvas_context.moveTo(this.x, this.y + this.height);
                canvas_context.lineTo(this.x + (this.width / 2), this.y);
                break;
            case 'steep right top':
                canvas_context.moveTo(this.x + (this.width / 2), this.y + this.height);
                canvas_context.lineTo(this.x, this.y);
                break;
            case 'right top':
                canvas_context.moveTo(this.x, this.y);
                canvas_context.lineTo(this.x + this.width, this.y + this.height);
                break;
            case 'slight right top':
                canvas_context.moveTo(this.x, this.y);
                canvas_context.lineTo(this.x + this.width, this.y + (this.height / 2));
                break;
            case 'slight left bottom':
                canvas_context.moveTo(this.x, this.y + (this.height / 2));
                canvas_context.lineTo(this.x + this.width, this.y + this.height);
                break;
            case 'left bottom':
                canvas_context.moveTo(this.x, this.y);
                canvas_context.lineTo(this.x + this.width, this.y + this.height);
                break;
            case 'steep left bottom':
                canvas_context.moveTo(this.x + (this.width / 2), this.y);
                canvas_context.lineTo(this.x + this.width, this.y + this.height);
                break;
            case 'slight left top':
                canvas_context.moveTo(this.x, this.y + (this.height / 2));
                canvas_context.lineTo(this.x + this.width, this.y);
                break;
            case 'left top':
                canvas_context.moveTo(this.x, this.y + this.height);
                canvas_context.lineTo(this.x + this.width, this.y);
                break;
            case 'steep left top':
                canvas_context.moveTo(this.x + (this.width / 2), this.y + this.height);
                canvas_context.lineTo(this.x + this.width, this.y);
                break;
        }
        canvas_context.stroke();
        canvas_context.strokeStyle = '#AAAAAA';
        canvas_context.beginPath();
        canvas_context.rect(this.x, this.y, this.width, this.height);
        canvas_context.stroke();
        canvas_context.strokeStyle = '#000000';
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
        return 'Slope';
    }

    width_get()
    {
        return this.width;
    }

    x_get()
    {
        return this.x;
    }

    y_at_point(x_pos)
    {
        switch(this.dir)
        {
            case 'slight right bottom':
                //return Math.min(Math.max(this.y + this.height - ((x_pos - this.x) / 2), this.y + (this.height / 2)), this.y + this.height);
                //return Math.max(this.y + this.height - ((x_pos - this.x) / 2), this.y + (this.height / 2));
                //return this.y + this.height - ((x_pos - this.x) / 2);
                return Math.max(this.y + this.height - ((x_pos - this.x) / 2), this.y + (this.height / 2));
                break;
            case 'right bottom':
                return this.y + this.height - (x_pos - this.x);
                break;
            case 'steep right bottom':
                //return Math.max(this.y + this.height - ((x_pos - this.x) * 2), this.y);
                return this.y + this.height - ((x_pos - this.x) * 2);
                break;
            case 'steep right top':
                //return Math.max(this.y + this.height - ((x_pos - this.x) * 2), this.y);
                return this.y + this.height - ((this.x - x_pos) * 2) - 2;
                break;
            case 'right top':
                return this.y + (x_pos - this.x) + 1;
                break;
            case 'slight right top':
                return Math.max(this.y + ((x_pos - this.x) / 2), this.y);
                break;
            case 'slight left bottom':
                return Math.max(this.y + (this.height / 2) + ((x_pos - this.x) / 2), this.y + (this.height / 2));
                break;
            case 'left bottom':
                return this.y + (x_pos - this.x);
                break;
            case 'steep left bottom':
                return (this.y + ((x_pos - this.x) * 2) - this.height);
                break;
            case 'slight left top':
//                return this.y + (this.height / 2) + (this.x - x_pos) / 2;
                return this.y + (this.height + (this.x - x_pos) + 2) / 2;
                break;
            case 'left top':
                return this.y + this.height + (this.x - x_pos) + 4;
                break;
            case 'steep left top':
                return this.y + (this.height * 2) - (x_pos - this.x)- (this.width / 2);
                break;
            default:
                break;
        }
    }

    y_get()
    {
        return this.y;
    }

}

constructors['Slope'] = Slope;
