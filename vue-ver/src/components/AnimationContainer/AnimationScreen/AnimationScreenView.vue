<template>
        <div class="viewer" :id="'viewer-'+screenId">
        </div>
</template>

<script>
import * as THREE from 'three/build/three.module.js'
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default {
    name:"ScreenViewer",
    props:{
        screenId:{
            required:true
        },
        filename:{
            type:String,
            required:true
        }
    },
    data:{
		canvas:null,
		camera:null,
		scene:null,
		rednerer:null,
		light:null,
		mixer:null,
		controls:null,
		clock:null,
	},
	methods:{
		loadClock:function(){
			this.clock = new THREE.Clock();
		},
		loadCanvas:function(parentsElement){
			this.canvas = document.createElement('div');
			parentsElement.appendChild(this.canvas)
		},
		loadCamera:function(parentsElement){
			this.camera = new THREE.PerspectiveCamera( 45, parentsElement.offsetWidth / parentsElement.offsetHeight, 1, 2000 );
			this.camera.position.set( 100, 200, 300 );
		},
		loadScene:function(){
			this.scene = new THREE.Scene();
			this.scene.background = new THREE.Color( 0xa0a0a0 );
			this.scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );
		},
		loadLight:function(){
			if(this.scene == null){consoel.log("scene null"); return;}
			var light;
			light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
			light.position.set( 0, 200, 0 );
			this.scene.add( light );

			light = new THREE.DirectionalLight( 0xffffff );
			light.position.set( 0, 200, 100 );
			light.castShadow = true;
			light.shadow.camera.top = 180;
			light.shadow.camera.bottom = - 100;
			light.shadow.camera.left = - 120;
			light.shadow.camera.right = 120;
			this.scene.add( light );
		},
		loadGround:function(){
			if(this.scene == null){consoel.log("scene null"); return;}
			var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
			mesh.rotation.x = - Math.PI / 2;
			mesh.receiveShadow = true;
			this.scene.add( mesh );

			var grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
			grid.material.opacity = 0.2;
			grid.material.transparent = true;
			this.scene.add( grid );
		},
		loadModel:function(filename){
			if(this.scene == null){consoel.log("scene null"); return;}
			let self = this
			var loader = new FBXLoader();
			loader.load( filename, function ( object ) {
				self.mixer = new THREE.AnimationMixer( object );
				console.log(object)

				var action = self.mixer.clipAction( object.animations[ 0 ] );
				action.play();

				object.traverse( function ( child ) {

					if ( child.isMesh ) {

						child.castShadow = true;
						child.receiveShadow = true;

					}

				} );

				self.scene.add( object );
				// add skeleton
				var skeleton = new THREE.SkeletonHelper( object);
				skeleton.visible =true;
				self.scene.add(skeleton);
				console.log(skeleton);
				console.log(skeleton.boneInverses);
			} );
		},
		loadRenderer:function(parentsElement){
			if(this.scene == null){consoel.log("scene null"); return;}
			if(this.camera == null){consoel.log("camera null"); return;}
			if(this.canvas == null){consoel.log("canvas null"); return;}

			this.renderer = new THREE.WebGLRenderer( { antialias: true } );
			this.renderer.setPixelRatio(window.devicePixelRatio);
			this.renderer.setSize(parentsElement.offsetWidth, parentsElement.offsetHeight);
			this.renderer.shadowMap.enabled = true;
			this.canvas.appendChild(this.renderer.domElement);

			this.controls = new OrbitControls(this.camera, this.renderer.domElement);
			this.controls.target.set(0,100,0);
			this.controls.update();

			let self = this
			function onWindowResize() {
				self.camera.aspect =  parentsElement.offsetWidth/ parentsElement.offsetHeight;
				self.camera.updateProjectionMatrix();

				self.renderer.setSize( parentsElement.offsetWidth ,parentsElement.offsetHeight );
			}

			window.addEventListener( 'resize', onWindowResize, false );
		},
		startAnimate:function(){
				requestAnimationFrame( this.startAnimate );
				var delta = this.clock.getDelta();

				if ( this.mixer ) this.mixer.update( delta );

				this.renderer.render( this.scene, this.camera );
		},
		screenInit:function(){
			const parentsId = "viewer-"+ this.screenId
			const filename = this.filename

			let parentsElement = document.getElementById(parentsId)
			this.loadClock()
			this.loadCanvas(parentsElement)
			this.loadCamera(parentsElement)
			this.loadScene()
			this.loadLight()
			this.loadGround()
			this.loadModel(filename)
			this.loadRenderer(parentsElement)
		}
	},
    mounted(){
		this.screenInit()
		this.startAnimate()
    }
}
</script>

<style lang="scss" scoped>
.viewer{
    background-color:red;
    height:100%;
    width:100%;
}
</style>