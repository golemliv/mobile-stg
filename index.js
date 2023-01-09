var game_canvas = null;
var button_canvas = null;

var game_info = {
    'height':        0,
    'width':         0,
    'aspect_ratio':  0,
    'orientation':   '',
    'inner_width':   0,
    'inner_ratio':   0,
    'inner_offset':  0,
    'def_width':     80,
    'def_height':    142,
    'button_flags':  {},
    'paused':        false,
    'levels':        {},
    'tile_size':     16,
    'debug':         true,
    'debug_element': '',
};

var constructors = {};

//https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
document.addEventListener('DOMContentLoaded', function() {

    game_canvas = new Canvas(document.getElementById('game_canvas'));
    button_canvas = new Canvas(document.getElementById('button_canvas'));
    debug_canvas = new Canvas(document.getElementById('debug_canvas'));

    button_canvas.touch_activate();

    resize();

    animate();

    game_canvas.level_load('title');

/*
    init_title_screen();
*/

});

/**
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop,
 * otherwise defaults to setTimeout().
 * (http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/)
 */
window.requestAnimFrame = (function(){
  return window.requestAnimationFrame  ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function(/* function */ callback, /* DOMElement */ element){
      window.setTimeout(callback, 1000 / 60);
    };
})();

function animate()
{
    requestAnimFrame(animate);

    button_canvas.step();
    game_canvas.step();
    debug_canvas.step();

/*
    //figure the quadrant to load
    curr_quadrant = Math.floor(scroll_x / 320);

    if(repeat_quadrant != null && curr_quadrant >= repeat_quadrant - 2)
    {
        for(var i = 0; i < blockgroup.blocks.length; i++)
        {
            blockgroup.blocks[i].x -= tile_size * quadrant_width;
        }
        for(var i = 0; i < enemygroup.enemies.length; i++)
        {
            enemygroup.enemies[i].x -= tile_size * quadrant_width;
        }
        scroll_x -= tile_size * quadrant_width;
        the_hero.x -= tile_size * quadrant_width;
        context.translate(tile_size * quadrant_width, 0);
        block_list[repeat_quadrant]['drawn'] = false;
        block_list[repeat_quadrant - 1]['drawn'] = true;
        if(block_list[repeat_quadrant +1] != undefined)
        {
            block_list[repeat_quadrant + 1]['drawn'] = false;
        }
    }
*/

/*
    //add any objects if necessary
    create_objects(curr_quadrant);
*/

/*
    //initialize the scroll speed (can be modified by the hero)
    scroll_speed = initial_scroll_speed;
*/

/*
    if(debug != null)
    {
        button_context.lineWidth = 1;
        button_context.font = 'bold 12pt courier';
        button_context.strokeStyle = '#FFFFFF';
        button_context.strokeText(debug, 50, 50);
    }
*/


/*
        //advance the scrolling
        if(curr_stage != null)
        {
            if(the_hero != null &&
               the_hero.locked_on == null &&
               the_hero.pit_reset == 0 &&
               the_hero.knockback == 0)
            {
                if(scroll_x > the_hero.x - the_hero.initial_x)
                {
                    scroll_speed = 0;
                }
                else if(scroll_x < the_hero.x - the_hero.initial_x - 2 * tile_size)
                {
                    scroll_speed *= 2;
                }
            }
            context.translate(-1 * scroll_speed, 0);
            scroll_x += scroll_speed;
        }

        //decay the score multiplier
        if(curr_stage != null)
        {
            figure_multiplier();
        }
*/

/*
    if(curr_stage != null)
    {
        draw_score();
    }
*/

}

function collide(x1, y1, width1, height1, x2, y2, width2, height2)
{
    if(x1 + width1 < x2)
    {
        return false;
    }
    if(x1 > x2 + width2)
    {
        return false;
    }
    if(y1 + height1 < y2)
    {
        return false;
    }
    if(y1 > y2 + height2)
    {
        return false;
    }
    return true;
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function file_load(filename)
{

}

function file_upload(callback)
{
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => { 
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            callback(evt.target.result);
        }
        reader.onerror = function (evt) {
            console.log('error reading file');
        }
    }

    input.click();
}

function resize()
{

    game_info['aspect_ratio'] = game_info['def_width'] / game_info['def_height'];

    game_info['width'] = document.getElementsByTagName('html')[0].clientWidth;
    game_info['height'] = document.getElementsByTagName('html')[0].clientHeight;

    game_info['orientation'] = 'portrait';

    game_info['inner_height'] = game_info['height'];

    game_info['inner_ratio'] = game_info['height'] / game_info['def_height'];

    game_info['inner_width'] = game_info['def_width'] * game_info['inner_ratio'];

    //center the canvas
    game_canvas.dom_obj_get().setAttribute('style', 'margin-left: ' + ((game_info['width'] - game_info['inner_width']) / 2).toString() + 'px;');

    debug_canvas.dom_obj_get().setAttribute('style', 'margin-left: ' + ((game_info['width'] - game_info['inner_width']) / 2).toString() + 'px;');

    game_info['inner_offset'] = ((game_info['width'] - game_info['inner_width']) / 2);

    button_canvas.size_set(game_info['width'], game_info['height']);
    game_canvas.size_set(game_info['inner_width'], game_info['inner_height']);
    game_canvas.scale(game_info['inner_ratio'], game_info['inner_ratio']);

    debug_canvas.size_set(game_info['inner_width'], game_info['inner_height']);
    debug_canvas.scale(game_info['inner_ratio'], game_info['inner_ratio']);

}
