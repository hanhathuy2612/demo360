import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

const TEXTURE_IMAGE = "assets/360NGOAITHAT.jpg"

@Component({
  selector: 'app-panorama',
  templateUrl: './panorama.html',
  styleUrls: ['./panorama.scss']
})
export class PanoramaComponent implements AfterViewInit, OnDestroy {
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private mesh!: THREE.Mesh;
  private container!: HTMLElement;

  ngAfterViewInit(): void {
    this.initThree();
    this.animate();
  }

  private initThree(): void {
    this.container = document.getElementById('viewer')!;
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 0.1);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enableZoom = true;
    this.controls.enablePan = true;
    this.controls.minDistance = 10;
    this.controls.maxDistance = 100;
    this.controls.rotateSpeed = -0.3;
    this.controls.minPolarAngle = Math.PI / 3;
    this.controls.maxPolarAngle = Math.PI * 2 / 3;

    const texture = new THREE.TextureLoader().load(TEXTURE_IMAGE);
    texture.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.SphereGeometry(50, 64, 48);
    geometry.scale(-1, 1, 1);

    const material = new THREE.MeshBasicMaterial({map: texture});
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);

    window.addEventListener('resize', () => this.onWindowResize());
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  ngOnDestroy(): void {
    this.renderer.dispose();
    this.scene.clear();
  }
}
