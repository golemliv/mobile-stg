window.onerror = function (errorMsg, url, lineNumber) {
    alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
}

/*
try
{
  var test = jjiojiojio;
}
catch(err)
{
  document.write(err.message);
  window.stop();
}
*/

var drawables = new Array();
var buttons = new Array();
var game_height = 0;
var game_width = 0;
var inner_width = 0;
var inner_offset = 0;
var inner_ratio = 0;
var canvas = null;
var context = null;
var button_canvas = null;
var button_context = null;
var screen_orientation = null;
var my_height = 480;
var my_width = 640;
var touches = new Array();
var tile_size = 32;
var curr_quadrant = 0;
var quadrant_width = 10; //measured in tiles
var scroll_x = 0;
var blockgroup = null;
var enemygroup = null;
var real_initial_scroll_speed = 2;
var initial_scroll_speed = real_initial_scroll_speed;
var scroll_speed = initial_scroll_speed;
var curr_stage = null;
var the_hero = null;
var score = 0;
var multiplier = 1;
var multiplier_timer = 0;
var multiplier_timer_max = 240;
var boss_multiplier = false;
var paused = false;
var debug_mode = false;
var pause_message = new Array();
var full_pass = '';
var simple_pass = '';
var custom_contents = ''; //the contents of a custom stage
var checkpoint_x = 0;
var repeat_quadrant = null;
var repeated_quadrants = new Array(); //list of quadrants whose repetitions you've cleared

var debug = null;

var stages = [
  {
    'file': 'intro.php',
    'done': false,
    'name': 'Intro',
    'score': 0,
  },
  {
    'file': '1.php',
    'done': false,
    'name': 'One',
    'score': 0,
  },
  {
    'file': '2.php',
    'done': false,
    'name': 'Two',
    'score': 0,
  },
  {
    'file': '3.php',
    'done': false,
    'name': 'Three',
    'score': 0,
  },
  {
    'file': 'almost_final.php',
    'done': false,
    'name': 'Almost Final',
    'score': 0,
  },
  {
    'file': 'final.php',
    'done': false,
    'name': 'Final',
    'score': 0,
  },
];

//which extra weapons you have
var weapons = {
  '1': false,
  '2': false,
  '3': false,
};

//button listeners
var jump_press = false;
var charge_press = false;

//https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
document.addEventListener('DOMContentLoaded', function() {

  canvas = document.getElementById('game_canvas');
  context = canvas.getContext('2d');

  button_canvas = document.getElementById('button_canvas');
  button_context = button_canvas.getContext('2d');

  button_canvas.addEventListener("touchstart", handleStart, false);
  button_canvas.addEventListener("touchend", handleEnd, false);
  button_canvas.addEventListener("touchcancel", handleCancel, false);
  button_canvas.addEventListener("touchmove", handleMove, false);

/*
  button_canvas.addEventListener("touchstart", function(evt) {
    for(var i = 0; i < evt['changedTouches'].length; i++)
    {
      change_touch(evt['changedTouches'][i], true);
    }
  }, false);
*/

/*
  button_canvas.addEventListener("touchend", function(evt) {
    var touch = evt['changedTouches'][0];
    change_touch(touch, false);
  }, false);

  button_canvas.addEventListener("touchcancel", function(evt) {
    var touch = evt['changedTouches'][0];
    change_touch(touch, false);
  }, false);
*/

  button_canvas.addEventListener('mousedown', function(evt) {
    touches.push({
      'touch_x': evt.clientX,
      'touch_y': evt.clientY,
      'identifier': 'mouse',
    });
  }, false);

  button_canvas.addEventListener('mousemove', function(evt) {
    for(var i = 0; i < touches.length; i++)
    {
      if(touches[i]['identifier'] == 'mouse')
      {
        touches[i]['touch_x'] = evt.clientX;
        touches[i]['touch_y'] = evt.clientY;
      }
    }
  }, false)

  button_canvas.addEventListener('mouseup', function(evt) {
//    for(var i = 0; i < touches.length; i++)
//    {
//      if(touches[i]['identifier'] == 'mouse')
//      {
//        touches.splice(i, 1);
//      }
//    }
    touches = new Array();
  }, false);

  resize_canvas();

  animate();

  init_title_screen();
});


//hacks for keyboard play

