class Planet {
    constructor(planet, center, moons, rotationAngle, orbit, translation, extra) {
        this.planet = planet;
        this.center = center;
        this.moons = moons;
        this.rotationAngle = rotationAngle;
        this.orbit = orbit;
        this.translation = translation;
        this.planetCenter = new THREE.Object3D();

        this.planetCenter.position.x = this.planet.position.x;
        this.planetCenter.position.z = this.planet.position.z;

        this.planet.position.x = 0;
        this.planet.position.z = 0;

        this.moons.forEach(moon => {
            this.planet.add(moon);
        });

        this.planetCenter.add(this.planet);

        if (extra) {
            this.extra = extra;
            this.planetCenter.add(extra);
        }

        if (this.orbit) {
            this.center.add(orbit);
        }

        this.center.add(this.planetCenter);
    }

    animate(fract) {
        if (this.rotationAngle) {
            this.planet.rotation.y += this.rotationAngle * fract;
            this.moons.forEach(moon => {
                moon.rotation.y += this.rotationAngle * fract;
            });
        }

        if (this.translation) {
            this.center.rotation.y += this.translation * fract;
        }

    }
}