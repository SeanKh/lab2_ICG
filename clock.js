// Usual unitial setup of canvas, renderer, scene and camera
const canvas = document.getElementById("mycanvas");
const renderer = new THREE.WebGLRenderer({ canvas });
// renderer.setClearColor('rgb(255,255,255)');
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("#6e6e6e");
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(
  55,
  canvas.width / canvas.height,
  0.1,
  1000
);
cam.position.set(0, 7, 2);

cam.lookAt(scene.position); // camera looks at the origin

// Ambient Light for the scene
const ambientLight = new THREE.AmbientLight(0x909090);
scene.add(ambientLight);
const light = new THREE.DirectionalLight(0x444444);
light.position.set(1.5, 1, 1);
scene.add(light);

const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);
axesHelper.position.y = 1;

// All used variables are stored inside of object "variables", which is indicated below
const variables = {
  tickheight: 0.01,
  bigTick: {
    width: 0.07,
    length: 0.4
  },
  smallTick: {
    width: 0.04,
    length: 0.2
  },
  clock: {
    radius: 2,
    height: 0.1,
    radialSegments: 64,
    color: "#D3D3D3"
  },
  blob: {
    radius: 0.1,
    widthSegments: 32,
    heightSegments: 32
  },
  minuteHand: {
    name: "minute",
    radius: 0.05,
    widthSegments: 32,
    heightSegments: 32
  },
  hourHand: {
    name: "hour",
    radius: 0.05,
    widthSegments: 32,
    heightSegments: 32
  },
  secondsHand: {
    name: "seconds",
    width: 0.05,
    height: 0.1,
    depth: 0.15
  }
};

let clock1, clock2;

init();
loop();

//Add clock body, blob, clock hands
function init() {
  var geometry = new THREE.CylinderGeometry(
    variables.clock.radius,
    variables.clock.radius,
    variables.clock.height,
    variables.clock.radialSegments
  );
  var material = new THREE.MeshBasicMaterial({
    color: variables.clock.color
  });
  const clockBody = new THREE.Mesh(geometry, material);

  let n;
  for (n = 0; n < 60; n++) {
    let radiusToMultiply = 0;
    if (n === 30) {
      var geometry = new THREE.BoxGeometry(
        variables.bigTick.width,
        variables.tickheight,
        variables.bigTick.length
      );
      var material = new THREE.MeshBasicMaterial({ color: "lightblue" });
      var cube = new THREE.Mesh(geometry, material);
      radiusToMultiply = variables.clock.radius - variables.clock.radius / 10;
    } else if (n % 5 == 0) {
      var geometry = new THREE.BoxGeometry(
        variables.bigTick.width,
        variables.tickheight,
        variables.bigTick.length
      );
      var material = new THREE.MeshBasicMaterial({ color: "black" });
      var cube = new THREE.Mesh(geometry, material);
      radiusToMultiply = variables.clock.radius - variables.clock.radius / 10;
    } else {
      var geometry = new THREE.BoxGeometry(
        variables.smallTick.width,
        variables.tickheight,
        variables.smallTick.length
      );
      var material = new THREE.MeshBasicMaterial({ color: "black" });
      var cube = new THREE.Mesh(geometry, material);
      radiusToMultiply = variables.clock.radius - variables.clock.radius / 17;
    }
    cube.position.z =
      Math.sin(((90 - 6 * n) * Math.PI) / 180) * radiusToMultiply; // above center point of clock
    cube.position.y = 0.1; // height of tick, above clockBody
    cube.position.x = Math.sin((6 * n * Math.PI) / 180) * radiusToMultiply; // left|right move

    cube.rotation.y = (Math.PI / 180) * n * 6;

    clockBody.add(cube);

    var geometry = new THREE.SphereGeometry(
      variables.blob.radius,
      variables.blob.widthSegments,
      variables.blob.heightSegments
    );
    var material = new THREE.MeshBasicMaterial({ color: "darkred" });
    let blob = new THREE.Mesh(geometry, material);
    blob.position.y = 0.1;
    clockBody.add(blob);
    //scene.add(blob);

    var geometry = new THREE.SphereGeometry(
      variables.hourHand.radius,
      variables.hourHand.widthSegments,
      variables.hourHand.heightSegments
    );
    var material = new THREE.MeshBasicMaterial({ color: 0x00008b });
    let hourHand = new THREE.Mesh(geometry, material);
    hourHand.scale.z = 10;
    hourHand.position.y = 0.05; // above sphere
    hourHand.name = variables.hourHand.name;
    clockBody.add(hourHand);
    //scene.add(hourHand);

    var geometry = new THREE.SphereGeometry(
      variables.minuteHand.radius,
      variables.minuteHand.widthSegments,
      variables.minuteHand.heightSegments
    );
    var material = new THREE.MeshBasicMaterial({ color: 0x00008b });
    let minuteHand = new THREE.Mesh(geometry, material);
    minuteHand.scale.z = 16;
    minuteHand.position.y = 0.05; // above sphere
    minuteHand.name = variables.minuteHand.name;
    clockBody.add(minuteHand);
    //scene.add(minuteHand);

    var geometry = new THREE.BoxGeometry(
      variables.secondsHand.width,
      variables.secondsHand.height,
      variables.secondsHand.depth
    );
    var material = new THREE.MeshBasicMaterial({ color: "#565656" });
    let secondsHand = new THREE.Mesh(geometry, material);
    secondsHand.scale.z = 11;
    secondsHand.position.y = 0.1; // above sphere
    secondsHand.name = variables.secondsHand.name;
    clockBody.add(secondsHand);
    //scene.add(secondsHand);

    // dimensions
    const radius = variables.clock.radius;
    const height = 0.1;
    const thickness = 0.1;
    // create ring using LatheGeometry
    // Step 1: create rectangle
    const points = new Array(5);
    points[0] = new THREE.Vector2(radius, 0);
    points[1] = new THREE.Vector2(radius, height);
    points[2] = new THREE.Vector2(radius + thickness, height);
    points[3] = new THREE.Vector2(radius + thickness, 0);
    points[4] = new THREE.Vector2(radius, 0);
    // Step: create geometry by rotating rectangle around y axis
    const ringGeo = new THREE.LatheGeometry(points, 200);
    ringGeo.computeFlatVertexNormals(); // needed for correct interaction with light

    // create Mesh:
    let ringMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color("lightblue"),
      side: THREE.DoubleSide
    });
    let ring = new THREE.Mesh(ringGeo, ringMat);
    clockBody.add(ring);

    clock1 = clockBody;

    positionHands(clock1);
    scene.add(clock1);
  }
}