window.onkeyup = function (e) {
  var code = e.keyCode ? e.keyCode : e.which;
  touch_on_off = false;
  if (code === 32)
  {
    for(var i = 0; i < touches.length; i++)
    {
      if(touches[i]['identifier'] == 'jump')
      {
        touches.splice(i, 1);
      }
    }
  } else {
    for(var i = 0; i < touches.length; i++)
    {
      if(touches[i]['identifier'] == 'charge')
      {
        touches.splice(i, 1);
      }
    }
  }
};

window.onkeydown = function (e) {
  var code = e.keyCode ? e.keyCode : e.which;
/*
  //68 is "d"
  if(code === 68)
  {
    debug_mode = true;
  }
  //69 is "e"
  if(code === 69)
  {
    window.location = 'http://www.vgthought.com/triggerfinger/editor.html';
  }
  //76 is "l"
  if(code === 76)
  {
    load_custom_stage();
  }
  if(debug_mode)
  {
    var debug_speed = 4;
    if(code === 37)
    {
      scroll_x -= debug_speed;
      context.translate(debug_speed, 0);
    }
    else if(code === 39)
    {
      scroll_x += debug_speed;
      context.translate(-1 * debug_speed, 0);
    }
    if(the_hero != null)
    {
      if(code === 38)
      {
        the_hero.y -= debug_speed;
      }
      else if(code === 40)
      {
        the_hero.y += debug_speed;
      }
    }
  }
*/
  if (code === 32)
  {
    var jump_press = false;
    for(var i = 0; i < touches.length; i++)
    {
      if(touches[i]['identifier'] == 'jump')
      {
        jump_press = true;
      }
    }
    if(!jump_press)
    {
      touches.push({
        'touch_x': 10,
        'touch_y': game_height / 2,
        'identifier': 'jump',
      });
    }
  } else {
    var charge_press = false;
    for(var i = 0; i < touches.length; i++)
    {
      if(touches[i]['identifier'] == 'charge')
      {
        charge_press = true;
      }
    }
    if(!charge_press)
    {
      touches.push({
        'touch_x': game_width - 10,
        'touch_y': game_height / 2,
        'identifier': 'charge',
      });
    }
  }
};

function change_touch(touch, on_off)
{
//  touch_on_off = on_off;

  if(screen_orientation == 'portrait')
  {
    touches.push({
      'touch_x': touch['clientY'],
      'touch_y': game_height - touch['clientX'],
    });
  }
  else
  {
    touches.push({
      'touch_x': touch['clientY'],
      'touch_y': touch['clientX'],
    });
  }

}

function resize_canvas()
{
  document.getElementsByTagName('html')[0].setAttribute('style', 'width: 100%;height: 100%;');
  canvas.setAttribute('width', document.getElementsByTagName('html')[0].clientWidth);
  canvas.setAttribute('height', document.getElementsByTagName('html')[0].clientHeight);
  button_canvas.setAttribute('width', document.getElementsByTagName('html')[0].clientWidth);
  button_canvas.setAttribute('height', document.getElementsByTagName('html')[0].clientHeight);
  if(document.getElementsByTagName('html')[0].clientWidth > document.getElementsByTagName('html')[0].clientHeight)
  {
    game_width = document.getElementsByTagName('html')[0].clientWidth;
    game_height = document.getElementsByTagName('html')[0].clientHeight;
    screen_orientation = 'landscape';

    if(screen != undefined && screen.orientation != undefined && screen.orientation.angle != undefined)
    {
      if(screen.orientation.angle == 270)
      {
        context.rotate((screen.orientation.angle + 90) * Math.PI/180);
        button_context.rotate((screen.orientation.angle + 90) * Math.PI/180);
      }
    }
  }
  else
  {
    game_height = document.getElementsByTagName('html')[0].clientWidth;
    game_width = document.getElementsByTagName('html')[0].clientHeight;
    screen_orientation = 'portrait';

    context.translate(game_height, 0);
    context.rotate(90 * Math.PI/180);

    button_context.translate(game_height, 0);
    button_context.rotate(90 * Math.PI/180);
  }

  inner_width = game_height * 4 / 3;
  inner_offset = (game_width - inner_width) / 2;
  context.translate(inner_offset, 0);

  //translate from my own width to the screen's width
  inner_ratio = game_height / my_height;
  context.scale(inner_ratio , inner_ratio);
  context.translate(-1 * scroll_x, 0);

  for(var i = 0; i < buttons.length; i++)
  {
    buttons[i].find_position();
  }

}

function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier;

    if (id == idToFind) {
      return i;
    }
  }
  return -1;    // not found
}

