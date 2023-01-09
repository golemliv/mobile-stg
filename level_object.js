class Level_Object
{

    constructor(data, id)
    {

        this.x = data['x'];
        this.y = data['y'];
        this.name = data['name'];
        this.extra = data['extra'];
        this.object = null;
        this.id = id;

    }

    id_get()
    {
        return this.id;
    }

    load(left, right, top, bottom)
    {
        if(this.x >= left && this.x <= right && this.y >= top && this.y <= bottom)
        {
            if(constructors[this.name] != null)
            {
                this.object = new constructors[this.name](this.x, this.y, this.extra);
                return this.object;
            }
        }
        return false;
    }

    name_get()
    {
        return this.name;
    }

}
