class BlahajPet {
    constructor() {
        this.x = Math.random() * (window.innerWidth * 0.32 - 220);
        this.y = Math.random() * (window.innerHeight - 110);
        this.state = 0;
        this.lastDirection = "right";
        this.lastIdle = "idle";
        this.frameIndex = 0;
        this.idlePhase = 0;
        this.swimTime = 0;
        this.animationLocked = false;
        this.frames = [];
        this.container = null;
        this.pet = null;
        this.directionLocked = false;
        this.currentAnimation = null;
        this.animationTimeout = null;
        
        // Load animations
        this.idles = {
            idle_right: this.loadAnimation('idle'),
            idle_left: this.loadAnimation('idleLeft'),
            idle_plant: this.loadAnimation('idle_plant'),
            idle_music: this.loadAnimation('idle_music'),
            idle_candy: this.loadAnimation('idle_candy'),
            idle_fish: this.loadAnimation('idle_fish')
        };
        
        this.swim_right = this.loadAnimation('swim_right');
        this.swim_left = this.loadAnimation('swim_left');
        this.happy = this.loadAnimation('happy');
        
        this.currIdle = this.idles.idle_right;
        this.setupBlahaj();
        this.startBehavior();
    }

    loadAnimation(name) {
        return [`./gifs/${name}.gif`];
    }

    setupBlahaj() {
        this.container = document.createElement('div');
        this.container.id = 'blahaj-container';
        this.container.style.position = 'absolute';
        this.container.style.left = `${this.x}px`;
        this.container.style.top = `${this.y}px`;
        this.container.style.zIndex = '1000';

        this.pet = document.createElement('img');
        this.pet.style.width = '200px';
        this.pet.style.height = 'auto';
        this.container.appendChild(this.pet);

        const sidebar = document.querySelector('.sidebar');
        sidebar.appendChild(this.container);
    }

    setIdleAnim() {
        const thoughts = {
            1: ["idle_plant", this.idles.idle_plant],
            2: ["idle_music", this.idles.idle_music],
            3: ["idle_candy", this.idles.idle_candy],
            4: ["idle_fish", this.idles.idle_fish]
        };

        const num = Math.floor(Math.random() * 8) + 1;

        if ([2, 4].includes(num) && this.lastIdle !== thoughts[num]?.[0]) {
            this.lastIdle = thoughts[num][0];
            this.currIdle = thoughts[num][1];
            this.lastDirection = "right";
        } else if ([1, 3].includes(num) && this.lastIdle !== thoughts[num]?.[0]) {
            this.lastIdle = thoughts[num][0];
            this.currIdle = thoughts[num][1];
            this.lastDirection = "left";
        } else {
            this.currIdle = this.idles[`idle_${this.lastDirection}`];
        }

        return this.currIdle;
    }

