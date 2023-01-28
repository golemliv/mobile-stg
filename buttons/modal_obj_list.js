class Modal_Obj_List extends Modal
{

    constructor(x_ratio, y_ratio, radius_ratio, canvas, extra)
    {
        super(x_ratio, y_ratio, radius_ratio, canvas);
        this.name = 'modal_obj_list';
        this.label = 'Objects';

        this.width = game_info['inner_width'] * 0.75;
        this.height = game_info['inner_height'] * 0.75;

        this.x = game_info['inner_offset'] + (game_info['inner_width'] * 0.125);
        this.y = game_info['inner_height'] * 0.125;

        this.font_fill = 'rgba(0, 0, 0, 1)';
        this.font_size = game_info['inner_ratio'] * 10;
        this.font_style = this.font_size.toString() + 'px ' + game_info['font_face'];

        this.list_y_offset = 0;

        this.child_add(new constructors['List_Objects'](0, 0, 0, button_canvas, null));

        var ok_btn = new constructors['Button']((game_info['inner_width'] * 0.5) / game_info['inner_ratio'], (game_info['inner_height'] * 0.77) / game_info['inner_ratio'], game_info['tile_size'] * 0.75, button_canvas, {'label': 'OK', 'name': 'Modal Obj List OK'});

        ok_btn.press_func_set(button_canvas.button_remove.bind(button_canvas, 'modal_obj_list'));

        this.child_add(ok_btn);

    }

    draw()
    {

        super.draw();

        this.canvas.context_get().fillStyle = this.font_fill;
        this.canvas.context_get().font = this.font_style;

        var text = this.canvas.context_get().measureText(this.label);

        //text is anchored by its bottom, NOT by its top
        this.canvas.context_get().fillText(this.label, this.x - (text.width / 2) + (this.width / 2), this.y + (game_info['tile_size'] * game_info['inner_ratio'] * 0.5) + (this.font_size / 2));

    }

}

constructors['Modal_Obj_List'] = Modal_Obj_List;