//figure whether two things are overlapping (exclusive)
//input: two objects to compare
//both objects must have x, y, width, and height
function standard_collision(obj_a, obj_b)
{
  //horizontal check
  if((obj_a.x + obj_a.width) > obj_b.x && obj_a.x < (obj_b.x + obj_b.width))
  {
    //vertical check
    if((obj_a.y + obj_a.height) > obj_b.y && obj_a.y < (obj_b.y + obj_b.height))
    {
      return true;
    }
  }
  return false;
}

function Background()
{
  this.move = function()
  {

  }

  this.collide = function()
  {

  }

  this.draw = function()
  {
    context.fillStyle = '#FFFF00';
    context.fillRect(scroll_x - (my_width / 2), 0, my_width * 1.5, my_height);
    context.strokeStyle = '#CCCC00';
    var i = scroll_x - scroll_x % tile_size;
    for(i; i < scroll_x + my_width; i += tile_size)
    {
      context.beginPath();
      context.moveTo(i, 0);
      context.lineTo(i, my_height);
      context.stroke();
    }
  }
}

//clear out all of the objects associated with the game state and reset the canvas
function redo_game()
{
  context.translate(scroll_x, 0);
  block_list = new Array();
  enemy_list = new Array();
  scroll_x = 0;
  curr_quadrant = 0;
  scroll_speed = real_initial_scroll_speed;
  initial_scroll_speed = real_initial_scroll_speed;

  drawables = new Array();

  buttons = new Array();
}

function init_title_screen()
{
  redo_game();
  drawables.push(new TitleScreen());
}

function TitleScreen()
{
  buttons.push(new StartButton());
  buttons.push(new PasswordButton());
  buttons.push(new EditorButton());
  buttons.push(new LoadButton());
  scroll_speed = 0;
  initial_scroll_speed = 0;

  this.move = function()
  {

  }

  this.collide = function()
  {

  }

  this.draw = function()
  {
    context.fillStyle = '#000000';
    context.fillRect(-1, -1, my_width + 2, my_height + 2);
    button_context.lineWidth = game_height / 500;
    button_context.font = 'bold ' + (game_height / 10).toString() + 'pt courier';
    button_context.strokeStyle = '#FFFFFF';
    button_context.fillStyle = '#0000FF';
    var text_width = button_context.measureText('Trigger Finger').width;
    button_context.fillText('Trigger Finger', (game_width / 2) - (text_width / 2), game_height / 10);
    button_context.strokeText('Trigger Finger', (game_width / 2) - (text_width / 2), game_height / 10);
  }
}

function init_stage_select()
{
  curr_stage = null;
  redo_game();
  drawables.push(new StageSelect());
}

function StageSelect()
{
  buttons.push(new StageButton('1', game_width / 3, game_height / 3, game_height / 10, game_height / 25));
  buttons.push(new StageButton('2', game_width / 2, game_height / 3, game_height / 10, game_height / 25));
  buttons.push(new StageButton('3', 2 * game_width / 3, game_height / 3, game_height / 10, game_height / 25));
  if(stages[1]['done'] && stages[2]['done'] && stages[3]['done'])
  {
    buttons.push(new StageButton('4', 1.6 * game_width / 4, 2 * game_height / 3, game_height / 10, game_height / 25));
  }
  if(stages[4]['done'])
  {
    buttons.push(new StageButton('5', 2.5 * game_width / 4, 2 * game_height / 3, game_height / 10, game_height / 25));
  }
  scroll_speed = 0;
  initial_scroll_speed = 0;

  this.move = function()
  {

  }

  this.collide = function()
  {

  }

  this.draw = function()
  {
    context.fillStyle = '#000000';
    context.fillRect(-1, -1, my_width + 2, my_height + 2);
    button_context.lineWidth = game_height / 500;
    button_context.font = 'bold ' + (game_height / 10).toString() + 'pt courier';
    button_context.strokeStyle = '#FFFFFF';
    button_context.fillStyle = '#0000FF';
    var text_width = button_context.measureText('Stage Select').width;
    button_context.fillText('Stage Select', (game_width / 2) - (text_width / 2), game_height / 10);
    button_context.strokeText('Stage Select', (game_width / 2) - (text_width / 2), game_height / 10);
    button_context.font = 'bold ' + (game_height / 20).toString() + 'pt courier';
    button_context.strokeText('Simple Password: ' + simple_pass, (game_width / 2) - (text_width / 2), game_height - (game_height / 5));
    button_context.strokeText('Full Password: ' + full_pass, (game_width / 2) - (text_width / 2), game_height - (game_height / 20));
  }
}

