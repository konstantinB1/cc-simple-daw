import DragState from "./DragState";
import {
    DRAG_SENSITIVITY,
    MAX_VELOCITY,
    MIN_VELOCITY,
    FRICTION,
} from "./canvasConstants";

// Mock performance.now for consistent timing in tests
const mockPerformanceNow = vi.fn();
global.performance.now = mockPerformanceNow;

describe("DragState", () => {
    let dragState: DragState;

    beforeEach(() => {
        dragState = new DragState();
        mockPerformanceNow.mockReturnValue(0);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("should initialize with default values", () => {
        expect(dragState.isDragging).toBe(false);
        expect(dragState.startX).toBe(0);
        expect(dragState.startViewportOffsetX).toBe(0);
        expect(dragState.lastX).toBe(0);
        expect(dragState.velocity).toBe(0);
        expect(dragState.isDecelerating).toBe(false);
        expect(dragState.hasActiveMomentum).toBe(false);
    });

    describe("start()", () => {
        it("should initialize drag state correctly", () => {
            dragState.start(100, 50);

            expect(dragState.isDragging).toBe(true);
            expect(dragState.startX).toBe(100);
            expect(dragState.lastX).toBe(100);
            expect(dragState.startViewportOffsetX).toBe(50);
            expect(dragState.velocity).toBe(0);
            expect(dragState.isDecelerating).toBe(false);
        });

        it("should reset previous state when starting new drag", () => {
            dragState.velocity = 10;
            dragState.isDecelerating = true;

            dragState.start(200, 75);

            expect(dragState.velocity).toBe(0);
            expect(dragState.isDecelerating).toBe(false);
        });
    });

    describe("update()", () => {
        beforeEach(() => {
            dragState.start(100, 0);
        });

        it("should return 0 if not dragging", () => {
            dragState.isDragging = false;
            const deltaX = dragState.update(150);
            expect(deltaX).toBe(0);
        });

        it("should calculate correct deltaX with drag sensitivity", () => {
            mockPerformanceNow.mockReturnValue(16); // Simulate 16ms frame time

            const deltaX = dragState.update(90); // Move 10 pixels left
            const expectedDelta = (100 - 90) * DRAG_SENSITIVITY;

            expect(deltaX).toBe(expectedDelta);
            expect(dragState.lastX).toBe(90);
        });

        it("should calculate velocity based on movement and time", () => {
            mockPerformanceNow.mockReturnValue(16);

            dragState.update(80); // Move 20 pixels in 16ms

            const expectedVelocity =
                (((100 - 80) * DRAG_SENSITIVITY) / 16) * 16;
            expect(dragState.velocity).toBeCloseTo(expectedVelocity);
        });

        it("should clamp velocity to maximum limits", () => {
            mockPerformanceNow.mockReturnValue(1); // Very short time for high velocity

            dragState.update(0); // Large movement in short time

            expect(Math.abs(dragState.velocity)).toBeLessThanOrEqual(
                MAX_VELOCITY,
            );
        });

        it("should handle minimum delta time to prevent division by zero", () => {
            mockPerformanceNow.mockReturnValue(0); // Same time as start

            const deltaX = dragState.update(90);

            expect(deltaX).toBeDefined();
            expect(isFinite(dragState.velocity)).toBe(true);
        });
    });

    describe("end()", () => {
        beforeEach(() => {
            dragState.start(100, 0);
        });

        it("should reset drag state", () => {
            dragState.end();

            expect(dragState.isDragging).toBe(false);
            expect(dragState.startX).toBe(0);
            expect(dragState.lastX).toBe(0);
            expect(dragState.startViewportOffsetX).toBe(0);
        });

        it("should start deceleration if velocity is above minimum", () => {
            dragState.velocity = MIN_VELOCITY + 1;

            dragState.end();

            expect(dragState.isDecelerating).toBe(true);
            expect(dragState.hasActiveMomentum).toBe(true);
        });

        it("should not start deceleration if velocity is below minimum", () => {
            dragState.velocity = MIN_VELOCITY - 0.1;

            dragState.end();

            expect(dragState.isDecelerating).toBe(false);
            expect(dragState.velocity).toBe(0);
            expect(dragState.hasActiveMomentum).toBe(false);
        });
    });

    describe("updateMomentum()", () => {
        it("should return 0 if not decelerating", () => {
            dragState.isDecelerating = false;

            const deltaX = dragState.updateMomentum();

            expect(deltaX).toBe(0);
        });

        it("should return velocity and apply friction", () => {
            const initialVelocity = 10;
            dragState.velocity = initialVelocity;
            dragState.isDecelerating = true;

            const deltaX = dragState.updateMomentum();

            expect(deltaX).toBe(initialVelocity);
            expect(dragState.velocity).toBe(initialVelocity * FRICTION);
        });

        it("should stop deceleration when velocity drops below minimum", () => {
            dragState.velocity = MIN_VELOCITY - 0.1;
            dragState.isDecelerating = true;

            const deltaX = dragState.updateMomentum();

            expect(deltaX).toBe(0);
            expect(dragState.isDecelerating).toBe(false);
            expect(dragState.velocity).toBe(0);
        });

        it("should continue deceleration while velocity is above minimum", () => {
            dragState.velocity = MIN_VELOCITY + 1;
            dragState.isDecelerating = true;

            dragState.updateMomentum();

            expect(dragState.isDecelerating).toBe(true);
            expect(dragState.velocity).toBeGreaterThan(0);
        });
    });

    describe("hasActiveMomentum", () => {
        it("should return true when decelerating with sufficient velocity", () => {
            dragState.isDecelerating = true;
            dragState.velocity = MIN_VELOCITY + 1;

            expect(dragState.hasActiveMomentum).toBe(true);
        });

        it("should return false when not decelerating", () => {
            dragState.isDecelerating = false;
            dragState.velocity = MIN_VELOCITY + 1;

            expect(dragState.hasActiveMomentum).toBe(false);
        });

        it("should return false when velocity is below minimum", () => {
            dragState.isDecelerating = true;
            dragState.velocity = MIN_VELOCITY - 0.1;

            expect(dragState.hasActiveMomentum).toBe(false);
        });
    });

    describe("physics integration", () => {
        it("should simulate realistic drag and momentum sequence", () => {
            // Start drag
            dragState.start(0, 0);
            expect(dragState.isDragging).toBe(true);

            // Simulate mouse movement over time
            mockPerformanceNow.mockReturnValue(16);
            let deltaX = dragState.update(-20);
            expect(deltaX).toBeGreaterThan(0);

            mockPerformanceNow.mockReturnValue(32);
            deltaX = dragState.update(-40);
            expect(deltaX).toBeGreaterThan(0);

            // End drag with momentum
            const velocityBeforeEnd = dragState.velocity;
            dragState.end();

            if (Math.abs(velocityBeforeEnd) > MIN_VELOCITY) {
                expect(dragState.hasActiveMomentum).toBe(true);

                // Simulate momentum decay
                let momentumSteps = 0;
                while (dragState.hasActiveMomentum && momentumSteps < 100) {
                    const momentumDelta = dragState.updateMomentum();
                    expect(momentumDelta).toBeDefined();
                    momentumSteps++;
                }

                expect(dragState.velocity).toBeLessThan(
                    Math.abs(velocityBeforeEnd),
                );
            }
        });
    });
});
