class Player extends GObject
{

    constructor(x, y, extra)
    {
        super(x, y, extra, 'player');

        //this.width = game_info['tile_size'];
        this.width = game_info['tile_size'] * 2;
        this.height = game_info['tile_size'] * 2;
        this.gravity = 0.5;
//this.gravity = 0;
        this.y_vel = 0;
        this.max_y_vel = 1;
        this.jump_vel = -9;
        this.walk_vel_start = 3;
        this.walk_vel = 0.8;
//        this.walk_vel = 5;
        this.x_vel = 0;
        this.grounded = false;
        this.prev_x = 0;
        this.prev_y = 0;
        this.clock_angle = '6';
        this.x_friction = 0.7;
        this.x_cap = 10;
        this.stroke_style = '#000000';

//(12*sin(115),12*cos(115))

//(this.height / 2) * Math.sin(45 * 0.0174533)
//(this.height / 2) * Math.cos(45 * 0.0174533)

        //below, x and y are relative to the center point
        this.col_points = {
            '6': {
                'x':        0,
                'y':        this.height / 2,
                'x_vel':    1,
                'y_vel':    0,
                'friction': 0,
            },
            '5': {
//                'x':     0,
//                'y':     this.height / 2,
                'x':     (this.height / 2) * Math.sin(22.5 * 0.0174533),
                'y':     (this.height / 2) * Math.cos(22.5 * 0.0174533),
                'x_vel': 0.67,
                'y_vel': 0.33,
                'friction': -0.05,
            },
            '4:30': {
                'x':     (this.height / 2) * Math.sin(45 * 0.0174533),
                'y':     (this.height / 2) * Math.cos(45 * 0.0174533),
                'x_vel': 0.5,
                'y_vel': 0.5,
                'friction': -0.075,
            },
            '4': {
                'x':     (this.height / 2) * Math.sin(67.5 * 0.0174533),
                'y':     (this.height / 2) * Math.cos(67.5 * 0.0174533),
                'x_vel': 0.33,
                'y_vel': 0.67,
                'friction': -0.1,
            },
            '3': {
                'x':     this.width / 2,
                'y':     0,
                'x_vel': 0,
                'y_vel': 1,
                'friction': -0.5,
            },
            '2': {
                'x':     (this.height / 2) * Math.sin(112.5 * 0.0174533),
                'y':     -1 * (this.height / 2) * Math.cos(112.5 * 0.0174533),
                'x_vel': -0.33,
                'y_vel': 0.67,
                'friction': 0,
            },
            '1:30': {
                'x':     (this.height / 2) * Math.sin(135 * 0.0174533),
                'y':     (this.height / 2) * Math.cos(135 * 0.0174533),
                'x_vel': -0.5,
                'y_vel': 0.5,
                'friction': 0,
            },
            '1': {
                'x':     (this.height / 2) * Math.sin(22.5 * 0.0174533),
                'y':     -1 * (this.height / 2) * Math.cos(22.5 * 0.0174533),
                'x_vel': -0.67,
                'y_vel': 0.33,
                'friction': 0,
            },
            '12': {
                'x':     0,
                'y':     this.height / 2,
                'x_vel': -1,
                'y_vel': 0,
                'friction': 0,
            },
            '7': {
                'x':     -1 * (this.height / 2) * Math.sin(22.5 * 0.0174533),
                'y':     (this.height / 2) * Math.cos(22.5 * 0.0174533),
                'x_vel': 0.67,
                'y_vel': -0.33,
                'friction': 0.05,
            },
            '7:30': {
                'x':     -1 * (this.height / 2) * Math.sin(45 * 0.0174533),
                'y':     (this.height / 2) * Math.cos(45 * 0.0174533),
                'x_vel': 0.5,
                'y_vel': -0.5,
                'friction': 0.075,
            },
            '8': {
                'x':     -1 * (this.height / 2) * Math.sin(67.5 * 0.0174533),
                'y':     (this.height / 2) * Math.cos(67.5 * 0.0174533),
                'x_vel': 0.33,
                'y_vel': -0.67,
                'friction': 0.1,
            },
            '9': {
                'x':     -1 * this.width / 2,
                'y':     0,
                'x_vel': 0,
                'y_vel': -1,
                'friction': 0.5,
            },
            '11': {
                'x':     -1 * (this.height / 2) * Math.sin(22.5 * 0.0174533),
                'y':     -1 * (this.height / 2) * Math.cos(22.5 * 0.0174533),
                'x_vel': -0.67,
                'y_vel': -0.33,
                'friction': 0,
            },
            '10:30': {
                'x':     -1 * (this.height / 2) * Math.sin(45 * 0.0174533),
                'y':     -1 * (this.height / 2) * Math.cos(45 * 0.0174533),
                'x_vel': -0.5,
                'y_vel': -0.5,
                'friction': 0,
            },
            '10': {
                'x':     -1 * (this.height / 2) * Math.sin(67.5 * 0.0174533),
                'y':     -1 * (this.height / 2) * Math.cos(67.5 * 0.0174533),
                'x_vel': -0.33,
                'y_vel': -0.67,
                'friction': 0,
            },
        };

    }