function positionHands(clocks) {
  const hourHand = clocks.getObjectByName(variables.hourHand.name);
  const minuteHand = clocks.getObjectByName(variables.minuteHand.name);
  const secondsHand = clocks.getObjectByName(variables.secondsHand.name);

  let currentTime = new Date();
  let hours = currentTime.getHours() % 12;

  hourHand.position.x =
    (Math.sin((hours * 30 * Math.PI) / 180) * variables.clock.radius) / 4;
  hourHand.position.z =
    (-Math.sin(((90 - 30 * hours) * Math.PI) / 180) * variables.clock.radius) /
    4; // left || right

  hourHand.rotation.y = ((-2 * Math.PI) / 360) * hours * 30;
  // console.log(hours);

  let minutes = currentTime.getMinutes();
  minuteHand.position.x =
    (Math.sin((minutes * 6 * Math.PI) / 180) * variables.clock.radius) / 2.5;
  minuteHand.position.z =
    (-Math.sin(((90 - 6 * minutes) * Math.PI) / 180) * variables.clock.radius) /
    2.5; // left || right

  minuteHand.rotation.y = ((-2 * Math.PI) / 360) * minutes * 6;
  // console.log(minutes);

  let seconds = currentTime.getSeconds();
  secondsHand.position.x =
    (Math.sin((seconds * 6 * Math.PI) / 180) * variables.clock.radius) / 2.5;
  secondsHand.position.z =
    (-Math.sin(((90 - 6 * seconds) * Math.PI) / 180) * variables.clock.radius) /
    2.5; // left || right

  secondsHand.rotation.y = ((-2 * Math.PI) / 360) * seconds * 6;
  // console.log(minutes);
  setTimeout("positionHands(clock1)", 1000);
}

// Draw everything
const controls = new THREE.TrackballControls(cam, canvas);
function render() {
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, cam);
}
//positionHands(clock1);
render();
