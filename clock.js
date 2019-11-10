// Usual unitial setup of canvas, renderer, scene and camera
const canvas=document.getElementById("mycanvas");
const renderer=new THREE.WebGLRenderer({canvas});
//renderer.setClearColor('rgb(255,255,255)');
renderer.setClearColor('black');
const scene=new THREE.Scene();
const cam = new THREE.PerspectiveCamera(90, canvas.width / canvas.height,
  0.1, 1000);
cam.position.z = 4;
cam.position.y = 4;
cam.lookAt(scene.position);   // camera looks at the origin

//Ambient Light for the scene
const ambientLight = new THREE.AmbientLight(0x909090);
scene.add(ambientLight);
const light = new THREE.DirectionalLight(0x444444);
light.position.set( 1.5,1,1 );
scene.add(light);

var axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);
axesHelper.position.y=1;
//All used variables are stored inside of object "variables", which is indicated below
const variables={
  clockRadius:2,
}

var geometry = new THREE.CylinderGeometry( variables.clockRadius, variables.clockRadius, 0.1, 64 );
var material = new THREE.MeshBasicMaterial( {color: 0xD3D3D3} );
var cylinder = new THREE.Mesh( geometry, material );
scene.add( cylinder );

var geometry = new THREE.BoxGeometry( 0.1, 0.1, 0.2 );
var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  
var n;
for(n=0;n<60;n++){
  var cube = new THREE.Mesh( geometry, material );
  
  cube.add(new THREE.AxesHelper(1.0));  // Global coordinate system

  //cube.position.z=-1.8+(1.8*n/5); // above center point of clock
  cube.position.z = Math.sin(( 90 - (6 * n) ) * Math.PI/180) * variables.clockRadius; // above center point of clock
  cube.position.y=0.1; // height of tick, above cylinder
  //cube.position.x=(cube.position.x + 2*(n/5)); // left|right move
  cube.position.x = Math.sin(6 * n * Math.PI/180) * variables.clockRadius; // left|right move

  cube.rotation.y = Math.PI/180*n*6;
  
  cylinder.add( cube );
  
}

const mycb = function(event) {
    event.preventDefault();
    
    //Left arrow key is pressed
    if(event.button===0) {
  
    }
    
    
  };
  document.addEventListener('keydown', mycb);
  document.addEventListener('keyup', function() {} );


// Draw everything
const controls = new THREE.TrackballControls( cam, canvas);
function render() {
  requestAnimationFrame(render);

  controls.update();
  renderer.render(scene, cam);
}
render();