function init_stage(stage_index)
{
  curr_stage = stage_index;
  get_file_from_server(stages[stage_index]['file'], load_stage);
}

function hero_dies()
{
  score = 0;
  if(curr_stage == 'custom')
  {
//    curr_stage = null;
//    init_title_screen();
    load_stage(custom_contents);
  }
  else
  {
    init_stage(curr_stage);
  }
}

function load_stage(stage_text)
{
  document.getElementById('files').setAttribute('style', 'z-index: -3');

  redo_game();

  drawables.push(new Background());

  the_hero = new Hero();
  drawables.push(the_hero);

  blockgroup = new BlockGroup();
  drawables.push(blockgroup);

  enemygroup = new EnemyGroup();
  drawables.push(enemygroup);

  buttons.push(new JumpButton());
  buttons.push(new ChargeButton());
  buttons.push(new PauseButton());

  var obj_list = stage_text.split("\n");

  for(var i = 0; i < obj_list.length; i++)
  {
    var obj_arr = obj_list[i].split(',');
    var quadrant = parseInt(obj_arr[0]);
    if(block_list[quadrant] == undefined)
    {
      block_list[quadrant] = {
        'drawn': false,
        'list': new Array(),
      };
      enemy_list[quadrant] = {
        'drawn': false,
        'list': new Array(),
      };
    }
    if(block_data[obj_arr[1]] != undefined)
    {
      block_list[quadrant]['list'].push({'x': parseInt(obj_arr[2]), 'y': parseInt(obj_arr[3]), 'type': obj_arr[1]});
    } else if(enemy_data[obj_arr[1]] != undefined)
    {
      enemy_list[quadrant]['list'].push({'x': parseInt(obj_arr[2]), 'y': parseInt(obj_arr[3]), 'type': obj_arr[1]});
    }
  }

  //draw objects off the bat
  create_objects(0);
  create_objects(1);

  //use a checkpoint
  if(checkpoint_x > 0)
  {
    score = 1;
    the_hero.x = checkpoint_x + the_hero.initial_x;
    scroll_x = checkpoint_x;
    context.translate(-1 * checkpoint_x, 0);
  }
}

//draw the user's touch
function draw_touch()
{
  for(var i = 0; i < touches.length; i++)
  {
    button_context.beginPath();
    button_context.arc(touches[i]['touch_x'], touches[i]['touch_y'], game_width / 20, 0, 2 * Math.PI);
    button_context.fillStyle = 'rgba(255, 255, 255, 0.5)';
    button_context.fill();
  }
}

/**
 * The animation loop. Calls the requestAnimationFrame shim to
 * optimize the game loop and draws all game objects. This
 * function must be a global function and cannot be within an
 * object.
 */
function animate()
{
  requestAnimFrame(animate);

  if(drawables.length == 0 && buttons.length == 0)
  {
    return;
  }

  //figure the quadrant to load
  curr_quadrant = Math.floor(scroll_x / 320);

/*
  if(repeat_quadrant != null && curr_quadrant > repeat_quadrant + 1)
  {
    for(var i = 0; i < blockgroup.blocks.length; i++)
    {
      blockgroup.blocks[i].x -= tile_size * quadrant_width * 4;
    }
    scroll_x -= tile_size * quadrant_width * 4;
    the_hero.x -= tile_size * quadrant_width * 4;
    context.translate(tile_size * quadrant_width * 4, 0);
    block_list[repeat_quadrant]['drawn'] = false;
    block_list[repeat_quadrant + 1]['drawn'] = false;
    block_list[repeat_quadrant + 2]['drawn'] = false;
    block_list[repeat_quadrant + 3]['drawn'] = false;
    block_list[repeat_quadrant - 1]['drawn'] = true;
    block_list[repeat_quadrant + 4]['drawn'] = false;
  }
*/

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

  //add any objects if necessary
  create_objects(curr_quadrant);

  //initialize the scroll speed (can be modified by the hero)
  scroll_speed = initial_scroll_speed;

  //clear the canvases before you do anything
  clear_canvases();

  if(debug != null)
  {
    button_context.lineWidth = 1;
    button_context.font = 'bold 12pt courier';
    button_context.strokeStyle = '#FFFFFF';
    button_context.strokeText(debug, 50, 50);
  }

  //always draw the user's touch
  draw_touch();

  //see if you got any button interactions
  for(var i = 0; i < buttons.length; i++)
  {
    buttons[i].collide();
    if(buttons[i] != undefined)
    {
      buttons[i].draw();
    }
  }

  //don't run the game if you're paused
  if(!paused)
  {
    //call everything's move() function
    for(var i = 0; i < drawables.length; i++)
    {
      drawables[i].move();
    }

    //call everything's collide() function
    for(var i = 0; i < drawables.length; i++)
    {
      drawables[i].collide();
    }

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
/*
          if(Math.abs(the_hero.x - the_hero.initial_x - scroll_x) > real_initial_scroll_speed)
          {
            scroll_speed = -1 * real_initial_scroll_speed;
          }
          else
          {
            scroll_speed = the_hero.x - the_hero.initial_x - scroll_x;
          }
*/
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

  }

  //call everything's draw() function
  for(var i = 0; i < drawables.length; i++)
  {
    drawables[i].draw();
  }

  if(curr_stage != null)
  {
    draw_score();
  }

}

