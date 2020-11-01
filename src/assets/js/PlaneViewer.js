'use strict';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


export class PlaneViewer {
    constructor() {
        this.aspectRatio = 1;

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            autoClear: true
        });
        this.renderer.setClearColor(0x050505);

        this.cameraDefaults = {
            posCamera: new THREE.Vector3(0.0, 5.0, 50.0),
            posCameraTarget: new THREE.Vector3(0, 0, 0),
            near: 0.1,
            far: 10000,
            fov: 45
        };
        this.clock = new THREE.Clock();
        this.track = false;
        this.cameraTarget = this.cameraDefaults.posCameraTarget;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(this.cameraDefaults.fov, this.aspectRatio, this.cameraDefaults.near, this.cameraDefaults.far);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        var ambientLight = new THREE.AmbientLight(0x404040);
        var directionalLight1 = new THREE.DirectionalLight(0xC0C090);
        var directionalLight2 = new THREE.DirectionalLight(0xC0C090);

        directionalLight1.position.set(-10, -5, 10);
        directionalLight2.position.set(10, 5, -10);

        this.scene.add(directionalLight1);
        this.scene.add(directionalLight2);
        this.scene.add(ambientLight);

        var helper = new THREE.GridHelper(20, 20, 0xFF4444, 0x404040);
        this.scene.add(helper);

        this.planes = new THREE.Group();
        this.scene.add(this.planes);
        this.plane = {};

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.zoomMouse = 0;
        this.planeActivated = "";

        this.animation = {
            enabled: false,
            cameraPosition: [],
            cameraZoom: [],
            cameraTarget: [],
            duration: 1.0,
        };
    }

    init(elementToBindTo) {
        this.elmt = elementToBindTo;
        elementToBindTo.appendChild(this.renderer.domElement);
    }

    createGroup(registration) {
        this.plane[registration] = new THREE.Group();
        this.labels = new THREE.Group();
        this.plane[registration].add(this.labels);
        this.planes.add(this.plane[registration]);
    }

    load(url, registration) {
        this.resetCamera();
        if (this.planeActivated) {
            this.plane[this.planeActivated].visible = false;
        }
        if (registration in this.plane) {
            this.plane[registration].visible = true;
        } else {
            this.plane[registration] = new THREE.Group();
            this.labels = new THREE.Group();
            this.plane[registration].add(this.labels);
            this.planes.add(this.plane[registration]);
            this.planeActivated = registration;
            var extension = url.split('.').pop();
            var loader;
            if (extension === 'json') {
                loader = new THREE.ObjectLoader();
                loader.load(url, obj => this.plane[registration].add(obj));

            } else if (extension === 'gltf' || extension == 'glb') {
                loader = new GLTFLoader();
                loader.load(url, obj => this.plane[registration].add(obj.scene));
            }
        }
        this.planeActivated = registration;
        this.resizeDisplayGL();
    }

    selectLabel(nameSphere) {
        var sphere = this.labels.getObjectByName(nameSphere);
        sphere.scale.x = 2;
        sphere.scale.y = 2;
        sphere.scale.z = 2;
    }

    deSelectLabel(nameSphere) {
        var sphere = this.labels.getObjectByName(nameSphere);
        sphere.scale.x = 1;
        sphere.scale.y = 1;
        sphere.scale.z = 1;
    }

    removeAllLabels(registration) {
        this.plane[registration].remove(this.labels);
        this.labels = new THREE.Group();
        this.plane[registration].add(this.labels);
    }

    drawSphere(x, y, z, hexColor, radius = 0.04) {
        var geometry = new THREE.SphereGeometry(radius);
        var material = new THREE.MeshBasicMaterial({ color: hexColor });
        var sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(x, y, z);
        return sphere
    }

    drawCursor(registration, x, y, z, hexColor) {
        var cursor = this.drawSphere(x, y, z, hexColor);
        this.plane[registration].add(cursor);
        return cursor;
    }

    changeColorLabel(nameSphere, color) {
        var sphere = this.labels.getObjectByName(nameSphere);
        if (sphere) {
            sphere.material.color.set(color);
            return true;
        } else {
            return false;
        }
    }

    visibleLabel(label) {
        var sphere = this.labels.getObjectByName(label);
        if (sphere) {
            sphere.visible = true;
            return true;
        } else {
            return false;
        }
    }

    unvisibleLabels() {
        this.labels.children.forEach(label => {
            label.visible = false;
        });
    }

    drawLabel(name, x, y, z, color) {
        var sphere = this.drawSphere(x, y, z, color);
        sphere.name = name;
        this.labels.add(sphere);
        return sphere;
    }

    onMouseClick(event) {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        if (event.type == "click" && event.button == 0) {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        } else if (event.type == "touchend" && event.changedTouches.length == 1) {
            this.mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;
        } else {
            return null;
        }
        this.raycaster.setFromCamera(this.mouse, this.camera)
        var intersects = this.raycaster.intersectObjects(this.plane[this.planeActivated].children, true);
        if (intersects.length > 0) return intersects[0];
        else return null;
    }

    moveTo(camera, fromCamera = this.getCamera()) {
        this.animation.cameraPosition = [fromCamera.position.x, fromCamera.position.y, fromCamera.position.z, camera.xpos, camera.ypos, camera.zpos];
        this.animation.cameraZoom = [fromCamera.zoom, camera.zoom];
        this.animation.cameraTarget = [fromCamera.target.x, fromCamera.target.y, fromCamera.target.z, camera.xtarget, camera.ytarget, camera.ztarget];
        this.animation.enabled = true;
    }

    resizeDisplayGL() {
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.aspectRatio = (this.elmt.offsetHeight === 0) ? 1 : this.elmt.offsetWidth / this.elmt.offsetHeight;
        this.updateCamera();
    }

    resetCamera() {
        this.camera.position.copy(this.cameraDefaults.posCamera);
        this.cameraTarget.copy(this.cameraDefaults.posCameraTarget);
        this.updateCamera();
    }

    getCamera() {
        return {
            target: this.controls.target,
            position: this.camera.position,
            zoom: this.camera.zoom
        }
    }

    setCamera(xpos, ypos, zpos, xtarget, ytarget, ztarget, zoom) {
        this.controls.target.set(xtarget, ytarget, ztarget);
        this.camera.zoom = zoom;
        this.camera.position.set(xpos, ypos, zpos);
        this.updateCamera();
    }

    updateCamera() {
        this.camera.aspect = this.aspectRatio;
        this.camera.lookAt(this.cameraTarget);
        this.camera.updateProjectionMatrix();
    }

    render() {
        if (this.animation.enabled) {
            var delta = this.clock.getElapsedTime();
            if (delta >= this.animation.duration) {
                delta = this.animation.duration;
            };
            var xpos = (this.animation.cameraPosition[3] - this.animation.cameraPosition[0]) * delta / this.animation.duration + this.animation.cameraPosition[0];
            var ypos = (this.animation.cameraPosition[4] - this.animation.cameraPosition[1]) * delta / this.animation.duration + this.animation.cameraPosition[1];
            var zpos = (this.animation.cameraPosition[5] - this.animation.cameraPosition[2]) * delta / this.animation.duration + this.animation.cameraPosition[2];
            var xtarget = (this.animation.cameraTarget[3] - this.animation.cameraTarget[0]) * delta / this.animation.duration + this.animation.cameraTarget[0];
            var ytarget = (this.animation.cameraTarget[4] - this.animation.cameraTarget[1]) * delta / this.animation.duration + this.animation.cameraTarget[1];
            var ztarget = (this.animation.cameraTarget[5] - this.animation.cameraTarget[2]) * delta / this.animation.duration + this.animation.cameraTarget[2];
            var zoom = (this.animation.cameraZoom[1] - this.animation.cameraZoom[0]) * delta / this.animation.duration + this.animation.cameraZoom[0];
            this.setCamera(xpos, ypos, zpos, xtarget, ytarget, ztarget, zoom);
            if (delta >= this.animation.duration) {
                this.animation.enabled = false;
                this.clock.stop();
                this.clock.autoStart = true;
            }
        }
        this.renderer.render(this.scene, this.camera);
    }
}
