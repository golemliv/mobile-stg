class Modal extends Button
{

    constructor(x_ratio, y_ratio, radius_ratio, canvas, extra)
    {
        super(x_ratio, y_ratio, radius_ratio, canvas);
        this.name = 'modal';
        this.label = this.name;

        this.fill_style = 'rgba(255, 255, 255, 1)';
        this.stroke_style = 'rgba(0, 0, 0, 1)';

        this.child_objects = new Array();

    }

    //children that compose the modal
    child_add(obj)
    {
        this.child_objects.push(obj);
    }


    click_check(touches)
    {

        for(var i = 0; i < this.child_objects.length; i++)
        {
            this.child_objects[i].click_check(touches);
        }

    }

    draw()
    {

        this.canvas.context_get().beginPath();
        this.canvas.context_get().rect(this.x, this.y, this.width, this.height);

        this.canvas.context_get().strokeStyle = this.stroke_style;
        this.canvas.context_get().fillStyle = this.fill_style;

        this.canvas.context_get().fill();
        this.canvas.context_get().stroke();

        for(var i = 0; i < this.child_objects.length; i++)
        {
            this.child_objects[i].draw();
        }

    }

    press()
    {
        super.press();
    }

}

constructors['Modal'] = Modal;