//add to the score, figuring against the multiplier
//input: the amount to add
function add_score(amt)
{
  score += amt * multiplier;
  multiplier++;
  multiplier_timer = multiplier_timer_max;
}

//refresh the multiplier timer
function refresh_multiplier()
{
  multiplier_timer = multiplier_timer_max;
}

//figure out how to decay the multiplier
function figure_multiplier()
{
  //if a boss is present, don't fiddle with the multiplier
  if(boss_multiplier)
  {
      return;
  }

    if(multiplier_timer > 0)
    {
      multiplier_timer -= 1;
    }
    if(multiplier_timer <= 0 && multiplier > 1)
    {
      multiplier--;
      multiplier_timer = multiplier_timer_max;
    }
}

//draw the score and the multiplier
function draw_score()
{
    context.fillStyle = '#000000';
    button_context.lineWidth = game_height / 500;
    button_context.font = 'bold ' + (game_height / 10).toString() + 'pt courier';
    button_context.strokeStyle = '#000000';
    button_context.fillStyle = '#FFFFFF';
    button_context.fillText('Score: ' + score.toString(), inner_offset, 2 * (inner_ratio * my_height / 10));
    button_context.strokeText('Score: ' + score.toString(), inner_offset,  2 * (inner_ratio * my_height / 10));
    var color = Math.floor(255 * (multiplier_timer / multiplier_timer_max));
    button_context.fillStyle = 'rgba(' + color + ', ' + color + ', ' + color + ', 1)';
    button_context.fillText(' X ' + multiplier.toString(), game_width / 2, 2 * (inner_ratio * my_height / 10));
    button_context.strokeText(' X ' + multiplier.toString(), game_width / 2,  2 * (inner_ratio * my_height / 10));
}

//create objects based on what quadrant you see, delete old objects
//input: the current quadrant at the left edge of the screen
function create_objects(quadrant)
{
  //create objects for the prior quadrant, the current quadrant, and the next two quadrants
  for(var i = quadrant - 1; i <= quadrant + 2; i++)
  {
    if(block_list[i] != undefined && !block_list[i]['drawn'])
    {
      create_blocks(block_list[i]['list'], i * quadrant_width, i);
      block_list[i]['drawn'] = true;
    }
    if(enemy_list[i] != undefined && !enemy_list[i]['drawn'])
    {
      create_enemies(enemy_list[i]['list'], i * quadrant_width, i);
      enemy_list[i]['drawn'] = true;
    }
  }

  //delete old objects
  var del_quadrant = quadrant - 2;
  if(block_list[del_quadrant] != undefined && block_list[del_quadrant]['drawn'])
  {
    delete_blocks(del_quadrant);
    block_list[del_quadrant]['drawn'] = false;
  }

  if(enemy_list[del_quadrant] != undefined && enemy_list[del_quadrant]['drawn'])
  {
    delete_enemies(del_quadrant);
    enemy_list[del_quadrant]['drawn'] = false;
  }
}

//delete the blocks in a quadrant
//input: the quadrant
function delete_blocks(quadrant)
{
  for(var i = 0; i < blockgroup.blocks.length; i++)
  {
    if(blockgroup.blocks[i] != undefined && blockgroup.blocks[i]['quadrant'] == quadrant)
    {
      blockgroup.blocks.splice(i, 1);
      i--;
    }
  }
}