    behavior() {
        if (!this.animationLocked) {
            if (this.state >= 1 && this.state <= 3) {
                // Special idle animations
                if (this.currentAnimation !== 'special_idle') {
                    this.currentAnimation = 'special_idle';
                    this.frames = this.setIdleAnim();
                    this.animationLocked = true;
                    if (this.animationTimeout) clearTimeout(this.animationTimeout);
                    
                    this.animationTimeout = setTimeout(() => {
                        this.state = 0;
                        this.currentAnimation = 'idle';
                        this.frames = this.idles[`idle_${this.lastDirection}`];
                        this.animationLocked = false;
                    }, 6000); 
                }
            } else if (this.state === 0) {
                if (this.currentAnimation !== 'idle') {
                    this.currentAnimation = 'idle';
                    this.frames = this.idles[`idle_${this.lastDirection}`];
                }
            } else if (this.state === 4 && !this.directionLocked) {
                this.currentAnimation = 'swim_left';
                this.frames = this.swim_left;
                this.directionLocked = true;
                setTimeout(() => {
                    this.directionLocked = false;
                }, 2000);
            } else if (this.state === 5 && !this.directionLocked) {
                this.currentAnimation = 'swim_right';
                this.frames = this.swim_right;
                this.directionLocked = true;
                setTimeout(() => {
                    this.directionLocked = false;
                }, 2000);
            } else if (this.state === 6) {
                this.frames = this.happy;
            }
        } else if (this.state === 6) {
            this.frames = this.happy; // This lowkey doesn't work
        }

        // Movement
        if (this.state === 0 || this.state === 1 || this.state === 2 || this.state === 3) {
            const heartBar = document.getElementById('heart-bar-container');
            const heartBarTop = heartBar ? heartBar.getBoundingClientRect().top : window.innerHeight;
            const maxY = heartBarTop - 120;

            this.idlePhase += 0.05;
            const verticalOffset = Math.sin(this.idlePhase) * 0.8;
            this.y = Math.max(10, Math.min(maxY, this.y + verticalOffset));

            // Special idles
            if (!this.animationLocked && Math.random() < 0.1) { 
                this.state = Math.floor(Math.random() * 4);
                this.frames = this.setIdleAnim();
            }
        } else if (this.frames === this.swim_left) {
            this.x = Math.max(this.x - 3, 10);
            
            if (Math.random() < 0.02) {
                this.swimDirection = Math.random() < 0.5 ? -1 : 1;
            }
            
            const heartBar = document.getElementById('heart-bar-container');
            const heartBarTop = heartBar ? heartBar.getBoundingClientRect().top : window.innerHeight;
            const maxY = heartBarTop - 120;
            
            this.y = Math.max(10, Math.min(maxY, this.y + (this.swimDirection || 0)));
            
            if (this.x <= 10) {
                this.state = 5;
                this.frames = this.swim_right;
                this.swimDirection = 0;
                this.animationLocked = true;
            }
        } else if (this.frames === this.swim_right) {
            this.x = Math.min(this.x + 3, window.innerWidth * 0.32 - 220);
            
            if (Math.random() < 0.02) {
                this.swimDirection = Math.random() < 0.5 ? -1 : 1;
            }
            
            const heartBar = document.getElementById('heart-bar-container');
            const heartBarTop = heartBar ? heartBar.getBoundingClientRect().top : window.innerHeight;
            const maxY = heartBarTop - 120;
            
            this.y = Math.max(10, Math.min(maxY, this.y + (this.swimDirection || 0)));
            
            if (this.x >= window.innerWidth * 0.32 - 220) {
                this.state = 4;
                this.frames = this.swim_left;
                this.swimDirection = 0;
            }
        }

        this.x = Math.max(0, Math.min(this.x, window.innerWidth * 0.32 - 220));
        this.y = Math.max(0, Math.min(this.y, window.innerHeight - 110));

        // Update position and animation
        this.container.style.left = `${this.x}px`;
        this.container.style.top = `${this.y}px`;

        if (this.frames.length > 0) {
            this.frameIndex = (this.frameIndex + 1) % this.frames.length;
            this.pet.src = this.frames[this.frameIndex];
        }

        // Unlock animation at the end 
        if (this.frameIndex === this.frames.length - 1) {
            this.animationLocked = false;
            if (this.state === 6) {
                this.state = 0;
            }
        }

        requestAnimationFrame(this.behavior.bind(this));
    }

    startBehavior() {
        this.behavior();
        setInterval(() => {
            if (!this.animationLocked) {
                const eventNum = Math.floor(Math.random() * 20) + 1;   
                if (eventNum <= 8) {
                    this.swimTime = 0;
                    this.state = 0;
                    this.animationLocked = true;
                    setTimeout(() => { this.animationLocked = false; }, 2000);
                } else if (eventNum <= 14) {
                    this.swimTime = 0;
                    this.state = Math.floor(Math.random() * 4);
                    this.frames = this.setIdleAnim();
                    this.animationLocked = true;
                    setTimeout(() => { this.animationLocked = false; }, 2000);
                } else {
                    if (this.swimTime === 0) this.swimTime = Date.now();
                    this.lastDirection = Math.random() < 0.5 ? "left" : "right";
                    this.state = this.lastDirection === "left" ? 4 : 5;
                }
            }
        }, 4000);
    }
}

window.blahaj = new BlahajPet();

export function makeHappy() {
    // Put overlay on screen and play animation
    let overlay = document.querySelector('.overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'overlay';
        
        const content = document.createElement('div');
        content.className = 'overlay-content';
        
        const happyBlahaj = document.createElement('img');
        happyBlahaj.src = './gifs/happy.gif';
        
        content.appendChild(happyBlahaj);
        overlay.appendChild(content);
        document.body.appendChild(overlay);
    }
    
    overlay.classList.add('active');
        setTimeout(() => {
        overlay.classList.remove('active');
    }, 1730);
}
export default blahaj;
