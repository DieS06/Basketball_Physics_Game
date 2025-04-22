import Engine from '../Core/Engine.js'

import * as THREE from 'three'

export default class Board_Ring {
    constructor(){
        this.engine = new Engine()
        this.scene = this.engine.scene
        this.resources = this.engine.resources
        this.debug = this.engine.debug
        this.scoreZone = null;
      

        //DEBUG SETUP
        if(this.debug.active){
            this.debugFolder = this.debug.ui.addFolder('Board_Ring')
            this.debugFolder = this.debug.ui.addFolder('Target_Board_Ring')
        }

        this.resource = this.resources.items.ringModel
        this.resorce = this.resources.items.targetModel

        this.setModel()
        
        
        
    }
    setModel(){
        this.model = this.resource.scene
        this.model.position.set(0, 0.01, 0)
       // this.model.position.set(0, 2.5, 0)
        this.scene.add(this.model)

        this.model.traverse((child) =>{
            if(child.isMesh){
                child.castShadow = true
                child.receiveShadow = true
            }
        })
        

        this.setBoungindBox()
        this.createScoreTrigger()

        
    }

    //  setBoungindBox(){
    //         this.boundingBox = new THREE.Box3().setFromObject(this.model)
    //         this.boundingBoxHelper = new THREE.Box3Helper(this.boundingBox, 0xff0000)
    //         this.scene.add(this.boundingBoxHelper)
    //     }

    setBoungindBox() {
        this.boundingBox = new THREE.Box3().setFromObject(this.model);
    
        // 🔽 Shrink bounding box manually
        const shrink = 0.1; // adjust as needed
        const center = this.boundingBox.getCenter(new THREE.Vector3());
        const size = this.boundingBox.getSize(new THREE.Vector3());
    
        size.x -= shrink;
        size.y -= shrink;
        size.z -= shrink;
    
        this.boundingBox.setFromCenterAndSize(center, size);
    
        this.boundingBoxHelper = new THREE.Box3Helper(this.boundingBox, 0xff0000);
        this.scene.add(this.boundingBoxHelper);
    }
    

        createScoreTrigger() {
            const triggerGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.04, 32);
            const triggerMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.3 });
            this.scoreZone = new THREE.Mesh(triggerGeo, triggerMat);
        
            // Match the ring's position
            this.model.updateMatrixWorld();
            const ringPos = new THREE.Vector3();
            this.model.getWorldPosition(ringPos);
        
            this.scoreZone.position.copy(ringPos);
            this.scoreZone.position.y -= 0.03; // Just slightly below the ring opening
        
            this.scene.add(this.scoreZone);
        }
        
        

        update(){
            if(this.boundingBox && this.boundingBoxHelper){
                this.boundingBox.setFromObject(this.model)
            }
        }
}