//delete the enemies in a quadrant
//input: the quadrant
function delete_enemies(quadrant)
{
  for(var i = 0; i < enemygroup.enemies.length; i++)
  {
    if(enemygroup.enemies[i] != undefined && enemygroup.enemies[i]['quadrant'] == quadrant)
    {
      enemygroup.enemies.splice(i, 1);
      i--;
    }
  }
}


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

function create_blocks(list, offset, quadrant)
{
  for(var i = 0; i < list.length; i++)
  {
    if(repeat_quadrant == null || list[i]['type'] != 'miniboss_trigger')
    {
      var new_block = block_data[list[i]['type']]['constructor'](list[i]['x'] + offset, list[i]['y'], quadrant);
      blockgroup.push(new_block);
    }
  }
}

function create_enemies(list, offset, quadrant)
{
  for(var i = 0; i < list.length; i++)
  {
    var new_enemy = enemy_data[list[i]['type']]['constructor'](list[i]['x'] + offset, list[i]['y'], quadrant);
    enemygroup.push(new_enemy);
  }
}

function clear_canvases()
{
  //clear the button canvas
  if(button_canvas.width > button_canvas.height)
  {
    var clear_width = button_canvas.width;
  }
  else
  {
    var clear_width = button_canvas.height;
  }
//  button_context.clearRect(0, 0, clear_width, clear_width);
  button_context.clearRect(0, 0, 10000, 10000);

  //clear the game canvas
  if(canvas.width > canvas.height)
  {
    var clear_width = canvas.width;
  }
  else
  {
    var clear_width = canvas.height;
  }
  context.clearRect(0, 0, 1000, 1000);

  //draw over borders of game canvas
  button_context.fillStyle = '#000000';
  button_context.fillRect(0, 0, inner_offset, clear_width);
  button_context.fillRect(clear_width - inner_offset, 0, inner_offset, clear_width);
}

function StageButton(stage_index, x, y, diameter, font_size)
{
  this.index = stage_index;
  this.x = x;
  this.y = y;
  this.diameter = diameter;
  this.font_size = font_size;
  this.name = stages[this.index]['name'];
  if(stages[this.index]['done'])
  {
    this.color = '#AAAAAA';
  }
  else
  {
    this.color = '#FFFFFF';
  }

  //how would i do this?
  this.find_position = function()
  {

  }

  this.collide = function()
  {
    if(!stages[this.index]['done'] && button_collide(this.x, this.y, this.diameter, this.diameter))
    {
      init_stage(this.index);
    }
  }

  this.draw = function()
  {
    button_context.beginPath();
    button_context.arc(this.x, this.y, this.diameter, 0, 2 * Math.PI);
    button_context.fillStyle = 'rgba(0, 0, 0, 1)';
    button_context.fill();
    button_context.fillStyle = 'rgba(0, 0, 255, 0.5)';
    button_context.fill();

    button_context.font = 'bold ' + this.font_size.toString() + 'pt courier';
    button_context.lineWidth = game_height / 100;

    var text_width = button_context.measureText(this.name).width;

    button_context.strokeStyle = '#000000';
    button_context.strokeText(this.name, this.x - (text_width / 2), this.y); // - (this.font_size / 2));

    button_context.fillStyle = this.color;
    button_context.fillText(this.name, this.x - (text_width / 2), this.y); // - (this.font_size / 2));
  }
}

//determines if you are pressing a button
//input: the x position of the button
//  the y position of the button
//  the width of the button
//  the height of the button
//output: a boolean, true for touched and false for not
//note that this also reads touch_x, touch_y, and touch_on_off, which are globals set by event listeners
function button_collide(button_x, button_y, button_width, button_height)
{
  for(var i = 0; i < touches.length; i++)
  {
    var touch_x = touches[i]['touch_x'];
    var touch_y = touches[i]['touch_y'];
    if(touch_x >= button_x - button_width &&
      touch_x <= button_x + button_width &&
      touch_y >= button_y - button_height &&
      touch_y <= button_y + button_height)
    {
      return true;
    }
  }
  return false;
}

//stolen from http://stackoverflow.com/questions/13329853/reading-server-file-with-javascript
function get_file_from_server(url, done_callback)
{
  var xhr;

  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = handleStateChange;
  xhr.open('GET', 'http://www.vgthought.com/triggerfinger/' + url + '?cb=' + new Date().getTime(), true);
  //xhr.open('GET', url, true);
  xhr.send();

  function handleStateChange() {
    if (xhr.readyState === 4) {
      done_callback(xhr.status == 200 ? xhr.responseText : null);
    }
  }
}