    collide(keys, objects)
    {

        var prev_grounded = this.grounded;
        this.grounded = false;

        for(var i = 0; i < keys.length; i++)
        {

            var obj = objects[keys[i]];

            if(!collide(this.x, this.y, this.width, this.height, obj.x_get(), obj.y_get(), obj.width_get(), obj.height_get()))
            {
                continue;
            }

            if(obj.name_get() == 'Block')
            {

                var y_confirm_1 = obj.y_get() < (this.y + this.height - this.y_vel);
                var y_confirm_2 = obj.y_get() > this.y;



                if(!prev_grounded && this.y_vel > 0 && obj.y_get() < (this.y + this.height + this.y_vel) && obj.y_get() > this.y + this.height - (2 * this.y_vel))
                {

//if(this.x + this.width > obj.x_get() + 1) {

                    this.y = obj.y_get() - this.height;
                    this.grounded = true;
                    this.y_vel = 0;
                    this.clock_angle = '6';
//}

                }
                else if(prev_grounded && (this.clock_angle == '1' || this.clock_angle == '11') && (obj.y_get() + obj.height_get()) >= this.y)
                {

//if(this.x + this.width > obj.x_get() + 1) {

                    this.y = obj.y_get() + obj.height_get();
                    this.grounded = true;
                    this.y_vel = 0;
                    this.clock_angle = '12';
//}

                }
                else if(this.prev_y + this.height - 4 <= obj.y_get())
                {
                    this.y = Math.min(this.y, obj.y_get() - this.height);
                }

                if(this.clock_angle != '6' && this.prev_y + this.height < obj.y && this.y + this.height > obj.y)
                {
                    this.clock_angle = '6';
                    this.y = obj.y - this.height;
                }

if(this.clock_angle != '12')
{
                if(this.clock_angle == '3' && obj.x_get() >= this.x + this.width - 1)
                {

                        this.clock_angle = '3';
                        this.grounded = true;
                }
                else if(this.clock_angle == '9' && obj.x_get() <= this.x + 1)
                {

                        this.clock_angle = '9';
                        this.grounded = true;
                }
//                else if(obj.y_get() < (this.y + this.height - this.y_vel) && obj.x_get() > this.x && obj.x_get() < this.x + this.width)
                else if(obj.y_get() < this.y + this.height && obj.y_get() < (this.prev_y + this.height) && obj.x_get() > this.x && obj.x_get() < this.x + this.width)
                {
                    this.x = obj.x_get() - this.width;
                    if(this.clock_angle == '4' || this.clock_angle == '2')
                    {
//                        this.y -= this.walk_vel;
                        this.clock_angle = '3';
                        this.grounded = true;
                    }
                    else
                    {
                        this.x_vel = 0;
                    }
                }
//                else if(obj.y_get() < (this.y + this.height - this.y_vel) && obj.x_get() < this.x && (obj.x_get() + obj.width_get()) > this.x)
                else if(obj.y_get() < this.y + this.height && obj.y_get() < (this.prev_y + this.height) && obj.x_get() < this.x && (obj.x_get() + obj.width_get()) > this.x)
                {
                    this.x = obj.x_get() + obj.width_get();
                    if(this.clock_angle == '8' || this.clock_angle == '10')
                    {
                        this.clock_angle = '9';
                        this.grounded = true;
                    }
                    else
                    {
                        this.x_vel = 0;
                    }
                }
}

/*
                if(!this.grounded && this.y_vel > 0 && obj.y_get() < (this.y + this.height + this.y_vel) && obj.y_get() > this.y + this.height - (2 * this.y_vel))
                {

//if(this.x + this.width > obj.x_get() + 1) {

                    this.y = obj.y_get() - this.height;
                    this.grounded = true;
                    this.y_vel = 0;
                    this.clock_angle = '6';
//}

                }
*/

            }

            if(obj.name_get() == 'Slope')
            {
//                    this.grounded = true;

                //collide based on the middle of the character
/*
                var curr_coll_point = this.x + (this.width / 2);
                var prev_coll_point = this.prev_x + (this.width / 2);
*/

                var curr_coll_point = this.x + (this.width / 2) + this.col_points[obj.clock_angle_get()]['x'];
                var prev_coll_point = this.prev_x + (this.width / 2) + this.col_points[obj.clock_angle_get()]['x'];

                if(curr_coll_point < obj.x_get() || curr_coll_point > obj.x_get() + obj.width_get())
//                if(curr_coll_point < obj.x_get() || curr_coll_point > obj.x_get() + obj.width_get())
                {
                    continue;
                }

                var curr_slope_y = obj.y_at_point(curr_coll_point);
                var prev_slope_y = obj.y_at_point(prev_coll_point);

/*
                var curr_self_y = this.y + this.height;
                var prev_self_y = this.prev_y + this.height;
*/

/*
                var curr_self_y = this.y + (this.height / 2) + this.col_points[obj.clock_angle_get()]['y'];
                var prev_self_y = this.prev_y + (this.height / 2) + this.col_points[obj.clock_angle_get()]['y'];
*/

                var curr_self_y = this.y + (this.height / 2) + this.col_points[obj.clock_angle_get()]['y'];
                var prev_self_y = this.prev_y + (this.height / 2) + this.col_points[obj.clock_angle_get()]['y'];

                var curr_dist_y = (this.height / 2) - this.col_points[obj.clock_angle_get()]['y'];

/*
if(this.prev_x != this.x)
{
//debug_canvas.debug_write('(' + curr_coll_point + ', ' + curr_self_y + ') ' + curr_slope_y + ' (' + curr_coll_point + ', ' + prev_self_y + ') ' + prev_slope_y);
//debug_canvas.debug_write(curr_self_y + ' ' + curr_slope_y + ' ' + prev_self_y + ' ' + prev_slope_y);
debug_canvas.debug_write(obj.y_get() + ' ' + curr_slope_y + ' ' + this.y);
}
*/

                if(obj.clock_angle_get() == '5' || 
                   obj.clock_angle_get() == '4:30' || 
                   obj.clock_angle_get() == '4' || 
                   obj.clock_angle_get() == '7' || 
                   obj.clock_angle_get() == '7:30' || 
                   obj.clock_angle_get() == '8')
                {

                    if(curr_self_y >= curr_slope_y && prev_self_y <= prev_slope_y && this.y_vel >= 0)
                    {
                        if(curr_slope_y - this.height + curr_dist_y < this.y)
                        {
                            //this.y = curr_slope_y - this.height;
                            this.y = curr_slope_y - this.height + curr_dist_y;
                            this.grounded = true;
                            this.y_vel = 0;
                            this.clock_angle = obj.clock_angle_get();
                        }
                    }
                    else if(prev_grounded && !this.grounded && curr_self_y <= curr_slope_y && curr_self_y >= prev_self_y && this.clock_angle != '3' && this.clock_angle != '9')
                    {

                        if(curr_slope_y - this.height + curr_dist_y < this.y)
                        {
                            //this.y = curr_slope_y - this.height;
                            this.y = curr_slope_y - this.height + curr_dist_y;
                            this.grounded = true;
                            this.y_vel = 0;
                            this.clock_angle = obj.clock_angle_get();
                        }
                    }

                }
                else if(obj.clock_angle_get() == '2' || 
                   obj.clock_angle_get() == '1:30' || 
                   obj.clock_angle_get() == '1' || 
                   obj.clock_angle_get() == '10' || 
                   obj.clock_angle_get() == '10:30' || 
                   obj.clock_angle_get() == '11')
                {

//this.grounded = true;

                    if(curr_self_y <= curr_slope_y)
                    {
                        this.grounded = true;
                        this.clock_angle = obj.clock_angle_get();
//debug_canvas.debug_write('this.y ' + this.y.toFixed(2) + ', self y ' + curr_self_y.toFixed(2) + ', slope y ' + curr_slope_y.toFixed(2));
//this.y = curr_slope_y - this.height + curr_dist_y;
                    }

                }

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

        if(this.x_vel > 0)
        {
            this.x_vel -= this.x_friction;
            if(this.x_vel < 0)
            {
                this.x_vel = 0;
            }
        }
        else if(this.x_vel < 0)
        {
            this.x_vel += this.x_friction;
            if(this.x_vel > 0)
            {
                this.x_vel = 0;
            }
        }

        if(this.grounded && button_canvas.is_pressed('jump'))
        {
//            this.y_vel += this.jump_vel;


            if(this.col_points[this.clock_angle] == null)
            {
                this.y_vel -= this.jump_vel;
            }
            else
            {
                this.x_vel += this.jump_vel * this.col_points[this.clock_angle]['y_vel'];
                this.y_vel += this.jump_vel * this.col_points[this.clock_angle]['x_vel'];
                this.clock_angle = null;
            }

            this.grounded = false;
        }

        if(button_canvas.is_pressed('left'))
        {
            this.x_vel += this.walk_vel * -1;
        }

        if(button_canvas.is_pressed('right'))
        {
            this.x_vel += this.walk_vel;
        }

        if(this.x_vel < this.x_cap * -1)
        {
            this.x_vel = this.x_cap * -1;
        }
        else if(this.x_vel > this.x_cap)
        {
            this.x_vel = this.x_cap;
        }

        if(this.col_points[this.clock_angle] == null)
        {
            this.x += this.x_vel;
        }
        else
        {

            this.x_vel += this.col_points[this.clock_angle]['friction'];

            this.x += this.x_vel * this.col_points[this.clock_angle]['x_vel'];
            this.y -= this.x_vel * this.col_points[this.clock_angle]['y_vel'];
        }

        if(Math.abs(this.x_vel) < 4 && this.clock_angle != '6')
        {
            this.grounded = false;
            this.clock_angle = 6;
        }

        if(!this.grounded)
        {
            this.y_vel += this.gravity;
            this.y += this.y_vel;
        }
        else
        {
            this.y_vel = 0;
        }

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
