class List_Objects extends List
{

    constructor(x_ratio, y_ratio, radius_ratio, canvas, extra)
    {

        super(x_ratio, y_ratio, radius_ratio, canvas);

        this.options = [
            {
                'display':     'Block',
                'constructor': 'Block',
                'extra':       null,
            },
            {
                'display':     'Block2',
                'constructor': 'Block',
                'extra':       null,
            },
            {
                'display':     'Block3',
                'constructor': 'Block',
                'extra':       null,
            },
            {
                'display':     'Block4',
                'constructor': 'Block',
                'extra':       null,
            },
            {
                'display':     'Block5',
                'constructor': 'Block',
                'extra':       null,
            },
        ];

        this.x = game_info['inner_offset'] + (game_info['inner_width'] * 0.25);
        this.y = game_info['inner_height'] * 0.25;

        this.width = game_info['inner_width'] * 0.5;
        this.height = game_info['inner_height'] * 0.4;

        this.scratch_canvas.setAttribute('width', this.width + this.x);
        this.scratch_canvas.setAttribute('height', this.height + this.y);

    }

}

constructors['List_Objects'] = List_Objects;