https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }

}

//load a custom stage from a file
function load_custom_stage()
{
  document.getElementById('files').click();
}

function parse_custom_stage(evt)
{
  //unfocus the load button
  document.activeElement.blur();

  var files = evt.target.files;
  var reader = new FileReader();

  // Closure to capture the file information.
  reader.onload = (function(theFile)
  {
    return function(e)
    {
      curr_stage = 'custom';
      custom_contents = reader['result'];
      load_stage(reader['result']);
    };
  })(files[0]);

  reader.readAsText(files[0]);
}

//6 bits:
//one for each stage done
function translate_simple_password(password)
{
  if(password.length < 2)
  {
    return;
  }

  //bits_1 represents the first three bits of the password, bits_2 the second three
  var bits_1 = parseInt(password.toString().charAt(0), 8).toString(2);
  var bits_2 = parseInt(password.toString().charAt(1), 8).toString(2);

  //bits_1 must be three bits long, add 0s if you're missing bits
  while(bits_1.length < 3)
  {
    bits_1 = '0' + bits_1;
  }

  //same for bits_2
  while(bits_2.length < 3)
  {
    bits_2 = '0' + bits_2;
  }

  //if stage 3 is completed, the first three bits are reversed
  if(bits_2.charAt(0) == '0')
  {
    stages[0]['done'] = bits_1.charAt(0) == '1';
    stages[1]['done'] = bits_1.charAt(1) == '1';
    stages[2]['done'] = bits_1.charAt(2) == '1';
  }
  else
  {
    stages[0]['done'] = bits_1.charAt(0) == '0';
    stages[1]['done'] = bits_1.charAt(1) == '0';
    stages[2]['done'] = bits_1.charAt(2) == '0';
  }

  stages[3]['done'] = bits_2.charAt(0) == '1';
  stages[4]['done'] = bits_2.charAt(1) == '1';
  stages[5]['done'] = bits_2.charAt(2) == '1';
}

//6 lines:
//7 bits for stage score, 1 bit for whether the stage was cleared
function translate_full_password(password)
{
  var bits = '';
  var index = 0;
  var tmp_bits = '';

  if(password.length < 10)
  {
    return;
  }

  var char_to_interpret = '';
  for(var i = 0; i < password.length; i++)
  {
    char_to_interpret = password.charAt(i);

    //untranslate W to its normal character
    if(char_to_interpret == 'W')
    {
      char_to_interpret = 'O';
    }

    tmp_bits = parseInt(char_to_interpret, 32).toString(2);
    while(tmp_bits.length < 5)
    {
      tmp_bits = '0' + tmp_bits;
    }
    bits += tmp_bits;
  }

  //unjumble the password, someone mixed up the bits
  tmp_bits = '';
  var stage_bits = [
    '',
    '',
    '',
    '',
    '',
    '',
  ];
  for(var i = 0; i < 8; i++)
  {
    var tmp_bits = bits.substring(i * 6, (i + 1) * 6);
    for(var j = 0; j < 6; j++)
    {
      stage_bits[j] += tmp_bits.charAt(j);
    }
  }

  for(var i = 0; i < stages.length; i++)
  {
    //stage stuff
    if(i < stages.length)
    {
      stages[i]['score'] = parseInt(stage_bits[i].substring(0, 7), 2);
      stages[i]['done'] = stage_bits[i].substring(7) == '1';

      //for stages 1, 2, and 3, set the weapon
      if(i >= 1 && i <= 3)
      {
        weapons[i] = stages[i]['done'];
      }
    }
  }
}

