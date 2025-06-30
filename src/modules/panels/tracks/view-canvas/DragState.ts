import {
    DRAG_SENSITIVITY,
    MAX_VELOCITY,
    MIN_VELOCITY,
    FRICTION,
} from "./canvasConstants";

export default class DragState {
    isDragging = false;
    startX = 0;
    startViewportOffsetX = 0;
    lastX = 0;

    // Physics properties
    velocity = 0;
    lastMoveTime = 0;
    isDecelerating = false;

    start(mouseX: number, currentOffsetX: number) {
        this.isDragging = true;
        this.startX = mouseX;
        this.lastX = mouseX;
        this.startViewportOffsetX = currentOffsetX;
        this.velocity = 0;
        this.lastMoveTime = performance.now();
        this.isDecelerating = false;
    }

    update(mouseX: number): number {
        if (!this.isDragging) return 0;

        const currentTime = performance.now();
        const deltaTime = Math.max(1, currentTime - this.lastMoveTime);
        const deltaX = (this.lastX - mouseX) * DRAG_SENSITIVITY;

        // Calculate velocity based on movement over time
        this.velocity = (deltaX / deltaTime) * 16; // Normalize to ~60fps
        this.velocity = Math.max(
            -MAX_VELOCITY,
            Math.min(MAX_VELOCITY, this.velocity),
        );

        this.lastX = mouseX;
        this.lastMoveTime = currentTime;

        return deltaX;
    }

    end() {
        this.isDragging = false;
        this.startX = 0;
        this.lastX = 0;
        this.startViewportOffsetX = 0;

        // Start momentum scrolling if velocity is significant
        if (Math.abs(this.velocity) > MIN_VELOCITY) {
            this.isDecelerating = true;
        } else {
            this.velocity = 0;
            this.isDecelerating = false;
        }
    }

    updateMomentum(): number {
        if (!this.isDecelerating || Math.abs(this.velocity) < MIN_VELOCITY) {
            this.isDecelerating = false;
            this.velocity = 0;
            return 0;
        }

        const deltaX = this.velocity;
        this.velocity *= FRICTION;

        return deltaX;
    }

    get hasActiveMomentum(): boolean {
        return this.isDecelerating && Math.abs(this.velocity) >= MIN_VELOCITY;
    }
}
