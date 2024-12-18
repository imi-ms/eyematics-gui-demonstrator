export interface TonometrieData {
    tonometryType: string; // TODO: List of values here
    recordedDate: string; // datetime
    rightEye: {
        pressure: number; // in mmHG
        isDropped: boolean; // Checkbox for "aufgetropft"
    };
    leftEye: {
        pressure: number; // Left eye pressure
        isDropped: boolean; // Checkbox for "aufgetropft"
    };
}