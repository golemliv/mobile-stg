class GObject
{

    constructor(x, y, extra, name)
    {
        this.x = x;
        this.y = y;
        this.extra = JSON.parse(JSON.stringify(extra));
        this.name = name;
    }

    extra_get()
    {
        return this.extra;
    }

    name_get()
    {
        return this.name;
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
