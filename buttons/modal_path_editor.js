class Modal_Path_Editor extends Modal
{

    constructor(x_ratio, y_ratio, radius_ratio, canvas, extra)
    {
        super(x_ratio, y_ratio, radius_ratio, canvas);
        this.name = 'Modal_Path_Editor';
        this.label = 'Paths';

        this.width = game_info['inner_width'];
        this.height = game_info['inner_height'] * 0.5;

        this.x = game_info['inner_offset'];
        this.y = 0;

        this.font_fill = 'rgba(0, 0, 0, 1)';
        this.font_size = game_info['inner_ratio'] * 5;
        this.font_style = this.font_size.toString() + 'px ' + game_info['font_face'];

        this.list_y_offset = 0;

        this.preview_x = game_info['inner_width'] * 0.5;
        this.preview_y = 1;
        this.preview_width = game_info['inner_width'] * 0.5;
        this.preview_height = (game_info['inner_height'] * 0.5) - 1;

//        this.child_add(new constructors['List_Objects'](0, 0, 0, button_canvas, null));

        var ok_btn = new constructors['Button']((game_info['inner_width'] * 0.25) / game_info['inner_ratio'], (game_info['inner_height'] * 0.45) / game_info['inner_ratio'], game_info['tile_size'] * 0.37, button_canvas, {'label': 'OK', 'name': 'Modal Obj List OK'});

        ok_btn.press_func_set(this.close.bind(this));

        ok_btn.font_size_set(this.font_size);

        this.child_add(ok_btn);

        //input tags
        var left = game_info['inner_offset'];
        var width = (game_info['inner_width'] * 0.5);
        var height = game_info['tile_size'] * game_info['inner_ratio'] * 0.5;
        var name_top = (this.y + (game_info['tile_size'] * game_info['inner_ratio'] * 1));
        var x_top = (this.y + (game_info['tile_size'] * game_info['inner_ratio'] * 2));
        var y_top = (this.y + (game_info['tile_size'] * game_info['inner_ratio'] * 3));

        this.name_input = document.createElement('input');
        this.name_input.setAttribute('type', 'text');
        this.name_input.setAttribute('style', 'z-index: 3;position: fixed;left: ' + left + 'px;top: ' + name_top + 'px;width: ' + width + 'px;height: ' + height + 'px;');
        document.getElementsByTagName('body')[0].appendChild(this.name_input);

        this.x_input = document.createElement('input');
        this.x_input.setAttribute('type', 'text');
        this.x_input.setAttribute('style', 'z-index: 3;position: fixed;left: ' + left + 'px;top: ' + x_top + 'px;width: ' + width + 'px;height: ' + height + 'px;');
        this.x_input.value = '40';
        document.getElementsByTagName('body')[0].appendChild(this.x_input);

        this.y_input = document.createElement('input');
        this.y_input.setAttribute('type', 'text');
        this.y_input.setAttribute('style', 'z-index: 3;position: fixed;left: ' + left + 'px;top: ' + y_top + 'px;width: ' + width + 'px;height: ' + height + 'px;');
        this.y_input.value = 't';
        document.getElementsByTagName('body')[0].appendChild(this.y_input);

        this.frame = 0;

    }

//math.evaluate('1 + 2');

    close()
    {
        document.getElementsByTagName('body')[0].removeChild(this.name_input);
        document.getElementsByTagName('body')[0].removeChild(this.x_input);
        document.getElementsByTagName('body')[0].removeChild(this.y_input);
        button_canvas.button_remove('Modal_Path_Editor')
    }

    draw()
    {

        super.draw();

        this.canvas.context_get().fillStyle = this.font_fill;
        this.canvas.context_get().font = this.font_style;

        var text = this.canvas.context_get().measureText(this.label);

        //text is anchored by its bottom, NOT by its top
        this.canvas.context_get().fillText(this.label, this.x - (text.width / 2) + (this.width / 4), this.y + (game_info['tile_size'] * game_info['inner_ratio'] * 0.25) + (this.font_size / 2));

        this.canvas.context_get().fillText('Name', this.x + (game_info['tile_size'] * game_info['inner_ratio'] * 0.5), this.y + (game_info['tile_size'] * game_info['inner_ratio'] * 0.75) + (this.font_size / 2));
        this.canvas.context_get().fillText('X', this.x + (game_info['tile_size'] * game_info['inner_ratio'] * 0.5), this.y + (game_info['tile_size'] * game_info['inner_ratio'] * 1.75) + (this.font_size / 2));
        this.canvas.context_get().fillText('Y', this.x + (game_info['tile_size'] * game_info['inner_ratio'] * 0.5), this.y + (game_info['tile_size'] * game_info['inner_ratio'] * 2.75) + (this.font_size / 2));

        this.canvas.context_get().strokeStyle = this.stroke_style;
        this.canvas.context_get().fillStyle = this.fill_style;

        this.canvas.context_get().beginPath();
        this.canvas.context_get().rect(this.x + this.preview_x, this.y + this.preview_y, this.preview_width, this.preview_height);
        this.canvas.context_get().stroke();
        this.canvas.context_get().fill();

        this.frame++;

        var scope = {'t': this.frame};

        var x = (math.evaluate(this.x_input.value, scope) * game_info['inner_ratio'] * 0.5) + game_info['inner_offset'] + (game_info['inner_width'] * 0.5);
        var y = math.evaluate(this.y_input.value, scope) * game_info['inner_ratio'] * 0.5;

        if(y < -1 * game_info['tile_size'] || y > (game_info['inner_height'] * 0.5) + game_info['tile_size'])
        {
            this.frame = 0;
        }

        this.canvas.context_get().beginPath();
        this.canvas.context_get().arc(x, y, game_info['tile_size'] * 0.25 * game_info['inner_ratio'], 0, 2 * Math.PI);
        this.canvas.context_get().stroke();
        this.canvas.context_get().fill();

    }

}

constructors['Modal_Path_Editor'] = Modal_Path_Editor;