function make_password()
{
  full_pass = '';
  simple_pass = '';
  var tmp_pass = '';

  for(var i = 0; i < stages.length; i++)
  {
    //first 7 bits are score, last bit is whether you beat the stage
    var score_bin = parseInt(stages[i]['score']).toString(2);

    //make sure the string is long enough
    while(score_bin.length < 7)
    {
      score_bin = '0' + score_bin;
    }

    if(stages[i]['done'])
    {
      score_bin += '1';
    }
    else
    {
      score_bin += '0';
    }

    //append this to the password
    tmp_pass += score_bin;
  }

  var transition_pass = '';

  //jumble the password so it looks cool
  for(var i = 0; i < 8; i++)
  {
    for(var j = 0; j < 6; j++)
    {
      var offset = j * 8;
      transition_pass += tmp_pass.charAt(offset + i);
    }
  }

  var word_chunk = '';
  var char_to_add = '';
  for(var i = 0; i < transition_pass.length; i += 5)
  {
    word_chunk = transition_pass.substring(i, i + 5);
    while(word_chunk.length < 5)
    {
      word_chunk += '0';
    }
    char_to_add = parseInt(word_chunk, 2).toString(32).toUpperCase();
    //don't allow Os
    if(char_to_add == 'O')
    {
      char_to_add = 'W';
    }

    //add a divider, like phone numbers
    if(full_pass.length == 3 || full_pass.length == 7)
    {
      full_pass += '-';
    }

    full_pass += char_to_add;
  }

  //simple password (two 3-bit characters)
  var simple_pass_1 = '';
  var simple_pass_2 = '';
  for(var i = 0; i < 3; i++)
  {
    //reverse bits when stage 3 is done
    if(stages[3]['done'])
    {
      if(stages[i]['done'])
      {
        simple_pass_1 += '0';
      }
      else
      {
        simple_pass_1 += '1';
      }
    }
    else
    {
      if(stages[i]['done'])
      {
        simple_pass_1 += '1';
      }
      else
      {
        simple_pass_1 += '0';
      }
    }
  }

  for(var i = 3; i < 6; i++)
  {
    if(stages[i]['done'])
    {
      simple_pass_2 += '1';
    }
    else
    {
      simple_pass_2 += '0';
    }
  }

  simple_pass = parseInt(simple_pass_1, 2).toString(8) + parseInt(simple_pass_2, 2).toString(8);
}

//https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events/Using_Pointer_Events

function handleStart(evt)
{
  evt.preventDefault();
  var new_touches = evt.changedTouches;

  for (var i = 0; i < new_touches.length; i++)
  {
    touches.push(copyTouch(new_touches[i]));
  }
}

function handleMove(evt) {
  evt.preventDefault();
  var new_touches = evt.changedTouches;

  for (var i = 0; i < new_touches.length; i++)
  {
    var idx = ongoingTouchIndexById(new_touches[i].identifier);

    if (idx >= 0)
    {
      touches.splice(idx, 1, copyTouch(new_touches[i]));  // swap in the new touch record
    }
  }
}

function handleCancel(evt) {
  evt.preventDefault();
  var new_touches = evt.changedTouches;
  
  for (var i = 0; i < new_touches.length; i++)
  {
    var idx = ongoingTouchIndexById(new_touches[i].identifier);
    touches.splice(idx, 1);  // remove it; we're done
  }
}

function handleEnd(evt) {
  evt.preventDefault();
  var new_touches = evt.changedTouches;

  for (var i = 0; i < new_touches.length; i++)
  {
    var idx = ongoingTouchIndexById(new_touches[i].identifier);

    if(idx >= 0)
    {
      touches.splice(idx, 1);  // remove it; we're done
    }
  }
}

function copyTouch(touch)
{
  var obj = {
    'identifier': touch.identifier,
  };
  if(screen_orientation == 'portrait')
  {
    obj['touch_x'] = touch['clientY'];
    obj['touch_y'] = game_height - touch['clientX'];
  }
  else
  {
    obj['touch_x'] = touch['clientX'];
    obj['touch_y'] = touch['clientY'];
  }
  return obj;
}

function ongoingTouchIndexById(idToFind)
{
  for (var i = 0; i < touches.length; i++)
  {
    var id = touches[i]['identifier'];

    if(id == idToFind)
    {
      return i;
    }
  }
  return -1;    // not found
}

var orientation_timer;
var window_height = document.getElementsByTagName('html')[0].clientHeight;;

var supportsOrientationChange = "onorientationchange" in window,
    orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

window.addEventListener(orientationEvent , function() {
  orientation_timer = setTimeout(function() {
    if(window_height != document.getElementsByTagName('html')[0].clientHeight)
    {
      resize_canvas();
      window_height = document.getElementsByTagName('html')[0].clientHeight;
      clearTimeout(orientation_timer);
    }
  }, 500);
});

/*
window.addEventListener("orientationchange", function() {
 orientationChanged().then(function() {
      resize_canvas();
    });
});

//https://stackoverflow.com/questions/12452349/mobile-viewport-height-after-orientation-change
function orientationChanged() {
  const timeout = 120;
  return new window.Promise(function(resolve) {
    const go = (i, height0) => {
      window.innerHeight != height0 || i >= timeout ?
        resolve() :
        window.requestAnimationFrame(() => go(i + 1, height0));
    };
}
*/
