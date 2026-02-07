# Application Pages and Neuro-Logic Documentation

This directory contains the primary functional pages of Lock Focus. The implementation focuses on blending traditional React state management with real-time AI signals.

## Core Implementation: Focus Flow (FocusFlow.jsx)

The Focus Flow game serves as the primary training environment for sustained attention.

### 1. Logic Architecture
The game uses a high-frequency coordinate-based loop powered by `requestAnimationFrame`. To ensure accurate logic without React's state-batching latency, the "Source of Truth" for game objects (ship position, obstacles, projectiles) is maintained in `useRef` hooks and synced to state only for rendering.

### 2. Gaze Detection Loop
The `startDetection` function initializes a 300ms interval that polls the `BlazeFace` model.
- **Head-Pose Estimation**: Instead of binary face presence, we calculate the horizontal `eyeMidX` and compare it to the `nose[0]` coordinate.
- **Attention States**:
    - **Focused**: Nose is centered between eyes (offset < 25% of inter-eye distance).
    - **Distracted**: Nose is offset (user is turning head left/right).
    - **Away**: No face detected in frame.

### 3. Neuro-Report Generation
At the conclusion of a session, the `gameOver` function compiles accumulated refs into a `finalAnalytics` object.
- **Heatmap Generation**: We record `{x, y}` gaze samples throughout the session. These are rendered as blurry CSS radial gradients over a canvas grid to visualize fixation density.

## Core Implementation: Adaptive Reader (Reader.jsx)

The Adaptive Reader brings attention-aware logic to document processing.

### 1. Dynamic Presentation Layer
The reader utilizes a `textarea` designed for minimal distraction. When the `attentionState` shifts to 'distracted' or 'away', the application applies a CSS filter (`blur(2px)`) and reduces opacity to 20%. This provides immediate cognitive feedback, encouraging the user to re-focus on the content.

### 2. Neuro-Sensing Calibration
The Reader includes a dedicated calibration feed. This allows users to visualize how the AI is interpreting their gaze prior to starting a reading session, ensuring they are positioned correctly for optimal detection.

## Other Key Pages
- **ADHDDashboard.jsx**: Orchestrates the high-level focus scores and provides entry points to training modules.
- **SyllableSlasher.jsx**: Implements word-chunking logic to assist with phonological processing for dyslexic users.
- **PeriQuestGame.jsx**: Implements eccentric viewing training using iris-tracking landmarks (experimental).
