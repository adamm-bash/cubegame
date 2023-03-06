import * as THREE from 'three'
import gsap from 'gsap'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Base
 */
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
const gridHelper = new THREE.GridHelper(20, 20);
scene.add( gridHelper );
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const mainc = new THREE.Mesh(geometry, material)
mainc.position.set(0, 0, 0)
scene.add(mainc)

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 10
camera.position.x = 0
camera.position.y = 4
camera.lookAt(mainc.position)
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

/**
 * Animate
 */
let playerDead = false
class enemy {
    constructor(side)
    {
        if(side == 1)
        {
            console.log("side 1")
            this.orPos = -6
            this.tempPos = -2
            this.finalPos = -1
        }
        if(side == 2)
        {
            console.log("side 2")
            this.orPos = 6
            this.tempPos = 2
            this.finalPos = 1

        }
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        this.enemyBox = new THREE.Mesh(geometry, material)

        this.isDead = false
    }
    getPhysicalForm()
    {
        return this.enemyBox;
    }
    getOrPos()
    {
        return this.orPos;
    }
    getTempPos()
    {
        return this.tempPos;
    }
    getFinalPos()
    {
        return this.finalPos
    }
    kill()
    {
        this.isDead = true;
    }
    areTheyDead()
    {
      return this.isDead;
    }

}

function createEnemy(side)
{
    let newEn = new enemy(side)
    scene.add(newEn.getPhysicalForm())
    newEn.getPhysicalForm().position.set(newEn.getOrPos(), 0, 0)
    renderer.render(scene, camera)
    return newEn;
}
function tick()
{
    // console.log(enemy.position.x - mainc.position.x)
    // Render
    renderer.render(scene, camera)
    // Call tick again on the next frame
  
    window.requestAnimationFrame(tick)
}

function attack(enemy)
{

gsap.to(enemy.getPhysicalForm().position, {duration: 2, delay: 0, x: enemy.getTempPos(), 
    onComplete()
    {
        enemy.getPhysicalForm().material.color.setHex(0x0000ff)
        gsap.to(enemy.getPhysicalForm().position, {duration: 2, delay: 0, x: enemy.getFinalPos(), 
        onComplete()
        {
            console.log(enemy.areTheyDead())
            if(enemy.areTheyDead() == false)
            {
                playerDead = true
                document.getElementById("cont1").style.visibility="hidden";
                document.getElementById("cont2").style.visibility="visible";             }
            else
            {
                let newRand = Math.floor((Math.random() * 2) + 1)
                console.log(newRand)
                attack(createEnemy(newRand))
            }
            
        },})
        document.addEventListener("click", () => {
            if(playerDead == false)
            {
            gsap.killTweensOf(enemy.getPhysicalForm().position)
            enemy.getPhysicalForm().parent.remove(enemy.getPhysicalForm())
            enemy.kill();
            let newRand = Math.floor((Math.random() * 2) + 1)
            console.log(newRand)
            attack(createEnemy(newRand))
            }
        }, { once: true });
    },
})
tick()
tick()
}
attack(createEnemy(2))


/*for(let i = 0; playerDead == false; i += 1000)
    {
        //setTimeout(() => { attack(createEnemy(2));}, 10000);

    }
*/



