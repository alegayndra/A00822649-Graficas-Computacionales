// Clase para guardar todo lo relacionado con cada planeta
class Planet {
    /*
        Constructor de la clase
        Entrada:
        - planet:           Planeta en sí       
        - moons:            Arreglo que contiene todas las lunas del planeta
        - rotationAngle:    Velocidad a la que se estará rotando el planeta
        - orbit:            Circulo que muestra la orbita del planeta
        - translation:      Velocidad a la que el planeta se trasladara en su orbita
        - extra:            Objeto extra utlizado para cualquier cosa única de los planetas (ejemplo: el anillo de asteroides de Saturno)
    */
    constructor(planet, moons, rotationAngle, orbit, translation, extra) {
        // Asigna los argumentos recibidos 
        this.planet = planet;
        this.moons = moons;
        this.rotationAngle = rotationAngle;
        this.orbit = orbit;
        this.translation = translation;

        // Crea dos Object3D para los centros del planeta
        this.center = new THREE.Object3D();         // Está en la posición del sol
        this.planetCenter = new THREE.Object3D();   // Está en la misma posición que el planeta. Sirve para que el anillo de asteorides de Saturno no gire.

        // Coloca el planetCenter donde se encuentra el planeta
        this.planetCenter.position.x = this.planet.position.x;
        this.planetCenter.position.z = this.planet.position.z;

        // El planeta será hijo del planetCenter, por lo que lo queremos en el centro de este
        this.planet.position.x = 0;
        this.planet.position.z = 0;

        // Agrega todas las lunas al planeta
        this.moons.forEach(moon => {
            this.planet.add(moon);
        });

        // Agrega el planeta al planetCenter
        this.planetCenter.add(this.planet);

        // Checa si existe el extra
        // Si existe, lo agrega al planetCenter
        if (extra) {
            this.extra = extra;
            this.planetCenter.add(extra);
        }

        // Checa si existe la orbita (por el sol)
        // Si existe, la agrega al center
        if (this.orbit) {
            this.center.add(orbit);
        }

        // Agrega el planetCenter al center para que todos sean hijos del center
        this.center.add(this.planetCenter);
    }

    /*
        Rota los planetas y las lunas
        Entrada:
        - fract: valor que determina cuanto debe rotar las cosas en este frame
    */
    animate(fract) {
        // Checa si hay angulo de rotación
        // Si hay de rotación, rota el planeta y las lunas
        if (this.rotationAngle) {
            this.planet.rotation.y += this.rotationAngle * fract;
            this.moons.forEach(moon => {
                moon.rotation.y += this.rotationAngle * fract;
            });
        }

        // Checa si hay angulo de traslación
        // Si hay traslación, rota el centro del planeta que está en el sol y hace que el planeta se mueva en su orbita
        if (this.translation) {
            this.center.rotation.y += this.translation * fract;
        }

    }
}